export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const slug = url.searchParams.get("slug");

  if (!slug) {
    return jsonResponse(400, { error: "Missing slug parameter" });
  }

  const PAGE_SIZE = 200;
  let offset = 0;
  let total = null;
  const allEvents = [];

  do {
    const apiUrl = `https://api.gnosistools.com/v1/events?limit=${PAGE_SIZE}&offset=${offset}`;
    const res = await fetch(apiUrl, {
      headers: { "X-API-Key": env.GNOSIS_API_KEY },
    });

    if (!res.ok) {
      return jsonResponse(res.status, { error: "Upstream error fetching events" });
    }

    const json = await res.json();
    const page = json.data ?? [];
    allEvents.push(...page);

    if (total === null) {
      total = json.meta?.total ?? page.length;
    }

    offset += PAGE_SIZE;

    // Avoid hitting upstream rate limits between pages
    if (offset < total) {
      await new Promise((r) => setTimeout(r, 200));
    }
  } while (offset < total);

  const filtered = allEvents
    .filter(
      (event) =>
        Array.isArray(event.participants) && event.participants.includes(slug)
    )
    .sort((a, b) => (a.sort_key ?? 0) - (b.sort_key ?? 0));

  return jsonResponse(200, { data: filtered });
}

function jsonResponse(status, data) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}
