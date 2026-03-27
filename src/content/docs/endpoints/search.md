---
title: Search
description: Full-text search across all entities.
---

## Full-Text Search

Search across all entity types by name.

```
GET /v1/search?q={query}
```

### Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `q` | string | **required** | Search query |
| `limit` | integer | 50 | Results per page (max 200) |
| `offset` | integer | 0 | Pagination offset |

### Example

```bash
curl "https://api.gnosistools.com/v1/search?q=moses" \
  -H "X-API-Key: gn_your_key_here"
```

```json
{
  "data": [
    {
      "slug": "moses",
      "name": "Moses",
      "entity_type": "person",
      "uuid": "..."
    },
    {
      "slug": "moses-law",
      "name": "Moses, Law of",
      "entity_type": "dictionary",
      "uuid": "..."
    }
  ],
  "meta": { "total": 2, "limit": 50, "offset": 0 }
}
```

Results include matches from people, places, events, groups, dictionary entries, and topics.
