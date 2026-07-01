// Black Book — shared UI bits used across screens

function Avatar({ initials, size = 36, heat }) {
  const heatBg = {
    warm: 'linear-gradient(135deg, #5FBE8C, #2F6B4B)',
    cooling: 'linear-gradient(135deg, #DCBE6E, #8A6F2A)',
    cold: 'linear-gradient(135deg, #D98B77, #7A2E22)',
    dormant: 'linear-gradient(135deg, #A89A78, #5C4F38)',
  };
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: heat ? heatBg[heat] : 'linear-gradient(135deg, #5A5648, #2A251C)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#0F0B02', fontWeight: 600, fontSize: size * 0.36,
      flexShrink: 0,
      boxShadow: '0 1px 0 rgba(255,255,255,0.18) inset',
    }}>{initials}</div>
  );
}

function HeatLabel({ heat, label, days, daysLabel }) {
  const color = {
    warm: 'var(--heat-warm)',
    cooling: 'var(--heat-cooling)',
    cold: 'var(--heat-cold)',
    dormant: 'var(--heat-dormant)',
  }[heat];
  return (
    <span style={{ color, fontSize: 12.5, fontWeight: 600, letterSpacing: '-0.005em', whiteSpace: 'nowrap' }}>
      {label} · {daysLabel || `${days} days`}
    </span>
  );
}

function SignalBadge({ signal, size = 'md' }) {
  if (!signal) return null;
  return (
    <div className="signal-badge" style={{
      fontSize: size === 'sm' ? 11.5 : 12,
      padding: size === 'sm' ? '5px 10px' : '6px 12px',
      maxWidth: size === 'sm' ? 260 : 340,
      lineHeight: 1.35,
    }}>
      <span className="signal-diamond" aria-hidden="true">◆</span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontWeight: 700 }}>{signal.text}</span>
        <span style={{ opacity: 0.65, fontWeight: 500 }}> · {signal.when}</span>
      </span>
    </div>
  );
}

function ScreenHeader({ title, subtitle, right }) {
  return (
    <header style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', gap: 24, marginBottom: 22 }}>
      <div>
        <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.025em', margin: 0, lineHeight: 1.25 }}>
          {title}
        </h1>
        {subtitle && (
          <div style={{ color: 'var(--text-secondary)', fontSize: 14.5, marginTop: 4 }}>{subtitle}</div>
        )}
      </div>
      {right}
    </header>
  );
}

Object.assign(window, { Avatar, HeatLabel, SignalBadge, ScreenHeader });
