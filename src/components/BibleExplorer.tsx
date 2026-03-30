import { useState, useCallback } from 'react';
import { SearchBox } from './SearchBox';
import { FamilyTreeExplorer } from './FamilyTree/FamilyTreeExplorer';
import { PersonTimeline } from './Timeline/PersonTimeline';
import { colors } from './shared/theme';

export function BibleExplorer() {
  const [currentSlug, setCurrentSlug] = useState('jesus-son-of-joseph');
  const [currentName, setCurrentName] = useState('Jesus');
  const [treeKey, setTreeKey] = useState(0);

  const handleSearchSelect = useCallback((slug: string, entityType: string) => {
    if (entityType === 'person') {
      setCurrentSlug(slug);
      setCurrentName(slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '));
      setTreeKey(k => k + 1);
    }
  }, []);

  const handlePersonChange = useCallback((slug: string, name?: string) => {
    setCurrentSlug(slug);
    if (name) setCurrentName(name);
  }, []);

  return (
    <div>
      <div style={{ maxWidth: 640, margin: '0 auto 32px', padding: '0 24px' }}>
        <SearchBox
          onSelect={handleSearchSelect}
          entityFilter="person"
          placeholder='Search for a biblical figure... "Abraham"'
          showModeToggle={false}
        />
      </div>
      <FamilyTreeExplorer
        key={treeKey}
        initialSlug={currentSlug}
        onPersonChange={handlePersonChange}
      />
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <PersonTimeline personSlug={currentSlug} personName={currentName} />
      </div>
    </div>
  );
}
