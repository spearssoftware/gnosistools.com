---
title: People
description: List and retrieve biblical people.
---

## List People

```
GET /v1/people
```

### Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `q` | string | — | Filter by name (substring match) |
| `gender` | string | — | Filter by gender (`Male` or `Female`) |
| `limit` | integer | 50 | Results per page (max 200) |
| `offset` | integer | 0 | Pagination offset |

### Example

```bash
curl "https://api.gnosistools.com/v1/people?q=abraham&limit=5" \
  -H "X-API-Key: gn_your_key_here"
```

```json
{
  "data": [
    {
      "slug": "abraham",
      "name": "Abraham",
      "gender": "Male",
      "birthYearDisplay": "1998 BC",
      "verseCount": 290
    }
  ],
  "meta": { "total": 1, "limit": 5, "offset": 0 }
}
```

## Get Person

```
GET /v1/people/{slug}
```

### Example

```bash
curl https://api.gnosistools.com/v1/people/abraham \
  -H "X-API-Key: gn_your_key_here"
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `slug` | string | Unique identifier |
| `uuid` | string | Deterministic UUID v5 |
| `name` | string | Display name |
| `gender` | string | `Male` or `Female` |
| `birthYear` | integer | Astronomical year (negative = BC) |
| `deathYear` | integer | Astronomical year |
| `birthYearDisplay` | string | Human-readable (e.g., "1998 BC") |
| `deathYearDisplay` | string | Human-readable |
| `birthPlace` | string | Place slug |
| `deathPlace` | string | Place slug |
| `father` | string | Person slug |
| `mother` | string | Person slug |
| `siblings` | string[] | Person slugs |
| `children` | string[] | Person slugs |
| `partners` | string[] | Person slugs |
| `verseCount` | integer | Number of verse references |
| `verses` | string[] | OSIS references (e.g., `Gen.11.26`) |
| `firstMention` | string | First verse reference |
| `nameMeaning` | string | Etymology of the name |
| `peopleGroups` | string[] | Group slugs |
