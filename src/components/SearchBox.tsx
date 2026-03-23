import { useState, useRef, useEffect } from 'react';

interface SearchResult {
  slug: string;
  name: string;
  entity_type: string;
  uuid: string;
}

const FALLBACK_RESULTS: SearchResult[] = [
  { slug: 'abraham', name: 'Abraham', entity_type: 'person', uuid: '' },
  { slug: 'moses', name: 'Moses', entity_type: 'person', uuid: '' },
  { slug: 'david', name: 'David', entity_type: 'person', uuid: '' },
  { slug: 'jerusalem', name: 'Jerusalem', entity_type: 'place', uuid: '' },
  { slug: 'bethlehem', name: 'Bethlehem', entity_type: 'place', uuid: '' },
  { slug: 'egypt', name: 'Egypt', entity_type: 'place', uuid: '' },
  { slug: 'the-exodus', name: 'The Exodus', entity_type: 'event', uuid: '' },
  { slug: 'the-flood', name: 'The Flood', entity_type: 'event', uuid: '' },
  { slug: 'paul-apostle', name: 'Paul', entity_type: 'person', uuid: '' },
  { slug: 'mary-mother-of-jesus', name: 'Mary', entity_type: 'person', uuid: '' },
  { slug: 'babylon', name: 'Babylon', entity_type: 'place', uuid: '' },
  { slug: 'the-crucifixion', name: 'The Crucifixion', entity_type: 'event', uuid: '' },
];

const TYPE_COLORS: Record<string, string> = {
  person: '#6366f1',
  place: '#10b981',
  event: '#f59e0b',
  group: '#ec4899',
  dictionary: '#8b5cf6',
  topic: '#06b6d4',
};

function fallbackSearch(q: string): SearchResult[] {
  const lower = q.toLowerCase();
  return FALLBACK_RESULTS.filter(r => r.name.toLowerCase().includes(lower));
}

export function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController>();

  const search = async (q: string) => {
    if (!q.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
        signal: abortRef.current.signal,
      });
      if (!res.ok) throw new Error('API error');
      const body = await res.json();
      const data = body.data || [];
      setResults(data);
      setIsOpen(data.length > 0);
    } catch (e) {
      if ((e as Error).name === 'AbortError') return;
      const data = fallbackSearch(q);
      setResults(data);
      setIsOpen(data.length > 0);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => search(value), 300);
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <div ref={containerRef} style={{ position: 'relative', width: '100%', maxWidth: '640px', margin: '0 auto' }}>
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => results.length > 0 && setIsOpen(true)}
        placeholder="Search the biblical knowledge graph..."
        style={{
          width: '100%',
          padding: '16px 20px',
          fontSize: '18px',
          border: '2px solid #334155',
          borderRadius: '12px',
          background: '#1e293b',
          color: '#e2e8f0',
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
      />
      {isOpen && (
        <div style={{
          position: 'absolute',
          top: '100%',
          left: 0,
          right: 0,
          marginTop: '8px',
          background: '#1e293b',
          border: '1px solid #334155',
          borderRadius: '12px',
          overflow: 'hidden',
          zIndex: 50,
          maxHeight: '400px',
          overflowY: 'auto',
        }}>
          {results.map(r => (
            <div
              key={`${r.entity_type}-${r.slug}`}
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid #334155',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#334155')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 600, fontSize: '16px' }}>{r.name}</span>
                <span style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: (TYPE_COLORS[r.entity_type] || '#64748b') + '22',
                  color: TYPE_COLORS[r.entity_type] || '#64748b',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {r.entity_type}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
