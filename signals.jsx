// Black Book — Signals screen

function SignalsScreen({ onDraft, onOpenContact }) {
  return (
    <div className="scroll-area" style={{ height: '100%', overflowY: 'auto' }}>
      <div style={{ maxWidth: 920, margin: '0 auto', padding: '40px 48px 56px' }}>
        <div className="fade-up" style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.025em', margin: '0 0 8px' }}>
            Signals
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14.5, margin: 0, maxWidth: 560 }}>
            We monitor your dormant contacts for moments worth acting on.
          </p>
        </div>

        <div className="divider-gold" style={{ marginBottom: 28 }} />

        {/* Section 1 */}
        <div className="fade-up" style={{ marginBottom: 36 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <h2 className="section-header" style={{ margin: 0, whiteSpace: 'nowrap' }}>New signals · this week</h2>
            <span style={{ fontSize: 11, color: 'var(--text-tertiary)', whiteSpace: 'nowrap' }}>
              {SIGNALS_FEED.length} found
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {SIGNALS_FEED.map((s, i) => (
              <SignalRow key={s.contactId} signal={s} onDraft={() => onDraft(s.contactId)} onOpen={() => onOpenContact(s.contactId)} index={i} />
            ))}
          </div>
        </div>

        {/* Section 2 */}
        <div className="fade-up">
          <div style={{ marginBottom: 16 }}>
            <h2 className="section-header" style={{ margin: '0 0 6px' }}>Cross-client insights</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, margin: 0 }}>
              Themes from your recent conversations that may be relevant to dormant contacts.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 12 }}>
            {CROSS_CLIENT_INSIGHTS.map((ins) => (
              <InsightCard key={ins.topic} insight={ins} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SignalRow({ signal, onDraft, onOpen, index }) {
  const [hover, setHover] = React.useState(false);
  const contact = SAMPLE_CONTACTS.find((c) => c.id === signal.contactId);
  const heat = contact?.heat || 'dormant';

  return (
    <div
      className="card fade-up"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '18px 20px',
        display: 'grid',
        gridTemplateColumns: 'auto 1fr auto',
        gap: 18,
        alignItems: 'center',
        background: hover ? 'var(--bg-hover)' : 'var(--bg-card)',
        borderColor: hover ? 'rgba(255,255,255,0.06)' : 'var(--border-subtle)',
        animationDelay: `${index * 70}ms`,
      }}
    >
      <Avatar initials={signal.initials} heat={heat} size={42} />

      <div style={{ minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
          <span onClick={onOpen} style={{ fontSize: 15, fontWeight: 600, cursor: 'pointer', letterSpacing: '-0.005em' }}>
            {signal.name}
          </span>
          <span style={{ color: 'var(--text-tertiary)' }}>·</span>
          <span style={{ color: 'var(--text-secondary)', fontSize: 14 }}>{signal.company}</span>
          <SignalKindBadge kind={signal.kind} />
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: 13.5, lineHeight: 1.55, marginBottom: 4, textWrap: 'pretty' }}>
          {signal.summary}
        </div>
        <div style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>
          Last contact: <span style={{ color: 'var(--text-secondary)' }}>{signal.lastContact}</span>
        </div>
      </div>

      <button className="btn btn-primary btn-sm" onClick={onDraft}>
        <IconEdit size={12} />
        Draft outreach
      </button>
    </div>
  );
}

function SignalKindBadge({ kind }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 8px',
      background: 'var(--accent-subtle)',
      border: '1px solid var(--accent-border)',
      borderRadius: 999,
      fontSize: 10.5, fontWeight: 600,
      letterSpacing: '0.05em', textTransform: 'uppercase',
      color: 'var(--accent-glow)',
      whiteSpace: 'nowrap',
      flexShrink: 0,
    }}>
      <span style={{ width: 4, height: 4, background: 'var(--accent)', borderRadius: '50%' }} />
      {kind}
    </span>
  );
}

function InsightCard({ insight }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      className="card"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        padding: '18px 18px 16px',
        background: hover ? 'var(--bg-hover)' : 'var(--bg-card)',
        borderColor: hover ? 'rgba(255,255,255,0.06)' : 'var(--border-subtle)',
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <IconBulb size={14} style={{ color: 'var(--accent-glow)' }} />
        <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>Topic</span>
      </div>
      <div style={{ fontSize: 16, fontWeight: 600, letterSpacing: '-0.012em', marginBottom: 10 }}>
        {insight.topic}
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: 4 }}>
        {insight.discussed}
      </div>
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.55, marginBottom: 14 }}>
        {insight.dormant}
      </div>
      <button style={{
        display: 'inline-flex', alignItems: 'center', gap: 4,
        color: 'var(--accent-glow)', fontSize: 12.5, fontWeight: 600,
      }}>
        See contacts <IconArrowUpRight size={12} />
      </button>
    </div>
  );
}

window.SignalsScreen = SignalsScreen;
