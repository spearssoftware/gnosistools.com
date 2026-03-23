---
title: Dictionary
description: Biblical dictionary entries from multiple historical sources.
---

## List Dictionary Entries

```
GET /v1/dictionary
```

### Parameters

| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `q` | string | — | Filter by name |
| `limit` | integer | 50 | Results per page (max 200) |
| `offset` | integer | 0 | Pagination offset |

## Get Dictionary Entry

```
GET /v1/dictionary/{slug}
```

Each entry may include definitions from multiple historical sources: Smith's Bible Dictionary, Hastings, Schaff, and Hitchcock.

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `slug` | string | Unique identifier |
| `name` | string | Entry headword |
| `definitions` | array | List of definitions from different sources |
| `definitions[].source` | string | Dictionary source (smith, hastings, schaff, hitchcock) |
| `definitions[].text` | string | Definition text |
| `scripture_refs` | string[] | Related OSIS references |
