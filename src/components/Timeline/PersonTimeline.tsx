import { useEffect, useState } from 'react';
import type { EventData } from '../shared/types';
import { fetchEventsForPerson } from '../shared/api';
import { colors } from '../shared/theme';
import { EventCard } from './EventCard';

interface Props {
  personSlug: string;
  personName: string;
}

export function PersonTimeline({ personSlug, personName }: Props) {
  const [events, setEvents] = useState<EventData[]>([]);
  const [loading, setLoading] = useState(false);
  const [expandedSlug, setExpandedSlug] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setEvents([]);
    setExpandedSlug(null);

    fetchEventsForPerson(personSlug).then(data => {
      setEvents(data);
      setLoading(false);
    });
  }, [personSlug]);

  const yearLabel = (event: EventData): string | null => {
    if (event.start_year_display) return event.start_year_display;
    if (event.start_year != null) return String(event.start_year);
    return null;
  };

  return (
    <div
      style={{
        backgroundColor: colors.bg,
        padding: '16px 0',
      }}
    >
      <div
        style={{
          fontSize: '16px',
          fontWeight: 600,
          color: colors.text,
          marginBottom: '16px',
          paddingLeft: '16px',
        }}
      >
        {personName ? `${personName}'s Timeline` : 'Timeline'}
      </div>

      {loading && (
        <div style={{ color: colors.textMuted, fontSize: '14px', paddingLeft: '16px' }}>
          Loading events...
        </div>
      )}

      {!loading && events.length === 0 && (
        <div style={{ color: colors.textMuted, fontSize: '14px', paddingLeft: '16px' }}>
          No recorded events for this person.
        </div>
      )}

      {!loading && events.length > 0 && (
        <div
          style={{
            overflowX: 'auto',
            overflowY: 'visible',
            paddingBottom: '16px',
            WebkitOverflowScrolling: 'touch' as React.CSSProperties['WebkitOverflowScrolling'],
          }}
        >
          {/* Outer wrapper gives left/right padding inside the scroll area */}
          <div style={{ display: 'inline-block', minWidth: '100%', paddingLeft: '16px', paddingRight: '16px', boxSizing: 'border-box' }}>
            {/* Cards row */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'flex-end',
                gap: '24px',
                paddingBottom: '12px',
              }}
            >
              {events.map(event => (
                <div key={event.slug} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
                  <EventCard
                    event={event}
                    isExpanded={expandedSlug === event.slug}
                    onToggle={() => setExpandedSlug(prev => prev === event.slug ? null : event.slug)}
                  />
                  {/* Connector stem from card to dot */}
                  <div
                    style={{
                      width: '2px',
                      height: '12px',
                      backgroundColor: colors.border,
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Timeline line with dots */}
            <div style={{ position: 'relative', height: '20px' }}>
              {/* Horizontal line */}
              <div
                style={{
                  position: 'absolute',
                  top: '6px',
                  left: 0,
                  right: 0,
                  height: '2px',
                  backgroundColor: colors.border,
                }}
              />
              {/* Dots + year labels row */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'flex-start',
                  gap: '24px',
                }}
              >
                {events.map(event => {
                  const label = yearLabel(event);
                  return (
                    <div
                      key={event.slug}
                      style={{
                        width: '200px',
                        flexShrink: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                      }}
                    >
                      {/* Dot on the line */}
                      <div
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: colors.border,
                          border: `2px solid ${colors.textDim}`,
                          flexShrink: 0,
                        }}
                      />
                      {/* Year label */}
                      {label && (
                        <div
                          style={{
                            color: colors.textDim,
                            fontSize: '11px',
                            marginTop: '4px',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {label}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
