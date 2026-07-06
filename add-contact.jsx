// Black Book — quick contact capture screen ("I just met someone")

function AddContactScreen({ onBack, onAdded }) {
  const [name, setName] = React.useState('');
  const [company, setCompany] = React.useState('');
  const [role, setRole] = React.useState('');
  const [where, setWhere] = React.useState('');
  const [note, setNote] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  const canSubmit = name.trim().length > 0;

  const initials = (() => {
    const parts = name.trim().split(/\s+/).filter(Boolean);
    if (parts.length === 0) return '?';
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  })();

  const handleSubmit = (e) => {
    e?.preventDefault?.();
    if (!canSubmit) return;
    setSaving(true);
    setTimeout(() => {
      const id = 'new-' + Date.now();
      onAdded({
        id,
        name: name.trim(),
        company: company.trim() || '—',
        role: role.trim() || 'Contact',
        heat: 'warm',
        heatLabel: 'Just met',
        days: 0,
        daysLabel: 'Today',
        initials,
        reason: where.trim()
          ? `Met at ${where.trim()}.${note.trim() ? ' ' + note.trim() : ''}`
          : (note.trim() || 'New contact added manually.'),
        signal: null,
        summary: [
          where.trim() ? `You met ${name.trim().split(' ')[0]} at ${where.trim()}.` : `You added ${name.trim().split(' ')[0]} to your book today.`,
          note.trim(),
        ].filter(Boolean).join(' '),
        health: 'New relationship',
        timeline: [
          { date: 'Today', label: 'Added to your book', detail: where.trim() ? `Met at ${where.trim()}` : 'Manually captured contact' },
        ],
        history: [],
        draft: `Hi ${name.trim().split(' ')[0]} — great to meet you${where.trim() ? ' at ' + where.trim() : ''}. Wanted to drop a quick line so we have each other's details.\n\nWould love to find a moment to continue our conversation properly.\n\nBest,\nLuke`,
        lastTopic: where.trim() || 'Introduction',
      });
    }, 380);
  };

  return (
    <div className="scroll-area" style={{ height: '100%', overflowY: 'auto' }}>
      <div style={{ maxWidth: 560, margin: '0 auto', padding: 'var(--screen-pad-v) var(--screen-pad-h) 64px' }}>

        <button
          onClick={onBack}
          className="fade-up"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: 'var(--text-secondary)', fontSize: 13, padding: '6px 10px 6px 6px',
            marginLeft: -10, marginBottom: 22, borderRadius: 6,
          }}
        >
          <IconChevronLeft size={15} />
          Back
        </button>

        <div className="fade-up" style={{ marginBottom: 28, display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(201,168,76,0.10)',
            border: '1px solid var(--accent-border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--accent-glow)', flexShrink: 0,
          }}>
            <IconBook size={20} />
          </div>
          <div>
            <h1 style={{
              fontSize: 26, fontWeight: 600, letterSpacing: '-0.025em',
              margin: '0 0 4px', lineHeight: 1.2,
            }}>
              I just met someone
            </h1>
            <div style={{ color: 'var(--text-secondary)', fontSize: 13.5 }}>
              Capture the essentials. We'll take care of the rest.
            </div>
          </div>
        </div>

        <form className="fade-up card" onSubmit={handleSubmit} style={{
          padding: '24px 24px 22px',
          display: 'flex', flexDirection: 'column', gap: 18,
        }}>
          <div className="field">
            <label className="field-label" htmlFor="bb-name">Name</label>
            <input
              id="bb-name"
              className="field-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jordan Pierce"
              autoFocus
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
            <div className="field">
              <label className="field-label" htmlFor="bb-company">Company</label>
              <input
                id="bb-company"
                className="field-input"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="Acme Media"
              />
            </div>
            <div className="field">
              <label className="field-label" htmlFor="bb-role">Role</label>
              <input
                id="bb-role"
                className="field-input"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="Head of Brand"
              />
            </div>
          </div>

          <div className="field">
            <label className="field-label" htmlFor="bb-where">Where we met</label>
            <input
              id="bb-where"
              className="field-input"
              value={where}
              onChange={(e) => setWhere(e.target.value)}
              placeholder="Brand Innovators dinner, 26 May"
            />
          </div>

          <div className="field">
            <label className="field-label" htmlFor="bb-note">Quick note</label>
            <textarea
              id="bb-note"
              className="field-input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What stood out? Anything to remember when you follow up."
              rows={3}
              style={{ resize: 'vertical', minHeight: 80, lineHeight: 1.55 }}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg btn-block"
            disabled={!canSubmit || saving}
            style={{
              marginTop: 4,
              opacity: !canSubmit ? 0.5 : 1,
              cursor: !canSubmit ? 'not-allowed' : 'pointer',
            }}
          >
            {saving ? (
              <>Adding…</>
            ) : (
              <>
                <IconPlus size={14} />
                Add to My Black Book
              </>
            )}
          </button>
        </form>

        {canSubmit && (
          <div className="fade-up" style={{
            marginTop: 16,
            display: 'flex', alignItems: 'center', gap: 12,
            padding: '12px 14px',
            background: 'var(--bg-card)',
            border: '1px dashed var(--border-subtle)',
            borderRadius: 10,
            fontSize: 12.5, color: 'var(--text-tertiary)',
          }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'linear-gradient(135deg, #5FBE8C, #2F6B4B)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#0F0B02', fontWeight: 600, fontSize: 12, flexShrink: 0,
            }}>{initials}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ color: 'var(--text-secondary)' }}>{name}</span>
              {(company || role) && (
                <>
                  <span style={{ opacity: 0.5 }}> · </span>
                  <span>{[role, company].filter(Boolean).join(' · ')}</span>
                </>
              )}
            </div>
            <span style={{ color: 'var(--accent-glow)', fontWeight: 500, whiteSpace: 'nowrap' }}>Just met</span>
          </div>
        )}
      </div>
    </div>
  );
}

window.AddContactScreen = AddContactScreen;
