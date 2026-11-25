const RECIPIENTS = {
  "gnosis-pricing": "info@spearssoftware.com",
  "gnosis-general": "info@spearssoftware.com",
};

const SEND_URL =
  "https://api.cloudflare.com/client/v4/accounts/55613a1e13193324a5d8823e013cc00a/email/sending/send";

export async function onRequestPost(context) {
  const { request, env } = context;

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

  const to = RECIPIENTS[subject] || RECIPIENTS["gnosis-general"];

  const turnstileOk = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY);
  if (!turnstileOk) {
    return jsonResponse(403, { error: "Turnstile verification failed" });
  }

  const result = await sendEmail({ name, email, message, subject, to }, env.CF_EMAIL_API_TOKEN);
  if (!result.ok) {
    return jsonResponse(500, { error: "Failed to send message" });
  }

  return jsonResponse(200, { success: true });
}

async function verifyTurnstile(token, secret) {
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secret, response: token }),
  });
  const data = await res.json();
  return data.success === true;
}

async function sendEmail({ name, email, message, subject, to }, apiToken) {
  const subjectLine = `Gnosis API Inquiry: ${name}`;

  const res = await fetch(SEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify({
      from: to,
      to,
      reply_to: email,
      subject: subjectLine,
      text: `Name: ${name}\nEmail: ${email}\nSource: ${subject}\n\n${message}`,
    }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success || data.result.permanent_bounces.length > 0) {
    console.error("Email send failed", res.status, JSON.stringify(data?.errors ?? []));
    return { ok: false };
  }
  return { ok: true };
}

function jsonResponse(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
