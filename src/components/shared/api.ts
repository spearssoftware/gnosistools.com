import type { PersonData, EventData } from './types';

const personCache = new Map<string, PersonData>();

export async function fetchPerson(slug: string): Promise<PersonData | null> {
  if (personCache.has(slug)) return personCache.get(slug)!;
  try {
    const res = await fetch(`/api/people/${encodeURIComponent(slug)}`);
    if (!res.ok) return null;
    const body = await res.json();
    const person = body.data;
    if (person) personCache.set(slug, person);
    return person || null;
  } catch {
    return null;
  }
}

export async function fetchPeopleBatch(slugs: string[]): Promise<Record<string, PersonData>> {
  // Filter out already-cached slugs
  const uncached = slugs.filter(s => !personCache.has(s));
  const result: Record<string, PersonData> = {};

  // Add cached entries to result
  for (const s of slugs) {
    const cached = personCache.get(s);
    if (cached) result[s] = cached;
  }

  if (uncached.length === 0) return result;

  try {
    const res = await fetch(`/api/people-batch?slugs=${uncached.map(encodeURIComponent).join(',')}`);
    if (!res.ok) return result;
    const data = await res.json();
    for (const [slug, person] of Object.entries(data)) {
      personCache.set(slug, person as PersonData);
      result[slug] = person as PersonData;
    }
  } catch {
    // return what we have from cache
  }

  return result;
}

export async function fetchEventsForPerson(slug: string): Promise<EventData[]> {
  try {
    const res = await fetch(`/api/events-by-person?slug=${encodeURIComponent(slug)}`);
    if (!res.ok) {
      console.error(`events-by-person returned ${res.status} for ${slug}`);
      return [];
    }
    const body = await res.json();
    return body.data || [];
  } catch (e) {
    console.error('Failed to fetch events for', slug, e);
    return [];
  }
}

export function clearPersonCache(): void {
  personCache.clear();
}
