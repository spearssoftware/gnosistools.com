import { colors } from '../shared/theme';

interface TreeControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
}

const btnStyle: React.CSSProperties = {
  width: '32px',
  height: '32px',
  background: colors.bgCard,
  border: `1px solid ${colors.border}`,
  borderRadius: '6px',
  color: colors.textMuted,
  fontSize: '16px',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  lineHeight: 1,
};

export function TreeControls({ onZoomIn, onZoomOut, onReset }: TreeControlsProps) {
  return (
    <div style={{
      position: 'absolute',
      top: '12px',
      right: '12px',
      display: 'flex',
      flexDirection: 'column',
      gap: '4px',
      zIndex: 10,
    }}>
      <button
        onClick={onZoomIn}
        title="Zoom in"
        style={btnStyle}
        onMouseEnter={e => (e.currentTarget.style.color = colors.text)}
        onMouseLeave={e => (e.currentTarget.style.color = colors.textMuted)}
      >
        +
      </button>
      <button
        onClick={onZoomOut}
        title="Zoom out"
        style={btnStyle}
        onMouseEnter={e => (e.currentTarget.style.color = colors.text)}
        onMouseLeave={e => (e.currentTarget.style.color = colors.textMuted)}
      >
        −
      </button>
      <button
        onClick={onReset}
        title="Reset view"
        style={{ ...btnStyle, fontSize: '11px', fontWeight: 600 }}
        onMouseEnter={e => (e.currentTarget.style.color = colors.text)}
        onMouseLeave={e => (e.currentTarget.style.color = colors.textMuted)}
      >
        ⌂
      </button>
    </div>
  );
}
