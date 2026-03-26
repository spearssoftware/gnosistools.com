---
title: Greek Morphology
description: Word-level Greek text with morphological analysis.
---

## Get Greek Words

Returns word-level data for a New Testament verse.

```
GET /v1/greek/{osis_ref}
```

### Example

```bash
curl https://api.gnosistools.com/v1/greek/John.3.16 \
  -H "X-API-Key: gn_your_key_here"
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `word_id` | string | Unique word identifier |
| `position` | integer | Word position in verse |
| `text` | string | Greek text |
| `lemma` | string | Lemma form |
| `strongs_number` | string | Linked Strong's number |
| `morph` | string | Morphological tag |

The `strongs_number` can be used to look up the full entry via the [Greek Lexicon endpoint](/endpoints/greek-lexicon/) or the [Strong's endpoint](/endpoints/strongs/).
