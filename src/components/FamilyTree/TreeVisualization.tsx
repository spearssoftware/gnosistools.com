import { useRef, useEffect, useState, useCallback } from 'react';
import * as d3 from 'd3';
import { colors } from '../shared/theme';
import type { TreeNode } from '../shared/types';
import { PersonNode } from './PersonNode';
import { TreeControls } from './TreeControls';

interface TreeVisualizationProps {
  rootNode: TreeNode | null;
  selectedSlug: string;
  onExpand: (slug: string) => void;
  onSelect: (slug: string) => void;
}

// Internal flat structure after layout
interface LayoutNode {
  slug: string;
  treeNode: TreeNode;
  x: number;
  y: number;
}

interface LayoutLink {
  source: { x: number; y: number };
  target: { x: number; y: number };
}

const NODE_H = 120;
const CARD_W = 180;
const CARD_H = 70;
const MAX_SPREAD = 800;

function siblingSpacing(count: number): number {
  if (count <= 2) return 200;
  const spacing = MAX_SPREAD / (count - 1);
  return Math.max(spacing, CARD_W + 10);
}

// Recursively collect nodes from ancestor tree (parents go UP — negative Y)
function collectAncestors(
  node: TreeNode,
  x: number,
  depth: number,
  nodes: LayoutNode[],
  links: LayoutLink[],
  parentPos: { x: number; y: number } | null,
  visited: Set<string>,
): void {
  if (visited.has(node.person.slug)) return;
  visited.add(node.person.slug);

  const y = -depth * NODE_H;
  nodes.push({ slug: node.person.slug, treeNode: node, x, y });

  if (parentPos) {
    links.push({ source: parentPos, target: { x, y } });
  }

  if (node.parents.length > 0) {
    const spacing = siblingSpacing(node.parents.length);
    const totalWidth = (node.parents.length - 1) * spacing;
    node.parents.forEach((parent, i) => {
      const childX = x - totalWidth / 2 + i * spacing;
      collectAncestors(parent, childX, depth + 1, nodes, links, { x, y }, visited);
    });
  }
}

// Recursively collect nodes from descendant tree (children go DOWN — positive Y)
function collectDescendants(
  node: TreeNode,
  x: number,
  depth: number,
  nodes: LayoutNode[],
  links: LayoutLink[],
  parentPos: { x: number; y: number } | null,
  visited: Set<string>,
): void {
  if (visited.has(node.person.slug)) return;
  visited.add(node.person.slug);

  const y = depth * NODE_H;
  nodes.push({ slug: node.person.slug, treeNode: node, x, y });

  if (parentPos) {
    links.push({ source: parentPos, target: { x, y } });
  }

  if (node.children.length > 0) {
    const spacing = siblingSpacing(node.children.length);
    const totalWidth = (node.children.length - 1) * spacing;
    node.children.forEach((child, i) => {
      const childX = x - totalWidth / 2 + i * spacing;
      collectDescendants(child, childX, depth + 1, nodes, links, { x, y }, visited);
    });
  }
}

function buildLayout(root: TreeNode): { nodes: LayoutNode[]; links: LayoutLink[] } {
  const nodes: LayoutNode[] = [];
  const links: LayoutLink[] = [];
  const visitedAncestors = new Set<string>();
  const visitedDescendants = new Set<string>();

  // Descendants first (depth 0 is root, marked visited so ancestors don't double-add)
  collectDescendants(root, 0, 0, nodes, links, null, visitedDescendants);

  // Ancestors — skip the root itself (depth 0) since it's already placed
  const rootPos = { x: 0, y: 0 };
  visitedAncestors.add(root.person.slug); // don't re-add root
  root.parents.forEach((parent, i) => {
    const spacing = siblingSpacing(root.parents.length);
    const totalWidth = (root.parents.length - 1) * spacing;
    const px = -totalWidth / 2 + i * spacing;
    collectAncestors(parent, px, 1, nodes, links, rootPos, visitedAncestors);
  });

  return { nodes, links };
}

