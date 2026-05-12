export interface PersonData {
  slug: string;
  uuid: string;
  name: string;
  gender: string;
  birthYear?: number;
  deathYear?: number;
  birthYearDisplay?: string;
  deathYearDisplay?: string;
  earliestYearMentioned?: number;
  latestYearMentioned?: number;
  earliestYearMentionedDisplay?: string;
  latestYearMentionedDisplay?: string;
  birthPlace?: string;
  deathPlace?: string;
  father?: string;
  mother?: string;
  children?: string[];
  siblings?: string[];
  partners?: string[];
  verseCount?: number;
  nameMeaning?: string;
  peopleGroups?: string[];
}

export interface EventData {
  slug: string;
  uuid: string;
  title: string;
  startYear?: number;
  startYearDisplay?: string;
  duration?: string;
  sortKey?: number;
  participants?: string[];
  locations?: string[];
  verses?: string[];
  parentEvent?: string;
  predecessor?: string;
}

export interface TreeNode {
  person: PersonData;
  parents: TreeNode[];
  children: TreeNode[];
  expanded: boolean;
  loading: boolean;
}
