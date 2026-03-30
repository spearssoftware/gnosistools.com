export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const slugsParam = url.searchParams.get("slugs");

  if (!slugsParam) {
    return jsonResponse(400, { error: "Missing slugs parameter" });
  }

  const slugs = slugsParam.split(",").map((s) => s.trim()).filter(Boolean);

  if (slugs.length === 0) {
    return jsonResponse(400, { error: "slugs parameter is empty" });
  }

  if (slugs.length > 20) {
    return jsonResponse(400, { error: "Too many slugs — max 20" });
  }

  const results = await Promise.allSettled(
    slugs.map(async (slug) => {
      const res = await fetch(
        `https://api.gnosistools.com/v1/people/${encodeURIComponent(slug)}`,
        { headers: { "X-API-Key": env.GNOSIS_API_KEY } }
      );
      if (!res.ok) throw new Error(`${res.status}`);
      const json = await res.json();
      return { slug, data: json.data };
    })
  );

  const aggregated = {};
  for (const result of results) {
    if (result.status === "fulfilled") {
      aggregated[result.value.slug] = result.value.data;
    }
  }

  return jsonResponse(200, aggregated);
}

function jsonResponse(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
