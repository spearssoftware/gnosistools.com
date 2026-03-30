export interface PersonData {
  slug: string;
  uuid: string;
  name: string;
  gender: string;
  birth_year?: number;
  death_year?: number;
  birth_year_display?: string;
  death_year_display?: string;
  birth_place?: string;
  death_place?: string;
  father?: string;
  mother?: string;
  children?: string[];
  siblings?: string[];
  partners?: string[];
  verse_count?: number;
  name_meaning?: string;
  people_groups?: string[];
}

export interface EventData {
  slug: string;
  uuid: string;
  title: string;
  start_year?: number;
  start_year_display?: string;
  duration?: string;
  sort_key?: number;
  participants?: string[];
  locations?: string[];
  verses?: string[];
  parent_event?: string;
  predecessor?: string;
}

export interface TreeNode {
  person: PersonData;
  parents: TreeNode[];
  children: TreeNode[];
  expanded: boolean;
  loading: boolean;
}
