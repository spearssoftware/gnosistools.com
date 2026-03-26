---
title: Meta & Usage
description: Dataset metadata and per-key usage information.
---

## Get Dataset Metadata

Returns the dataset version, build date, and row counts for all tables.

```
GET /v1/meta
```

### Example

```bash
curl https://api.gnosistools.com/v1/meta \
  -H "X-API-Key: gn_your_key_here"
```

```json
{
  "data": {
    "version": "1.1.0",
    "build_date": "2026-03-24",
    "counts": {
      "person": 3121,
      "place": 1245,
      "event": 912,
      "people_group": 87,
      "strongs": 8674,
      "dictionary_entry": 4912,
      "topic": 523,
      "lexicon_entry": 8674,
      "cross_reference": 72418,
      "hebrew_word": 305210,
      "greek_word": 142301,
      "greek_lexicon_entry": 5624
    }
  }
}
```

## Check Your Usage

Returns your API key's tier and daily request count.

```
GET /v1/usage
```

### Example

```bash
curl https://api.gnosistools.com/v1/usage \
  -H "X-API-Key: gn_your_key_here"
```

```json
{
  "data": {
    "email": "you@example.com",
    "tier": "free",
    "daily_limit": 1000,
    "daily_used": 42
  }
}
```
