export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const q = url.searchParams.get("q");

  if (!q) {
    return jsonResponse(400, { error: "Missing q parameter" });
  }

  const apiUrl = `https://api.gnosistools.com/v1/search?q=${encodeURIComponent(q)}&limit=10`;
  const res = await fetch(apiUrl, {
    headers: { "X-API-Key": env.GNOSIS_API_KEY },
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), {
    status: res.status,
    headers: { "Content-Type": "application/json" },
  });
}

function jsonResponse(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
