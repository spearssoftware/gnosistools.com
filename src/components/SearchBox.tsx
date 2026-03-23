import { useState, useCallback, useRef, useEffect } from 'react';

interface SearchResult {
  id: string;
  name: string;
  type: 'person' | 'place' | 'event' | 'group' | 'dictionary' | 'topic';
  description: string;
  verse_count: number;
}

const MOCK_RESULTS: SearchResult[] = [
  { id: 'abraham', name: 'Abraham', type: 'person', description: 'Patriarch, father of Isaac and Ishmael, originally named Abram', verse_count: 290 },
  { id: 'moses', name: 'Moses', type: 'person', description: 'Leader of the Exodus, received the Law at Sinai', verse_count: 847 },
  { id: 'david', name: 'David', type: 'person', description: 'King of Israel, author of many Psalms', verse_count: 1065 },
  { id: 'jerusalem', name: 'Jerusalem', type: 'place', description: 'Holy city, capital of ancient Israel and Judah', verse_count: 811 },
  { id: 'bethlehem', name: 'Bethlehem', type: 'place', description: 'Birthplace of Jesus and David, south of Jerusalem', verse_count: 44 },
  { id: 'egypt', name: 'Egypt', type: 'place', description: 'Ancient civilization along the Nile, site of Israel\'s bondage', verse_count: 611 },
  { id: 'the-exodus', name: 'The Exodus', type: 'event', description: 'Israel\'s departure from Egypt under Moses', verse_count: 52 },
  { id: 'the-flood', name: 'The Flood', type: 'event', description: 'Global deluge in the time of Noah', verse_count: 34 },
  { id: 'paul-apostle', name: 'Paul', type: 'person', description: 'Apostle to the Gentiles, author of many epistles', verse_count: 506 },
  { id: 'mary-mother-of-jesus', name: 'Mary', type: 'person', description: 'Mother of Jesus, wife of Joseph', verse_count: 54 },
  { id: 'babylon', name: 'Babylon', type: 'place', description: 'Ancient Mesopotamian city, site of the Exile', verse_count: 287 },
  { id: 'the-crucifixion', name: 'The Crucifixion', type: 'event', description: 'Death of Jesus on the cross at Golgotha', verse_count: 28 },
];

const TYPE_COLORS: Record<string, string> = {
  person: '#6366f1',
  place: '#10b981',
  event: '#f59e0b',
  group: '#ec4899',
  dictionary: '#8b5cf6',
  topic: '#06b6d4',
};

export function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback((q: string) => {
    if (!q.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }
    const lower = q.toLowerCase();
    const filtered = MOCK_RESULTS.filter(
      r => r.name.toLowerCase().includes(lower) || r.description.toLowerCase().includes(lower)
    );
    setResults(filtered);
    setIsOpen(filtered.length > 0);
  }, []);

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
              key={r.id}
              style={{
                padding: '12px 16px',
                borderBottom: '1px solid #334155',
                cursor: 'pointer',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#334155')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span style={{ fontWeight: 600, fontSize: '16px' }}>{r.name}</span>
                <span style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '9999px',
                  background: TYPE_COLORS[r.type] + '22',
                  color: TYPE_COLORS[r.type],
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {r.type}
                </span>
              </div>
              <div style={{ fontSize: '14px', color: '#94a3b8' }}>{r.description}</div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>{r.verse_count} verses</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
