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

  const { email, turnstileToken } = body;

  if (!email || !turnstileToken) {
    return jsonResponse(400, { error: "Missing required fields" });
  }

  const turnstileOk = await verifyTurnstile(turnstileToken, env.TURNSTILE_SECRET_KEY);
  if (!turnstileOk) {
    return jsonResponse(403, { error: "Verification failed. Please try again." });
  }

  const apiRes = await fetch("https://api.gnosistools.com/v1/keys", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!apiRes.ok) {
    const detail = await apiRes.text();
    return jsonResponse(apiRes.status, { error: "Failed to create API key", detail });
  }

  const apiBody = await apiRes.json();
  const { api_key, replaced } = apiBody.data;

  let emailSent = false;
  try {
    const result = await sendWelcomeEmail({ email, apiKey: api_key, replaced }, env.CF_EMAIL_API_TOKEN);
    emailSent = result.ok;
  } catch {
    emailSent = false;
  }

  return jsonResponse(200, { success: true, apiKey: api_key, replaced, emailSent });
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

async function sendWelcomeEmail({ email, apiKey, replaced }, apiToken) {
  const replacedNote = replaced
    ? "\nNote: Your previous API key has been disabled and replaced by this new one.\n"
    : "";

  const textBody = `Welcome to the Gnosis API!

Here is your API key:

    ${apiKey}

${replacedNote}
Include it in requests as the X-API-Key header. Your free tier includes 1,000 requests per day.

Get started: https://gnosistools.com/getting-started/
API reference: https://gnosistools.com/docs/

Save this key somewhere safe — it cannot be retrieved later.`;

  const res = await fetch(SEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiToken}`,
    },
    body: JSON.stringify({
      from: "noreply@gnosistools.com",
      to: email,
      subject: "Your Gnosis API Key",
      text: textBody,
    }),
  });

  const data = await res.json().catch(() => null);
  if (!res.ok || !data?.success || data.result?.permanent_bounces?.length > 0) {
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
