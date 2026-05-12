---
title: Greek Lexicon
description: Greek lexicon entries from the Dodson dataset.
---

## Get Greek Lexicon Entry

```
GET /v1/greek-lexicon/{strongs_number}
```

Entries are keyed by Strong's Greek number (e.g., `G3056`).

### Example

```bash
curl https://api.gnosistools.com/v1/greek-lexicon/G3056 \
  -H "X-API-Key: gn_your_key_here"
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `strongsNumber` | string | Strong's Greek number |
| `uuid` | string | Deterministic UUID v5 |
| `greek` | string | Greek text |
| `transliteration` | string | Romanized form |
| `partOfSpeech` | string | Grammatical category |
| `shortGloss` | string | Brief English meaning |
| `longGloss` | string | Extended definition |
| `gkNumber` | string | Goodrick-Kohlenberger number |
