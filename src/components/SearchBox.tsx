import { useState, useRef, useEffect } from 'react';

type SearchMode = 'semantic' | 'name';

interface NameResult {
  slug: string;
  name: string;
  entity_type: string;
  uuid: string;
}

interface SemanticResult {
  slug: string;
  type: string;
  text: string;
  score: number;
}

const FALLBACK_RESULTS: NameResult[] = [
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
  verse: '#3b82f6',
  strongs: '#f97316',
  lexicon: '#14b8a6',
  greek_lexicon: '#14b8a6',
};

interface SearchBoxProps {
  onSelect?: (slug: string, entityType: string) => void;
  entityFilter?: string;
  placeholder?: string;
  showModeToggle?: boolean;
}

function fallbackSearch(q: string): NameResult[] {
  const lower = q.toLowerCase();
  return FALLBACK_RESULTS.filter(r => r.name.toLowerCase().includes(lower));
}

export function SearchBox({ onSelect, entityFilter, placeholder, showModeToggle = true }: SearchBoxProps = {}) {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<SearchMode>(showModeToggle ? 'semantic' : 'name');
  const [nameResults, setNameResults] = useState<NameResult[]>([]);
  const [semanticResults, setSemanticResults] = useState<SemanticResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController>();

  const search = async (q: string) => {
    if (!q.trim()) {
      setNameResults([]);
      setSemanticResults([]);
      setIsOpen(false);
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();

    if (mode === 'semantic') {
      try {
        const res = await fetch(`/api/semantic-search?q=${encodeURIComponent(q)}`, {
          signal: abortRef.current.signal,
        });
        if (!res.ok) throw new Error('API error');
        const body = await res.json();
        const data: SemanticResult[] = Array.isArray(body) ? body : body.data || [];
        setSemanticResults(data);
        setIsOpen(data.length > 0);
      } catch (e) {
        if ((e as Error).name === 'AbortError') return;
        setSemanticResults([]);
        setIsOpen(false);
      }
    } else {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`, {
          signal: abortRef.current.signal,
        });
        if (!res.ok) throw new Error('API error');
        const body = await res.json();
        const data: NameResult[] = body.data || [];
        setNameResults(data);
        setIsOpen(data.length > 0);
      } catch (e) {
        if ((e as Error).name === 'AbortError') return;
        const data = fallbackSearch(q);
        setNameResults(data);
        setIsOpen(data.length > 0);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => search(value), 300);
  };

  const handleModeChange = (newMode: SearchMode) => {
    setMode(newMode);
    setNameResults([]);
    setSemanticResults([]);
    setIsOpen(false);
  };

  const filteredNameResults = entityFilter
    ? nameResults.filter(r => r.entity_type === entityFilter)
    : nameResults;
  const filteredSemanticResults = entityFilter
    ? semanticResults.filter(r => r.type === entityFilter)
    : semanticResults;

  const results = mode === 'semantic' ? filteredSemanticResults : filteredNameResults;
  const hasResults = results.length > 0;

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
      {showModeToggle && (
        <div style={{ display: 'flex', gap: '4px', marginBottom: '8px' }}>
          {(['semantic', 'name'] as const).map(m => (
            <button
              key={m}
              onClick={() => handleModeChange(m)}
              style={{
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 600,
                borderRadius: '8px',
                border: 'none',
                cursor: 'pointer',
                background: mode === m ? '#3b82f6' : '#334155',
                color: mode === m ? '#fff' : '#94a3b8',
                transition: 'background 0.15s, color 0.15s',
              }}
            >
              {m === 'semantic' ? 'Semantic' : 'Name'}
            </button>
          ))}
        </div>
      )}
      <input
        type="text"
        value={query}
        onChange={handleChange}
        onFocus={() => hasResults && setIsOpen(true)}
        placeholder={placeholder ?? (mode === 'semantic'
          ? 'Ask anything... "verses about forgiveness"'
          : 'Search by name... "Moses"')}
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
          {mode === 'semantic'
            ? filteredSemanticResults.map(r => {
                const displayText = r.text.length > 100 ? r.text.slice(0, 100) + '...' : r.text;
                return (
                  <div
                    key={`${r.type}-${r.slug}`}
                    style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #334155',
                      cursor: 'pointer',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#334155')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    onClick={() => { onSelect?.(r.slug, r.type); setIsOpen(false); }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{
                        fontSize: '11px',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        background: (TYPE_COLORS[r.type] || '#64748b') + '22',
                        color: TYPE_COLORS[r.type] || '#64748b',
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}>
                        {r.type}
                      </span>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>{r.slug}</span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#cbd5e1', lineHeight: '1.4' }}>
                      {displayText}
                    </div>
                  </div>
                );
              })
            : filteredNameResults.map(r => (
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
                  onClick={() => { onSelect?.(r.slug, r.entity_type); setIsOpen(false); }}
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
              ))
          }
        </div>
      )}
    </div>
  );
}
