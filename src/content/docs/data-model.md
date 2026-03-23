---
title: Data Model
description: Entity types, fields, and relationships in the Gnosis knowledge graph.
---

## Overview

Gnosis models the biblical world as a knowledge graph with interconnected entity types. Entities reference each other by slug ID.

## Entity Types

### Person
Biblical figures with family relationships, dates, and verse references.
- Family tree: `father`, `mother`, `siblings`, `children`, `partners`
- Geography: `birth_place`, `death_place` (link to Place)
- Dates: `birth_year`, `death_year` (astronomical years, negative = BC)
- Enrichment: `name_meaning`, `first_mention`
- Groups: `people_groups` (link to PeopleGroup)

### Place
Geographic locations with coordinates and classifications.
- Coordinates: `latitude`, `longitude` (where available)
- Names: `name`, `kjv_name`, `esv_name`, `modern_name`
- Classification: `feature_type` (City, Region, Water, etc.), `feature_sub_type`

### Event
Biblical events with chronological ordering and participants.
- Timeline: `start_year`, `sort_key` (for ordering), `duration`
- Relations: `participants` (Person), `locations` (Place)
- Hierarchy: `parent_event`, `predecessor` (self-references)

### PeopleGroup
Tribes, ethnic groups, and other named groups with their members.

### CrossReference
Verse-to-verse connections with community vote scores.

### Strong's Concordance
Hebrew (H) and Greek (G) lexicon entries with definitions.

### Dictionary
Entries from four historical dictionaries: Smith's, Hastings, Schaff, and Hitchcock.

### Topic
Topical scripture arrangements with sub-aspects and verse lists.

### Hebrew Morphology
Word-level Old Testament data with morphological tags and Strong's linkage.

### Lexicon
Hebrew lexicon entries with TWOT (Theological Wordbook of the OT) references.

## Relationships

```
Person ──birth_place──> Place
Person ──father/mother──> Person
Person ──children──> Person
Event ──participants──> Person
Event ──locations──> Place
Event ──parent_event──> Event
Person ──people_groups──> PeopleGroup
HebrewWord ──strongs_number──> Strong's
All entities ──verses──> Verse (OSIS refs)
```

## Identifiers

- **Slug**: URL-friendly string ID (e.g., `abraham`, `jerusalem`)
- **UUID**: Deterministic UUID v5, stable across builds
- **OSIS Ref**: Verse references in `Book.Chapter.Verse` format
