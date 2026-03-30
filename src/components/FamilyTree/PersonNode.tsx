import { colors } from '../shared/theme';
import type { PersonData } from '../shared/types';

interface PersonNodeProps {
  person: PersonData;
  isSelected: boolean;
  isExpandable: boolean;
  isLoading: boolean;
  onExpand: () => void;
  onSelect: () => void;
}

function formatYears(person: PersonData): string {
  const birth = person.birth_year_display ?? (person.birth_year != null ? String(Math.abs(person.birth_year)) + (person.birth_year < 0 ? ' BC' : ' AD') : null);
  const death = person.death_year_display ?? (person.death_year != null ? String(Math.abs(person.death_year)) + (person.death_year < 0 ? ' BC' : ' AD') : null);

  if (birth && death) return `${birth} – ${death}`;
  if (birth) return birth;
  return 'Unknown';
}

function genderBorderColor(gender: string): string {
  if (gender === 'Male') return colors.male;
  if (gender === 'Female') return colors.female;
  return colors.border;
}

export function PersonNode({ person, isSelected, isExpandable, isLoading, onExpand, onSelect }: PersonNodeProps) {
  const borderColor = genderBorderColor(person.gender);

  return (
    <div
      onClick={onSelect}
      style={{
        width: '180px',
        height: '70px',
        background: colors.bgCard,
        border: `1px solid ${isSelected ? colors.accent : colors.border}`,
        borderLeft: `4px solid ${borderColor}`,
        borderRadius: '6px',
        padding: '8px 10px',
        cursor: 'pointer',
        boxSizing: 'border-box',
        position: 'relative',
        opacity: isLoading ? 0.5 : 1,
        animation: isLoading ? 'pulse 1.2s ease-in-out infinite' : 'none',
        boxShadow: isSelected ? `0 0 0 2px ${colors.accent}55` : 'none',
        overflow: 'hidden',
        userSelect: 'none',
      }}
    >
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.5; }
          50% { opacity: 0.9; }
        }
      `}</style>

      <div style={{
        fontWeight: 700,
        fontSize: '13px',
        color: colors.text,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        lineHeight: '1.3',
        marginBottom: '4px',
      }}>
        {person.name}
      </div>

      <div style={{
        fontSize: '11px',
        color: colors.textMuted,
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
      }}>
        {formatYears(person)}
      </div>

      {isExpandable && !isLoading && (
        <div
          onClick={(e) => { e.stopPropagation(); onExpand(); }}
          title="Load relatives"
          style={{
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '16px',
            height: '16px',
            background: colors.nodeExpand,
            borderRadius: '3px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '11px',
            color: colors.textMuted,
            cursor: 'pointer',
            lineHeight: 1,
          }}
        >
          +
        </div>
      )}
    </div>
  );
}
