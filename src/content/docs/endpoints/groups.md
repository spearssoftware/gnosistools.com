---
title: Groups
description: List and retrieve people groups.
---

## List Groups

```
GET /v1/groups
```

### Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `q` | string | — | Filter by name (substring match) |
| `limit` | integer | 50 | Results per page (max 200) |
| `offset` | integer | 0 | Pagination offset |

### Example

```bash
curl "https://api.gnosistools.com/v1/groups?q=israel&limit=5" \
  -H "X-API-Key: gn_your_key_here"
```

## Get Group

```
GET /v1/groups/{slug}
```

### Example

```bash
curl https://api.gnosistools.com/v1/groups/israelites \
  -H "X-API-Key: gn_your_key_here"
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `slug` | string | Unique identifier |
| `uuid` | string | Deterministic UUID v5 |
| `name` | string | Display name |
| `members` | string[] | Person slugs |
