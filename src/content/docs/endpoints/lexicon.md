---
title: Lexicon
description: Hebrew lexicon entries with TWOT references.
---

## Get Lexicon Entry

```
GET /v1/lexicon/{lexical_id}
```

Lexicon entries are keyed by 3-letter lexical IDs.

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `lexical_id` | string | 3-letter identifier |
| `hebrew` | string | Hebrew text |
| `transliteration` | string | Romanized form |
| `part_of_speech` | string | Grammatical category |
| `gloss` | string | Short English meaning |
| `strongs_number` | string | Linked Strong's number |
| `twot_number` | string | Theological Wordbook of the OT reference |
