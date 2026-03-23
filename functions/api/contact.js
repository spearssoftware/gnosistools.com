const RECIPIENTS = {
  "gnosis-pricing": "info@spearssoftware.com",
  "gnosis-general": "info@spearssoftware.com",
};

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

  const result = await sendEmail({ name, email, message, subject, to }, env.POSTMARK_SERVER_TOKEN);
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

async function sendEmail({ name, email, message, subject, to }, serverToken) {
  const subjectLine = `Gnosis API Inquiry: ${name}`;

  const res = await fetch("https://api.postmarkapp.com/email", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Postmark-Server-Token": serverToken,
      Accept: "application/json",
    },
    body: JSON.stringify({
      From: to,
      To: to,
      ReplyTo: email,
      Subject: subjectLine,
      TextBody: `Name: ${name}\nEmail: ${email}\nSource: ${subject}\n\n${message}`,
      MessageStream: "spearssoftwareforms",
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    return { ok: false, detail };
  }
  return { ok: true };
}

function jsonResponse(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
