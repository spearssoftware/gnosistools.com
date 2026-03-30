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

function collectAncestors(
  node: TreeNode, x: number, depth: number,
  nodes: LayoutNode[], links: LayoutLink[],
  parentPos: { x: number; y: number } | null, visited: Set<string>,
): void {
  if (visited.has(node.person.slug)) return;
  visited.add(node.person.slug);
  const y = -depth * NODE_H;
  nodes.push({ slug: node.person.slug, treeNode: node, x, y });
  if (parentPos) links.push({ source: parentPos, target: { x, y } });
  if (node.parents.length > 0) {
    const spacing = siblingSpacing(node.parents.length);
    const totalWidth = (node.parents.length - 1) * spacing;
    node.parents.forEach((parent, i) => {
      collectAncestors(parent, x - totalWidth / 2 + i * spacing, depth + 1, nodes, links, { x, y }, visited);
    });
  }
}

function collectDescendants(
  node: TreeNode, x: number, depth: number,
  nodes: LayoutNode[], links: LayoutLink[],
  parentPos: { x: number; y: number } | null, visited: Set<string>,
): void {
  if (visited.has(node.person.slug)) return;
  visited.add(node.person.slug);
  const y = depth * NODE_H;
  nodes.push({ slug: node.person.slug, treeNode: node, x, y });
  if (parentPos) links.push({ source: parentPos, target: { x, y } });
  if (node.children.length > 0) {
    const spacing = siblingSpacing(node.children.length);
    const totalWidth = (node.children.length - 1) * spacing;
    node.children.forEach((child, i) => {
      collectDescendants(child, x - totalWidth / 2 + i * spacing, depth + 1, nodes, links, { x, y }, visited);
    });
  }
}

function buildLayout(root: TreeNode): { nodes: LayoutNode[]; links: LayoutLink[] } {
  const nodes: LayoutNode[] = [];
  const links: LayoutLink[] = [];
  const visitedA = new Set<string>();
  const visitedD = new Set<string>();
  collectDescendants(root, 0, 0, nodes, links, null, visitedD);
  const rootPos = { x: 0, y: 0 };
  visitedA.add(root.person.slug);
  root.parents.forEach((parent, i) => {
    const spacing = siblingSpacing(root.parents.length);
    const totalWidth = (root.parents.length - 1) * spacing;
    collectAncestors(parent, -totalWidth / 2 + i * spacing, 1, nodes, links, rootPos, visitedA);
  });
  return { nodes, links };
}

function linkPath(src: { x: number; y: number }, tgt: { x: number; y: number }): string {
  const midY = (src.y + tgt.y) / 2;
  return `M ${src.x} ${src.y} C ${src.x} ${midY}, ${tgt.x} ${midY}, ${tgt.x} ${tgt.y}`;
}

export function TreeVisualization({ rootNode, selectedSlug, onExpand, onSelect }: TreeVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [transform, setTransform] = useState<d3.ZoomTransform>(d3.zoomIdentity);
  const [containerW, setContainerW] = useState(800);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(entries => {
      setContainerW(Math.max(entries[0].contentRect.width, 300));
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.2, 3])
      .on('zoom', (event) => setTransform(event.transform));
    zoomRef.current = zoom;
    d3.select(svgRef.current).call(zoom);
    return () => { d3.select(svgRef.current!).on('.zoom', null); };
  }, []);

  useEffect(() => {
    if (!svgRef.current || !zoomRef.current || !rootNode) return;
    const t = d3.zoomIdentity.translate(containerW / 2, 250);
    d3.select(svgRef.current).call(zoomRef.current.transform, t);
  }, [rootNode, containerW]);

  const handleZoomIn = useCallback(() => {
    if (svgRef.current && zoomRef.current) d3.select(svgRef.current).call(zoomRef.current.scaleBy, 1.3);
  }, []);
  const handleZoomOut = useCallback(() => {
    if (svgRef.current && zoomRef.current) d3.select(svgRef.current).call(zoomRef.current.scaleBy, 1 / 1.3);
  }, []);
  const handleReset = useCallback(() => {
    if (svgRef.current && zoomRef.current) {
      d3.select(svgRef.current).call(zoomRef.current.transform, d3.zoomIdentity.translate(containerW / 2, 250));
    }
  }, [containerW]);

  if (!rootNode) return null;

  const { nodes, links } = buildLayout(rootNode);
  const tx = transform.x;
  const ty = transform.y;
  const tk = transform.k;

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', height: '500px', background: colors.bg, borderRadius: '8px', overflow: 'hidden' }}>
      {/* SVG layer: only draws link lines */}
      <svg
        ref={svgRef}
        width={containerW}
        height={500}
        style={{ position: 'absolute', top: 0, left: 0, display: 'block' }}
      >
        <g transform={`translate(${tx},${ty}) scale(${tk})`}>
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
        </g>
      </svg>

      {/* HTML layer: node cards positioned over the SVG */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
        {nodes.map(n => {
          const isSelected = n.slug === selectedSlug;
          const hasUnloadedParents = !n.treeNode.expanded && (n.treeNode.person.father != null || n.treeNode.person.mother != null);
          const hasUnloadedChildren = !n.treeNode.expanded && (n.treeNode.person.children?.length ?? 0) > 0;
          const isExpandable = hasUnloadedParents || hasUnloadedChildren;

          const screenX = tx + n.x * tk;
          const screenY = ty + n.y * tk;

          return (
            <div
              key={n.slug}
              style={{
                position: 'absolute',
                left: screenX - (CARD_W * tk) / 2,
                top: screenY - (CARD_H * tk) / 2,
                width: CARD_W,
                height: CARD_H,
                transform: `scale(${tk})`,
                transformOrigin: 'top left',
                pointerEvents: 'auto',
              }}
            >
              <PersonNode
                person={n.treeNode.person}
                isSelected={isSelected}
                isExpandable={isExpandable}
                isLoading={n.treeNode.loading}
                onExpand={() => onExpand(n.slug)}
                onSelect={() => onSelect(n.slug)}
              />
            </div>
          );
        })}
      </div>

      <TreeControls onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} onReset={handleReset} />
    </div>
  );
}
