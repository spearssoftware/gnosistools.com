---
title: Hebrew Morphology
description: Word-level Hebrew text with morphological analysis.
---

## Get Hebrew Words

Returns word-level data for an Old Testament verse.

```
GET /v1/hebrew/{osis_ref}
```

### Example

```bash
curl https://api.gnosistool.com/v1/hebrew/Gen.1.1 \
  -H "X-API-Key: gn_your_key_here"
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `word_id` | string | Unique word identifier |
| `position` | integer | Word position in verse |
| `text` | string | Hebrew text |
| `lemma_raw` | string | Raw lemma form |
| `strongs_number` | string | Linked Strong's number |
| `morph` | string | Morphological tag |

The `strongs_number` can be used to look up the full lexicon entry via the [Strong's endpoint](/endpoints/strongs/).
