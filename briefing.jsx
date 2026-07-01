// Black Book — Briefing (hero) screen

function BriefingScreen({ contacts, onDraft, onSnooze, onComplete, onOpenContact, pendingComplete, pendingConfirm, profile, tweaks }) {
  // Seed dismissing with pendingComplete so the card exits immediately on mount
  const [dismissing, setDismissing] = React.useState(() =>
    pendingComplete ? new Set([pendingComplete]) : new Set()
  );

  const visible = contacts.filter((c) => !c.snoozed);

  const handleSnooze = (id) => {
    setDismissing((s) => new Set(s).add(id));
    setTimeout(() => onSnooze(id), 380);
  };

  const handleConfirmSend = (id) => {
    setDismissing((s) => new Set(s).add(id));
    setTimeout(() => onComplete(id), 380);
  };

  const today = new Date(2026, 4, 26); // Monday, 26 May 2026
  const dateStr = today.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' });
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="scroll-area" style={{ height: '100%', overflowY: 'auto' }}>
      <div style={{ maxWidth: 920, margin: '0 auto', padding: '40px 48px 56px' }}>
        {/* Greeting */}
        <div className="fade-up" style={{ marginBottom: 28 }}>
          <h1 style={{
            fontSize: 30,
            fontWeight: 600,
            letterSpacing: '-0.028em',
            margin: '0 0 6px',
            lineHeight: 1.2,
          }}>
            {greeting}, <span style={{ color: 'var(--accent-glow)' }}>{profile.firstName || 'Luke'}</span>.
          </h1>
          <div style={{ color: 'var(--text-secondary)', fontSize: 14.5, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span>{dateStr}</span>
            <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--text-tertiary)' }} />
            <span>You have <span style={{ color: 'var(--accent)' }}>{visible.length} {visible.length === 1 ? 'relationship' : 'relationships'}</span> that {visible.length === 1 ? 'needs' : 'need'} attention today.</span>
          </div>
        </div>

        <div className="divider-gold" style={{ marginBottom: 26 }} />

        {/* Empty state */}
        {visible.length === 0 ? (
          <EmptyBriefing />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {visible.map((c, i) => (
              <ContactCard
                key={c.id}
                contact={c}
                onDraft={() => onDraft(c.id)}
                onSnooze={() => handleSnooze(c.id)}
                onOpen={() => onOpenContact(c.id)}
                onConfirmSend={() => handleConfirmSend(c.id)}
                onRemindLater={() => handleSnooze(c.id)}
                dismissing={dismissing.has(c.id)}
                needsConfirm={pendingConfirm === c.id}
                density={tweaks.density}
                style={{ animationDelay: `${i * 60}ms` }}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        {visible.length > 0 && (
          <div style={{
            marginTop: 36,
            paddingTop: 18,
            borderTop: '1px solid var(--border-subtle)',
            fontSize: 12,
            color: 'var(--text-tertiary)',
            display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap',
          }}>
            <span>Briefing #1</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span>Based on 90 days of Gmail activity</span>
            <span style={{ opacity: 0.5 }}>·</span>
            <span>Signals refreshed 2 hours ago</span>
          </div>
        )}
      </div>
    </div>
  );
}

function ContactCard({ contact, onDraft, onSnooze, onOpen, onConfirmSend, onRemindLater, dismissing, needsConfirm, density, style }) {
  const [hover, setHover] = React.useState(false);
  const heatColor = `var(--heat-${contact.heat})`;
  const compact = density === 'compact';

  return (
    <div
      className={`card fade-up ${dismissing ? 'dismissing' : ''}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        position: 'relative',
        display: 'flex',
        gap: 0,
        overflow: 'hidden',
        background: hover && !needsConfirm ? 'var(--bg-hover)' : 'var(--bg-card)',
        borderColor: needsConfirm ? 'var(--accent-border)' : hover ? 'rgba(255,255,255,0.06)' : 'var(--border-subtle)',
        transform: hover && !needsConfirm ? 'translateY(-1px)' : 'none',
        boxShadow: hover && !needsConfirm ? '0 12px 32px rgba(0,0,0,0.32)' : 'none',
        ...style,
      }}
    >
      {/* Heat bar */}
      <div style={{
        width: 4,
        background: heatColor,
        boxShadow: `0 0 18px ${heatColor}`,
        flexShrink: 0,
      }} />

      {needsConfirm ? (
        /* ── Confirm state: "Did you send it?" ─────────────── */
        <div style={{
          flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 20, padding: compact ? '16px 20px' : '18px 22px',
          animation: 'fade-up 260ms ease both',
        }}>
          <div style={{ minWidth: 0 }}>
            <div style={{
              fontSize: 15, fontWeight: 600, letterSpacing: '-0.01em',
              marginBottom: 3,
            }}>Did you send it?</div>
            <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)' }}>
              {contact.name} · {contact.company}
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, flexShrink: 0, alignItems: 'center' }}>
            <button
              className="btn btn-primary btn-sm"
              onClick={onConfirmSend}
              style={{ whiteSpace: 'nowrap' }}
            >
              <IconCheck size={13} /> Yes, mark as done
            </button>
            <button
              className="btn btn-ghost btn-sm"
              onClick={onRemindLater}
              style={{ whiteSpace: 'nowrap' }}
            >
              Remind me later
            </button>
          </div>
        </div>
      ) : (
        /* ── Normal state ───────────────────────────────────── */
        <div style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) auto',
          gap: 20,
          padding: compact ? '16px 20px' : '20px 22px',
          alignItems: 'center',
          minWidth: 0,
        }}>
          {/* Left content */}
          <div style={{ minWidth: 0, display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <Avatar initials={contact.initials} heat={contact.heat} size={compact ? 36 : 42} />
            <div style={{ minWidth: 0, flex: 1 }}>
              <div
                onClick={onOpen}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8, marginBottom: 3,
                  cursor: 'pointer',
                }}>
                <span style={{ fontSize: 15.5, fontWeight: 600, letterSpacing: '-0.01em' }}>{contact.name}</span>
                <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--text-tertiary)' }} />
                <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{contact.company}</span>
              </div>
              <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', marginBottom: 6 }}>
                {contact.role}
              </div>
              <div style={{ marginBottom: 6 }}>
                <HeatLabel heat={contact.heat} label={contact.heatLabel} days={contact.days} daysLabel={contact.daysLabel} />
              </div>
              {!compact && (
                <div style={{
                  fontSize: 13.5,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.55,
                  maxWidth: 520,
                  textWrap: 'pretty',
                }}>
                  {contact.reason}
                </div>
              )}
            </div>
          </div>

          {/* Right content */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10, minWidth: 0 }}>
            {contact.signal && (
              <SignalBadge signal={contact.signal} size="sm" />
            )}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, width: 140 }}>
              <button className="btn btn-primary btn-sm" onClick={onDraft}>
                <IconEdit size={13} />
                Draft message
              </button>
              <button className="btn btn-ghost btn-sm" onClick={onSnooze}>Not now</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyBriefing() {
  return (
    <div className="fade-up" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
      padding: '72px 32px 48px',
      gap: 22,
    }}>
      <BBMark size={56} glow />
      <div>
        <h2 style={{ fontSize: 22, fontWeight: 600, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
          Your network is warm.
        </h2>
        <p style={{ color: 'var(--text-secondary)', maxWidth: 420, margin: 0, lineHeight: 1.6 }}>
          In a world of automated outreach, that's your edge.
        </p>
      </div>
      <div style={{
        marginTop: 6, padding: '8px 14px',
        background: 'rgba(76, 166, 114, 0.08)',
        border: '1px solid rgba(76, 166, 114, 0.2)',
        borderRadius: 999,
        fontSize: 12.5, color: 'var(--heat-warm)', fontWeight: 500,
      }}>
        4 conversations active · No follow-ups overdue
      </div>
    </div>
  );
}

window.BriefingScreen = BriefingScreen;
