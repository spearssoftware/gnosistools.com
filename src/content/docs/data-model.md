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
- Geography: `birthPlace`, `deathPlace` (link to Place)
- Dates: `birthYear`, `deathYear` (astronomical years, negative = BC)
- Enrichment: `nameMeaning`, `firstMention`
- Groups: `peopleGroups` (link to PeopleGroup)

### Place
Geographic locations with coordinates and classifications.
- Coordinates: `latitude`, `longitude` (where available)
- Names: `name`, `kjvName`, `esvName`, `modernName`
- Classification: `featureType` (City, Region, Water, etc.), `featureSubType`

### Event
Biblical events with chronological ordering and participants.
- Timeline: `startYear`, `sortKey` (for ordering), `duration`
- Relations: `participants` (Person), `locations` (Place)
- Hierarchy: `parentEvent`, `predecessor` (self-references)

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

### Greek Morphology
Word-level New Testament data with morphological tags and Strong's linkage.

### Greek Lexicon
Greek lexicon entries from the Dodson dataset with Goodrick-Kohlenberger number references.

## Relationships

```
Person ──birthPlace──> Place
Person ──father/mother──> Person
Person ──children──> Person
Event ──participants──> Person
Event ──locations──> Place
Event ──parentEvent──> Event
Person ──peopleGroups──> PeopleGroup
HebrewWord ──strongsNumber──> Strong's
GreekWord ──strongsNumber──> Strong's
All entities ──verses──> Verse (OSIS refs)
```

## Identifiers

- **Slug**: URL-friendly string ID (e.g., `abraham`, `jerusalem`)
- **UUID**: Deterministic UUID v5, stable across builds
- **OSIS Ref**: Verse references in `Book.Chapter.Verse` format
