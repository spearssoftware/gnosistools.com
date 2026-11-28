const TO = "info@spearssoftware.com";
const SOURCES = new Set(["gnosis-pricing", "gnosis-general"]);

// Fixed acknowledgement text only. Nothing the visitor typed is echoed back, so the form cannot
// be used to deliver someone else's words to an address they entered.
const ACK = {
  subject: "We received your Gnosis API message",
  text: `Thanks for contacting us about the Gnosis API. This is an automatic confirmation that your message reached us, and we'll reply personally, usually within one business day.

In the meantime, these pages cover getting started and the API itself:

Getting started: https://gnosistools.com/getting-started/
Developers: https://gnosistools.com/developers/

If you didn't contact us, you can ignore this email.

Spears Software`,
};

// A single plain address (RFC 5322 atext local part, ASCII domain): no group, comment or
// quoting syntax, so it can never name another recipient when the acknowledgement goes to it.
const EMAIL_PATTERN = /^[A-Za-z0-9!#$%&'*+/=?^_`{|}~.-]{1,64}@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+$/;
const SITE_HOSTS = new Set(["gnosistools.com"]);
const OWN_ADDRESS = /[@.]spearssoftware\.com$/i;
const ACK_WINDOW_SECONDS = 24 * 60 * 60;

const SEND_URL =
  "https://api.cloudflare.com/client/v4/accounts/55613a1e13193324a5d8823e013cc00a/email/sending/send";

export async function onRequestPost(context) {
  const { request, env } = context;

  // The function also answers on *.pages.dev, which has its own cache (so its own
  // acknowledgement limit). Only the site itself may send.
  if (!SITE_HOSTS.has(new URL(request.url).hostname)) {
    return jsonResponse(404, { error: "Not found" });
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(400, { error: "Invalid JSON" });
  }

  const { name, email, message, subject, turnstileToken } = body;

  if (!name || !email || !message || !turnstileToken) {
    return jsonResponse(400, { error: "Missing required fields" });
  }

  if (typeof name !== "string" || typeof message !== "string") {
    return jsonResponse(400, { error: "Invalid name or message" });
  }

  if (name.length > 200 || message.length > 10000) {
    return jsonResponse(400, { error: "Name or message is too long" });
  }

  if (typeof email !== "string" || email.length > 254 || !EMAIL_PATTERN.test(email)) {
    return jsonResponse(400, { error: "Invalid email address" });
  }

  const source = SOURCES.has(subject) ? subject : "gnosis-general";

  const turnstileOk = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY);
  if (!turnstileOk) {
    return jsonResponse(403, { error: "Turnstile verification failed" });
  }

  const sent = await postEmail(
    {
      from: TO,
      to: TO,
      reply_to: email,
      subject: `Gnosis API Inquiry: ${name}`,
      text: `Name: ${name}\nEmail: ${email}\nSource: ${source}\n\n${message}`,
    },
    env.CF_EMAIL_API_TOKEN,
    "Email",
  );
  if (!sent) {
    return jsonResponse(500, { error: "Failed to send message" });
  }

  context.waitUntil(acknowledge(email, env.CF_EMAIL_API_TOKEN));

  return jsonResponse(200, { success: true });
}

async function verifyTurnstile(token, secret) {
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, response: token }),
  });
  const data = await res.json();
  return data.success === true && SITE_HOSTS.has(data.hostname);
}

async function postEmail(payload, apiToken, label) {
  const res = await fetch(SEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await res.json().catch(() => null);
  const bounces = data?.result?.permanent_bounces?.length ?? 0;
  if (!res.ok || !data?.success || bounces > 0) {
    console.error(`${label} send failed`, res.status, JSON.stringify(data?.errors ?? []), "bounces:", bounces);
    return false;
  }
  return true;
}

// Sends the fixed confirmation at most once per address per day (per Cloudflare location,
// since it uses the Cache API). Failures are logged and never affect the visitor's response:
// their message has already been delivered.
async function acknowledge(email, apiToken) {
  const address = email.toLowerCase();
  if (OWN_ADDRESS.test(address)) {
    return;
  }

  try {
    const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(address));
    const hex = [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
    const key = new Request(`https://ack.invalid/${hex}`);
    if (await caches.default.match(key)) {
      return;
    }
    await caches.default.put(key, new Response("1", { headers: { "Cache-Control": `max-age=${ACK_WINDOW_SECONDS}` } }));

    await postEmail(
      {
        from: TO,
        to: email,
        reply_to: TO,
        subject: ACK.subject,
        text: ACK.text,
        headers: { "Auto-Submitted": "auto-replied" },
      },
      apiToken,
      "Acknowledgement",
    );
  } catch (err) {
    console.error("Acknowledgement send failed", err);
  }
}

function jsonResponse(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
