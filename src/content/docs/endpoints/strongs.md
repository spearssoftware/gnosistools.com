---
title: Strong's Concordance
description: Look up Hebrew and Greek lexicon entries by Strong's number.
---

## Get Strong's Entry

```
GET /v1/strongs/{number}
```

Numbers are prefixed with `H` (Hebrew) or `G` (Greek).

### Example

```bash
curl https://api.gnosistools.com/v1/strongs/H1 \
  -H "X-API-Key: gn_your_key_here"
```

```json
{
  "data": {
    "number": "H1",
    "uuid": "...",
    "language": "hebrew",
    "lemma": "\u05d0\u05b8\u05d1",
    "transliteration": "'ab",
    "pronunciation": "awb",
    "definition": "A primitive word; father...",
    "kjv_usage": "chief, (fore-) father(-less), patrimony, principal."
  }
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `number` | string | Strong's number (e.g., `H1`, `G3056`) |
| `language` | string | `hebrew` or `greek` |
| `lemma` | string | Original language word |
| `transliteration` | string | Romanized form |
| `pronunciation` | string | Phonetic guide |
| `definition` | string | Full definition text |
| `kjv_usage` | string | Words used in KJV translation |
