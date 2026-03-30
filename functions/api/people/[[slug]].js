export async function onRequestGet(context) {
  const { request, env, params } = context;

  if (params.slug) {
    const slug = Array.isArray(params.slug) ? params.slug.join("/") : params.slug;
    const apiUrl = `https://api.gnosistools.com/v1/people/${encodeURIComponent(slug)}`;
    const res = await fetch(apiUrl, {
      headers: { "X-API-Key": env.GNOSIS_API_KEY },
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), {
      status: res.status,
      headers: { "Content-Type": "application/json" },
    });
  }

  const url = new URL(request.url);
  const q = url.searchParams.get("q");
  const limit = url.searchParams.get("limit");
  const offset = url.searchParams.get("offset");

  const upstream = new URL("https://api.gnosistools.com/v1/people");
  if (q) upstream.searchParams.set("q", q);
  if (limit) upstream.searchParams.set("limit", limit);
  if (offset) upstream.searchParams.set("offset", offset);

  const res = await fetch(upstream.toString(), {
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
