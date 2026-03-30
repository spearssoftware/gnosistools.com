import { useState, useEffect, useCallback } from 'react';
import { fetchPerson, fetchPeopleBatch } from '../shared/api';
import type { PersonData, TreeNode } from '../shared/types';
import { colors } from '../shared/theme';
import { TreeVisualization } from './TreeVisualization';

interface FamilyTreeExplorerProps {
  initialSlug?: string;
  onPersonChange?: (slug: string, name: string) => void;
}

// Build a minimal TreeNode from a PersonData and a map of loaded people
function buildNode(person: PersonData, peopleMap: Map<string, PersonData>, depth: number): TreeNode {
  const parents: TreeNode[] = [];
  const children: TreeNode[] = [];

  if (depth > 0) {
    if (person.father) {
      const fatherData = peopleMap.get(person.father);
      if (fatherData) parents.push(buildNode(fatherData, peopleMap, depth - 1));
    }
    if (person.mother) {
      const motherData = peopleMap.get(person.mother);
      if (motherData) parents.push(buildNode(motherData, peopleMap, depth - 1));
    }
    for (const childSlug of person.children ?? []) {
      const childData = peopleMap.get(childSlug);
      if (childData) children.push(buildNode(childData, peopleMap, depth - 1));
    }
  }

  return {
    person,
    parents,
    children,
    expanded: parents.length > 0 || children.length > 0 || depth === 0,
    loading: false,
  };
}

// Walk the tree to find a node by slug
function findNode(node: TreeNode, slug: string): TreeNode | null {
  if (node.person.slug === slug) return node;
  for (const p of node.parents) {
    const found = findNode(p, slug);
    if (found) return found;
  }
  for (const c of node.children) {
    const found = findNode(c, slug);
    if (found) return found;
  }
  return null;
}

// Immutably update a node in the tree by slug
function updateNode(node: TreeNode, slug: string, updater: (n: TreeNode) => TreeNode): TreeNode {
  if (node.person.slug === slug) return updater(node);
  return {
    ...node,
    parents: node.parents.map(p => updateNode(p, slug, updater)),
    children: node.children.map(c => updateNode(c, slug, updater)),
  };
}

export function FamilyTreeExplorer({ initialSlug = 'jesus-son-of-joseph', onPersonChange }: FamilyTreeExplorerProps) {
  const [rootNode, setRootNode] = useState<TreeNode | null>(null);
  const [selectedSlug, setSelectedSlug] = useState(initialSlug);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setRootNode(null);

    async function load() {
      const root = await fetchPerson(initialSlug);
      if (!root) {
        setLoading(false);
        return;
      }

      // Collect all slugs to fetch: parents + children of root
      const level1Slugs = [
        root.father,
        root.mother,
        ...(root.children ?? []),
      ].filter((s): s is string => s != null);

      const level1Map = await fetchPeopleBatch(level1Slugs);

      // Collect grandparent slugs
      const grandparentSlugs: string[] = [];
      for (const p of Object.values(level1Map)) {
        if (p.father) grandparentSlugs.push(p.father);
        if (p.mother) grandparentSlugs.push(p.mother);
      }
      const grandparentMap = await fetchPeopleBatch(grandparentSlugs);

      // Build unified map
      const peopleMap = new Map<string, PersonData>();
      peopleMap.set(root.slug, root);
      for (const [slug, p] of Object.entries(level1Map)) peopleMap.set(slug, p);
      for (const [slug, p] of Object.entries(grandparentMap)) peopleMap.set(slug, p);

      const tree = buildNode(root, peopleMap, 2);
      setRootNode(tree);
      setLoading(false);
    }

    load();
  }, [initialSlug]);

  const handleExpand = useCallback(async (slug: string) => {
    if (!rootNode) return;

    // Mark node as loading
    setRootNode(prev => prev ? updateNode(prev, slug, n => ({ ...n, loading: true })) : prev);

    const person = await fetchPerson(slug);
    if (!person) {
      setRootNode(prev => prev ? updateNode(prev, slug, n => ({ ...n, loading: false })) : prev);
      return;
    }

    const relSlugs = [
      person.father,
      person.mother,
      ...(person.children ?? []),
    ].filter((s): s is string => s != null);

    const relMap = await fetchPeopleBatch(relSlugs);

    setRootNode(prev => {
      if (!prev) return prev;
      return updateNode(prev, slug, n => {
        const parents: TreeNode[] = [];
        const children: TreeNode[] = [];

        if (person.father) {
          const fd = relMap[person.father];
          if (fd) {
            const existing = findNode(prev, person.father);
            parents.push(existing ?? { person: fd, parents: [], children: [], expanded: false, loading: false });
          }
        }
        if (person.mother) {
          const md = relMap[person.mother];
          if (md) {
            const existing = findNode(prev, person.mother);
            parents.push(existing ?? { person: md, parents: [], children: [], expanded: false, loading: false });
          }
        }
        for (const childSlug of person.children ?? []) {
          const cd = relMap[childSlug];
          if (cd) {
            const existing = findNode(prev, childSlug);
            children.push(existing ?? { person: cd, parents: [], children: [], expanded: false, loading: false });
          }
        }

        return {
          ...n,
          person,
          parents,
          children,
          expanded: true,
          loading: false,
        };
      });
    });
  }, [rootNode]);

  const handleSelect = useCallback((slug: string) => {
    setSelectedSlug(slug);
    const node = rootNode ? findNode(rootNode, slug) : null;
    onPersonChange?.(slug, node?.person.name ?? slug);
  }, [onPersonChange, rootNode]);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '500px',
        background: colors.bg,
        borderRadius: '8px',
        color: colors.textMuted,
        fontSize: '15px',
      }}>
        Loading family tree...
      </div>
    );
  }

  return (
    <TreeVisualization
      rootNode={rootNode}
      selectedSlug={selectedSlug}
      onExpand={handleExpand}
      onSelect={handleSelect}
    />
  );
}
