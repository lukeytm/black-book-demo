// Black Book — sidebar nav

const NAV_ITEMS = [
  { id: 'briefing', label: 'Briefing', Icon: IconBriefing },
  { id: 'contacts', label: 'Contacts', Icon: IconContacts },
  { id: 'signals',  label: 'Signals',  Icon: IconSignals },
  { id: 'settings', label: 'Settings', Icon: IconSettings },
];

function Sidebar({ active, onNavigate, briefingMeta, theme, setTheme, mobile, open, onClose }) {
  const mobileStyle = mobile ? {
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 50,
    width: 'min(260px, 82vw)',
    transform: open ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 220ms cubic-bezier(0.4,0,0.2,1)',
    boxShadow: open ? '8px 0 32px rgba(0,0,0,0.45)' : 'none',
  } : {};

  return (
    <aside style={{
      width: mobile ? undefined : 260,
      flexShrink: 0,
      background: 'var(--bg-primary)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      padding: '22px 16px 18px 18px',
      height: '100%',
      ...mobileStyle,
    }}>
      {/* Wordmark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '0 4px 22px', }}>
        <BBMark size={26} />
        <div className="wordmark" style={{
          fontSize: 18,
          fontWeight: 600,
          color: 'var(--text-primary)',
        }}>My Black Book</div>
        <div style={{
          marginLeft: 'auto',
          fontSize: 10,
          fontWeight: 600,
          letterSpacing: '0.1em',
          color: 'var(--text-tertiary)',
          textTransform: 'uppercase',
        }}>v0.1</div>
        {mobile && (
          <button
            onClick={onClose}
            aria-label="Close menu"
            style={{
              marginLeft: 8, width: 28, height: 28, borderRadius: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--text-secondary)', fontSize: 18, lineHeight: 1,
              background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
            }}
          >×</button>
        )}
      </div>

      {/* Quick add — removed for now (email-only flow) */}

      {/* Nav */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <div className="section-header" style={{ padding: '14px 8px 10px' }}>Today</div>
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id;
          return (
            <button
              key={item.id}
              onClick={() => { onNavigate(item.id); if (mobile && onClose) onClose(); }}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                gap: 11,
                padding: '9px 12px',
                borderRadius: 8,
                color: isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: isActive ? 'var(--bg-elevated)' : 'transparent',
                fontSize: 14,
                fontWeight: isActive ? 600 : 500,
                textAlign: 'left',
                transition: 'all 140ms',
              }}
              onMouseEnter={(e) => {
                if (!isActive) e.currentTarget.style.background = 'var(--bg-hover)';
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = 'transparent';
              }}
            >
              {isActive && (
                <span style={{
                  position: 'absolute',
                  left: -18,
                  top: 8,
                  bottom: 8,
                  width: 3,
                  borderRadius: 3,
                  background: 'var(--accent)',
                  boxShadow: '0 0 8px rgba(201,168,76,0.32)',
                }} />
              )}
              <item.Icon size={17} style={{ color: isActive ? 'var(--accent)' : 'currentColor' }} />
              <span>{item.label}</span>
              {item.id === 'briefing' && briefingMeta && (
                <span style={{
                  marginLeft: 'auto',
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '2px 7px',
                  borderRadius: 999,
                  background: isActive ? 'var(--accent-subtle)' : 'rgba(167,158,142,0.12)',
                  color: isActive ? 'var(--accent-glow)' : 'var(--text-secondary)',
                }}>{briefingMeta}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Briefing status */}
      <div style={{
        marginTop: 22,
        padding: '14px 14px 12px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, whiteSpace: 'nowrap' }}>
          <span className="dot dot-pulse" style={{ background: 'var(--accent)', color: 'var(--accent)' }} />
          <div style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--accent-glow)' }}>
            Briefing live
          </div>
        </div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Next refresh tomorrow, <span style={{ color: 'var(--text-primary)' }}>08:00</span>
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-tertiary)', marginTop: 4 }}>
          Signals refreshed 2h ago
        </div>
      </div>

      {/* Appearance */}
      <div style={{
        marginTop: 14,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '9px 12px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 10,
      }}>
        <span style={{ fontSize: 12, fontWeight: 500, color: 'var(--text-secondary)' }}>Appearance</span>
        <div className="pill-row" style={{ width: 'auto', padding: 3, gap: 2 }}>
          <button
            className={`pill ${theme === 'light' ? 'active' : ''}`}
            onClick={() => setTheme('light')}
            title="Light"
            aria-label="Light mode"
            style={{ flex: 'none', padding: '6px 11px' }}
          >
            <IconSun size={13} />
          </button>
          <button
            className={`pill ${theme === 'dark' ? 'active' : ''}`}
            onClick={() => setTheme('dark')}
            title="Dark"
            aria-label="Dark mode"
            style={{ flex: 'none', padding: '6px 11px' }}
          >
            <IconMoon size={13} />
          </button>
        </div>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Account */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 11,
        padding: '10px 8px',
        borderRadius: 10,
        cursor: 'pointer',
      }}>
        <div style={{
          width: 34, height: 34, borderRadius: '50%',
          background: 'linear-gradient(135deg, #5A5648, #2A251C)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: 'var(--silver)', fontWeight: 600, fontSize: 13,
          border: '1px solid rgba(201,168,76,0.25)',
        }}>LH</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            Luke Harrison
          </div>
          <div style={{ fontSize: 11, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span className="dot" style={{ background: 'var(--heat-warm)' }} />
            Gmail connected
          </div>
        </div>
      </div>
    </aside>
  );
}

window.Sidebar = Sidebar;
