---
title: Places
description: List and retrieve biblical locations with coordinates.
---

## List Places

```
GET /v1/places
```

### Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `q` | string | — | Filter by name |
| `has_coordinates` | boolean | — | Filter to places with/without geo data |
| `feature_type` | string | — | Filter by type (e.g., `City`, `Water`) |
| `limit` | integer | 50 | Results per page (max 200) |
| `offset` | integer | 0 | Pagination offset |

### Example

```bash
curl "https://api.gnosistool.com/v1/places?q=jerusalem" \
  -H "X-API-Key: gn_your_key_here"
```

## Get Place

```
GET /v1/places/{slug}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `slug` | string | Unique identifier |
| `uuid` | string | Deterministic UUID v5 |
| `name` | string | Primary name |
| `kjv_name` | string | Name in the KJV |
| `esv_name` | string | Name in the ESV |
| `latitude` | float | Geographic latitude |
| `longitude` | float | Geographic longitude |
| `coordinate_source` | string | Source of the coordinates |
| `feature_type` | string | Classification (City, Region, Water, etc.) |
| `feature_sub_type` | string | Sub-classification |
| `modern_name` | string | Modern equivalent name |