function linkPath(src: { x: number; y: number }, tgt: { x: number; y: number }): string {
  const midY = (src.y + tgt.y) / 2;
  return `M ${src.x} ${src.y} C ${src.x} ${midY}, ${tgt.x} ${midY}, ${tgt.x} ${tgt.y}`;
}

export function TreeVisualization({ rootNode, selectedSlug, onExpand, onSelect }: TreeVisualizationProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [transform, setTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);
  const [svgSize, setSvgSize] = useState({ w: 800, h: 500 });

  // Observe SVG container size
  useEffect(() => {
    const el = svgRef.current?.parentElement;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      const { width } = entries[0].contentRect;
      setSvgSize(s => ({ ...s, w: Math.max(width, 300) }));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Set up d3 zoom
  useEffect(() => {
    if (!svgRef.current) return;

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 3])
      .on('zoom', (event) => {
        setTransform(event.transform);
      });

    zoomRef.current = zoom;
    d3.select(svgRef.current).call(zoom);

    return () => {
      d3.select(svgRef.current!).on('.zoom', null);
    };
  }, []);

  // Center on root when rootNode changes
  useEffect(() => {
    if (!svgRef.current || !zoomRef.current || !rootNode) return;

    const { w, h } = svgSize;
    const initialTransform = d3.zoomIdentity.translate(w / 2, h / 2);
    d3.select(svgRef.current)
      .call(zoomRef.current.transform, initialTransform);
  }, [rootNode, svgSize.w]);

  const handleZoomIn = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current).call(zoomRef.current.scaleBy, 1.3);
  }, []);

  const handleZoomOut = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current).call(zoomRef.current.scaleBy, 1 / 1.3);
  }, []);

  const handleReset = useCallback(() => {
    if (!svgRef.current || !zoomRef.current) return;
    const { w, h } = svgSize;
    d3.select(svgRef.current).call(
      zoomRef.current.transform,
      d3.zoomIdentity.translate(w / 2, h / 2),
    );
  }, [svgSize]);

  if (!rootNode) return null;

  const { nodes, links } = buildLayout(rootNode);

  const tx = transform.x;
  const ty = transform.y;
  const tk = transform.k;

  return (
    <div style={{ position: 'relative', width: '100%', height: '500px', background: colors.bg, borderRadius: '8px', overflow: 'hidden' }}>
      <svg
        ref={svgRef}
        width={svgSize.w}
        height={500}
        style={{ display: 'block' }}
      >
        <g transform={`translate(${tx},${ty}) scale(${tk})`}>
          {/* Links */}
          {links.map((link, i) => (
            <path
              key={i}
              d={linkPath(link.source, link.target)}
              fill="none"
              stroke={colors.link}
              strokeWidth={1.5}
              strokeOpacity={0.6}
            />
          ))}

          {/* Nodes as foreignObject */}
          {nodes.map(n => {
            const isSelected = n.slug === selectedSlug;
            const hasUnloadedParents =
              !n.treeNode.expanded &&
              (n.treeNode.person.father != null || n.treeNode.person.mother != null);
            const hasUnloadedChildren =
              !n.treeNode.expanded &&
              (n.treeNode.person.children?.length ?? 0) > 0;
            const isExpandable = hasUnloadedParents || hasUnloadedChildren;

            return (
              <foreignObject
                key={n.slug}
                x={n.x - CARD_W / 2}
                y={n.y - CARD_H / 2}
                width={CARD_W}
                height={CARD_H}
              >
                <div xmlns="http://www.w3.org/1999/xhtml">
                  <PersonNode
                    person={n.treeNode.person}
                    isSelected={isSelected}
                    isExpandable={isExpandable}
                    isLoading={n.treeNode.loading}
                    onExpand={() => onExpand(n.slug)}
                    onSelect={() => onSelect(n.slug)}
                  />
                </div>
              </foreignObject>
            );
          })}
        </g>
      </svg>

      <TreeControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onReset={handleReset}
      />
    </div>
  );
}
