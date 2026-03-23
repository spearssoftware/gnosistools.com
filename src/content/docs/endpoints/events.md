---
title: Events
description: List and retrieve biblical events with timeline data.
---

## List Events

```
GET /v1/events
```

### Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `q` | string | — | Filter by title |
| `limit` | integer | 50 | Results per page (max 200) |
| `offset` | integer | 0 | Pagination offset |

Results are ordered by `sort_key` (chronological order).

## Get Event

```
GET /v1/events/{slug}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `slug` | string | Unique identifier |
| `uuid` | string | Deterministic UUID v5 |
| `title` | string | Event name |
| `start_year` | integer | Astronomical year |
| `start_year_display` | string | Human-readable date |
| `duration` | string | Duration description |
| `sort_key` | float | Chronological ordering value |
| `participants` | string[] | Person slugs |
| `locations` | string[] | Place slugs |
| `verses` | string[] | OSIS references |
| `parent_event` | string | Parent event slug (for hierarchies) |
| `predecessor` | string | Previous event slug (for sequences) |
