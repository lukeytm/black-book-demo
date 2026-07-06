// Black Book — Contact detail screen

function ContactDetailScreen({ contact, onBack, onDraft }) {
  const heatColor = `var(--heat-${contact.heat})`;
  const [snoozeOpen, setSnoozeOpen] = React.useState(false);

  return (
    <div className="scroll-area" style={{ height: '100%', overflowY: 'auto' }}>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: 'var(--screen-pad-v) var(--screen-pad-h) 64px' }}>
        {/* Back */}
        <button
          onClick={onBack}
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: 'var(--text-secondary)', fontSize: 13, padding: '6px 10px 6px 6px',
            marginLeft: -10, marginBottom: 18, borderRadius: 6,
          }}>
          <IconChevronLeft size={15} />
          Back
        </button>

        {/* Header */}
        <div className="fade-up" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 16, marginBottom: 30, flexWrap: 'wrap',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <Avatar initials={contact.initials} heat={contact.heat} size={62} />
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.025em', margin: '0 0 4px', lineHeight: 1.25 }}>
                {contact.name}
              </h1>
              <div style={{ color: 'var(--text-secondary)', fontSize: 14.5 }}>
                {contact.role} · {contact.company}
              </div>
              <div style={{ marginTop: 8, display: 'inline-flex', alignItems: 'center', gap: 7,
                padding: '4px 10px',
                background: `color-mix(in oklab, ${heatColor} 12%, transparent)`,
                border: `1px solid color-mix(in oklab, ${heatColor} 35%, transparent)`,
                borderRadius: 999, fontSize: 12, fontWeight: 600,
                color: heatColor,
                whiteSpace: 'nowrap',
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: heatColor }} />
                {contact.heatLabel} · {contact.daysLabel || `${contact.days} days`}
              </div>
            </div>
          </div>
          <button className="btn btn-primary" onClick={onDraft}>
            <IconEdit size={14} />
            Draft message
          </button>
        </div>

        {/* Section 1 — Relationship summary */}
        <Section title="Relationship summary">
          <div className="card" style={{ padding: '20px 22px' }}>
            <div style={{ fontSize: 14.5, lineHeight: 1.65, color: 'var(--text-primary)', textWrap: 'pretty', marginBottom: 16 }}>
              {contact.summary}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, paddingTop: 14, borderTop: '1px solid var(--border-subtle)' }}>
              <IconSparkle size={13} style={{ color: 'var(--text-tertiary)' }} />
              <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)', flex: 1 }}>
                Generated from {contact.timeline.length} email{contact.timeline.length === 1 ? '' : 's'} · Updated this morning
              </span>
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: 12, color: 'var(--heat-warm)', fontWeight: 600,
                padding: '3px 9px',
                background: 'rgba(76,166,114,0.1)',
                border: '1px solid rgba(76,166,114,0.25)',
                borderRadius: 999,
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--heat-warm)' }} />
                {contact.health}
              </span>
            </div>
          </div>
        </Section>

        {/* Section 2 — Timeline */}
        <Section title="Recent interactions">
          <div style={{ paddingLeft: 4 }}>
            {contact.timeline.map((entry, i) => (
              <TimelineRow key={i} entry={entry} isLast={i === contact.timeline.length - 1} />
            ))}
          </div>
        </Section>

        {/* Section 3 — Black Book history */}
        <Section title="Past recommendations">
          {contact.history.length === 0 ? (
            <div className="card" style={{
              padding: '18px 20px',
              color: 'var(--text-tertiary)', fontSize: 13.5,
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <BBMark size={20} />
              No prior recommendations on this contact yet.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {contact.history.map((h, i) => (
                <div key={i} className="card" style={{
                  padding: '14px 16px',
                  display: 'flex', alignItems: 'center', gap: 14,
                }}>
                  <div style={{ fontSize: 12, color: 'var(--text-tertiary)', minWidth: 56 }}>
                    {h.date}
                  </div>
                  <div style={{ flex: 1, fontSize: 13.5, color: 'var(--text-secondary)' }}>
                    {h.text}
                  </div>
                  <StatusBadge status={h.status} />
                </div>
              ))}
            </div>
          )}
        </Section>

        {/* Snooze */}
        <div style={{ marginTop: 36, textAlign: 'center' }}>
          {!snoozeOpen ? (
            <button className="btn btn-ghost" onClick={() => setSnoozeOpen(true)}>
              <IconSnooze size={14} />
              Snooze this contact
            </button>
          ) : (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 8px 6px 14px', background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)', borderRadius: 999,
            }}>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)' }}>Snooze for</span>
              {['1 week', '1 month', 'Remove'].map((opt) => (
                <button key={opt} onClick={() => setSnoozeOpen(false)}
                  style={{ padding: '6px 12px', fontSize: 12.5, fontWeight: 500,
                    borderRadius: 999, color: 'var(--text-secondary)',
                    background: 'var(--bg-hover)',
                  }}>{opt}</button>
              ))}
              <button onClick={() => setSnoozeOpen(false)} style={{ padding: 4, color: 'var(--text-tertiary)' }}>
                <IconX size={12} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="fade-up" style={{ marginBottom: 32 }}>
      <h2 className="section-header" style={{ marginBottom: 14 }}>{title}</h2>
      {children}
    </div>
  );
}

function TimelineRow({ entry, isLast }) {
  return (
    <div style={{ display: 'flex', gap: 16, position: 'relative' }}>
      {/* Rail */}
      <div style={{ position: 'relative', width: 12, flexShrink: 0, display: 'flex', justifyContent: 'center' }}>
        <div style={{
          width: 9, height: 9,
          borderRadius: '50%',
          background: 'var(--bg-primary)',
          border: '1.5px solid var(--accent)',
          marginTop: 6,
          boxShadow: '0 0 10px rgba(201,168,76,0.4)',
        }} />
        {!isLast && (
          <div style={{
            position: 'absolute', top: 18, bottom: -2, left: '50%',
            width: 1, background: 'var(--border-subtle)', transform: 'translateX(-50%)',
          }} />
        )}
      </div>
      <div style={{ flex: 1, paddingBottom: isLast ? 0 : 22 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 3 }}>
          <span style={{ fontSize: 11.5, color: 'var(--text-tertiary)', fontWeight: 500, fontVariantNumeric: 'tabular-nums' }}>
            {entry.date}
          </span>
          <span style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--text-primary)' }}>
            {entry.label}
          </span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
          {entry.detail}
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    Sent:      { color: 'var(--heat-warm)',   bg: 'rgba(76,166,114,0.1)',  border: 'rgba(76,166,114,0.25)' },
    Drafted:   { color: 'var(--accent)',       bg: 'rgba(201,168,76,0.1)',  border: 'rgba(201,168,76,0.25)' },
    Dismissed: { color: 'var(--text-tertiary)', bg: 'rgba(167,158,142,0.08)', border: 'rgba(167,158,142,0.18)' },
  };
  const s = styles[status] || styles.Drafted;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 9px', borderRadius: 999,
      fontSize: 11.5, fontWeight: 600,
      color: s.color, background: s.bg, border: `1px solid ${s.border}`,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: s.color }} />
      {status}
    </span>
  );
}

window.ContactDetailScreen = ContactDetailScreen;
