import { useState } from 'react';
import type { EventData } from '../shared/types';
import { colors, TYPE_COLORS } from '../shared/theme';

interface Props {
  event: EventData;
  isExpanded: boolean;
  onToggle: () => void;
}

function formatSlug(slug: string): string {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
}

export function EventCard({ event, isExpanded, onToggle }: Props) {
  const [hovered, setHovered] = useState(false);

  const yearLabel = event.start_year_display ?? (event.start_year != null ? String(event.start_year) : null);

  return (
    <div
      onClick={onToggle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: '200px',
        flexShrink: 0,
        backgroundColor: hovered ? '#263449' : colors.bgCard,
        border: `1px solid ${colors.border}`,
        borderLeft: `3px solid ${TYPE_COLORS.event}`,
        borderRadius: '6px',
        padding: '10px 12px',
        cursor: 'pointer',
        transition: 'background-color 0.15s ease',
        userSelect: 'none',
      }}
    >
      <div style={{ fontWeight: 700, color: colors.text, fontSize: '14px', lineHeight: '1.3', marginBottom: '4px' }}>
        {event.title}
      </div>

      {yearLabel && (
        <div style={{ color: colors.textMuted, fontSize: '12px', marginBottom: '2px' }}>
          {yearLabel}
        </div>
      )}

      {event.duration && (
        <div style={{ color: colors.textMuted, fontSize: '12px' }}>
          {event.duration}
        </div>
      )}

      {isExpanded && (
        <div style={{ marginTop: '8px', borderTop: `1px solid ${colors.border}`, paddingTop: '8px' }}>
          {event.participants && event.participants.length > 0 && (
            <div style={{ marginBottom: '6px' }}>
              <span style={{ color: colors.textDim, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Participants
              </span>
              <div style={{ color: colors.textMuted, fontSize: '12px', marginTop: '2px' }}>
                {event.participants.map(formatSlug).join(', ')}
              </div>
            </div>
          )}

          {event.locations && event.locations.length > 0 && (
            <div style={{ marginBottom: '6px' }}>
              <span style={{ color: colors.textDim, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Locations
              </span>
              <div style={{ color: colors.textMuted, fontSize: '12px', marginTop: '2px' }}>
                {event.locations.map(formatSlug).join(', ')}
              </div>
            </div>
          )}

          {event.verses && event.verses.length > 0 && (
            <div>
              <span style={{ color: colors.textDim, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Verses
              </span>
              <div style={{ color: colors.textMuted, fontSize: '12px', marginTop: '2px' }}>
                {event.verses.length} verse{event.verses.length !== 1 ? 's' : ''}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
