---
title: Topics
description: Topical arrangement of scriptures with aspects and verses.
---

## List Topics

```
GET /v1/topics
```

### Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `q` | string | — | Filter by name |
| `limit` | integer | 50 | Results per page (max 200) |
| `offset` | integer | 0 | Pagination offset |

## Get Topic

```
GET /v1/topics/{slug}
```

Topics contain aspects (sub-categories), each with a list of related verses.

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `slug` | string | Unique identifier |
| `name` | string | Topic name |
| `aspects` | array | Sub-categories within the topic |
| `aspects[].label` | string | Aspect description |
| `aspects[].source` | string | Data source |
| `aspects[].verses` | string[] | OSIS references |
| `see_also` | string[] | Related topic slugs |
