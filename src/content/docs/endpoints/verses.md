---
title: Verses
description: Get entities for a verse and cross-references.
---

## Get Verse Entities

Returns all people, places, and events mentioned in a verse.

```
GET /v1/verses/{osis_ref}
```

### Example

```bash
curl https://api.gnosistool.com/v1/verses/Gen.12.1 \
  -H "X-API-Key: gn_your_key_here"
```

```json
{
  "data": {
    "osis_ref": "Gen.12.1",
    "people": ["abraham"],
    "places": ["haran"],
    "events": ["call-of-abram"]
  }
}
```

OSIS references follow the format `Book.Chapter.Verse` (e.g., `Gen.12.1`, `Rev.21.4`).

## Get Cross-References

```
GET /v1/verses/{osis_ref}/cross-references
```

Returns related verses, sorted by community vote count.

```json
{
  "data": [
    {
      "from_verse": "Gen.12.1",
      "to_verse_start": "Acts.7.2",
      "to_verse_end": null,
      "votes": 156
    }
  ],
  "meta": { "total": 12, "limit": 12, "offset": 0 }
}
```
