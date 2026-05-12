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
| `lexicalId` | string | 3-letter identifier |
| `hebrew` | string | Hebrew text |
| `transliteration` | string | Romanized form |
| `partOfSpeech` | string | Grammatical category |
| `gloss` | string | Short English meaning |
| `strongsNumber` | string | Linked Strong's number |
| `twotNumber` | string | Theological Wordbook of the OT reference |
