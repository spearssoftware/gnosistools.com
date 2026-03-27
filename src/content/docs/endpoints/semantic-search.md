---
title: Semantic Search
description: Natural-language semantic search across all content.
---

## Semantic Search

Search using natural language queries. Best for discovery-style queries like "verses about forgiveness" or "what does the Bible say about patience". For exact entity name lookups, use the [name search](/endpoints/search/) endpoint instead.

```
GET /v1/search/semantic?q={query}
```

### Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `q` | string | **required** | Natural language search query |
| `limit` | integer | 10 | Results per page (max 50) |
| `type` | string | — | Filter by type: `verse`, `person`, `place`, `event`, `topic`, `dictionary`, `strongs`, `lexicon`, `greek_lexicon` |

### Example

```bash
curl "https://api.gnosistools.com/v1/search/semantic?q=verses+about+forgiveness&limit=5" \
  -H "X-API-Key: gn_your_key_here"
```

```json
{
  "data": [
    {
      "slug": "ephesians-4-32",
      "type": "verse",
      "text": "Be kind to one another, tenderhearted, forgiving one another, as God in Christ forgave you.",
      "score": 0.92
    },
    {
      "slug": "colossians-3-13",
      "type": "verse",
      "text": "Bearing with one another and, if one has a complaint against another, forgiving each other...",
      "score": 0.89
    }
  ]
}
```

Results span verses, people, places, events, topics, dictionary entries, Strong's numbers, and lexicon entries.
