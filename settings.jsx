// Black Book — Settings & Contacts list screens

function SettingsScreen({ profile, setProfile, cadence, setCadence }) {
  const [signalSearch, setSignalSearch] = React.useState(true);
  const [crossClient, setCrossClient] = React.useState(true);
  const [dormantThreshold, setDormantThreshold] = React.useState('6 months');
  const [briefingTime, setBriefingTime] = React.useState('08:00');
  const [contactCount, setContactCount] = React.useState(3);

  return (
    <div className="scroll-area" style={{ height: '100%', overflowY: 'auto' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 48px 64px' }}>
        <div className="fade-up" style={{ marginBottom: 32 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.025em', margin: '0 0 6px' }}>
            Settings
          </h1>
          <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            How your book runs.
          </div>
        </div>

        <SettingsSection title="Your profile">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 18, marginBottom: 18, borderBottom: '1px solid var(--border-subtle)' }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'linear-gradient(135deg, #5A5648, #2A251C)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--silver)', fontWeight: 600, fontSize: 18,
              border: '1px solid rgba(201,168,76,0.25)',
            }}>{(profile.firstName?.[0] || 'L')}H</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 15, fontWeight: 600 }}>{profile.firstName || 'Luke'} Harrison</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>luke@harrison.media</div>
            </div>
            <button className="btn btn-ghost btn-sm">Change avatar</button>
          </div>
          <SettingRow label="First name">
            <input className="field-input" value={profile.firstName} onChange={(e) => setProfile({...profile, firstName: e.target.value})} style={{ maxWidth: 280 }} />
          </SettingRow>
          <SettingRow label="Job title">
            <input className="field-input" value={profile.title} onChange={(e) => setProfile({...profile, title: e.target.value})} style={{ maxWidth: 280 }} />
          </SettingRow>
          <SettingRow label="Company">
            <input className="field-input" value={profile.company} onChange={(e) => setProfile({...profile, company: e.target.value})} style={{ maxWidth: 280 }} />
          </SettingRow>
        </SettingsSection>

        <SettingsSection title="Preferences">
          <SettingRow label="Tone preference" hint="Default for new drafts">
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, width: 280 }}>
              <div className="pill-row" style={{ width: '100%', opacity: profile.toneFromEmails ? 0.4 : 1, transition: 'opacity 180ms' }}>
                {['Direct', 'Warm', 'Formal'].map((t) => (
                  <button key={t}
                    className={`pill ${profile.tone === t && !profile.toneFromEmails ? 'active' : ''}`}
                    onClick={() => setProfile({...profile, tone: t, toneFromEmails: false})}
                  >{t}</button>
                ))}
              </div>
              <button
                onClick={() => setProfile({...profile, toneFromEmails: !profile.toneFromEmails})}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  width: '100%', textAlign: 'left',
                  padding: '9px 11px',
                  background: profile.toneFromEmails ? 'rgba(201,168,76,0.08)' : 'var(--bg-card)',
                  border: '1px solid',
                  borderColor: profile.toneFromEmails ? 'var(--accent-border)' : 'var(--border-subtle)',
                  borderRadius: 10,
                  boxShadow: profile.toneFromEmails ? '0 0 0 3px rgba(201,168,76,0.08)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 180ms',
                }}
              >
                <div style={{
                  width: 17, height: 17, borderRadius: 5, flexShrink: 0,
                  background: profile.toneFromEmails ? 'var(--accent)' : 'transparent',
                  border: '1.5px solid',
                  borderColor: profile.toneFromEmails ? 'var(--accent)' : 'var(--border-strong, var(--border-subtle))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#0F0B02',
                  transition: 'all 180ms',
                }}>
                  {profile.toneFromEmails && <IconCheck size={11} />}
                </div>
                <div style={{
                  fontSize: 13, fontWeight: 500,
                  color: profile.toneFromEmails ? 'var(--accent-glow)' : 'var(--text-primary)',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <IconSparkle size={11} />
                  Match tone from my emails
                </div>
              </button>
            </div>
          </SettingRow>
          <SettingRow label="Briefing cadence">
            <SelectControl
              value={cadence}
              onChange={setCadence}
              options={[
                { id: 'daily', label: 'Daily' },
                { id: '2day', label: 'Every 2 days' },
                { id: 'mon-thu', label: 'Mon & Thu' },
                { id: 'weekly', label: 'Weekly' },
              ]}
            />
          </SettingRow>
          <SettingRow label="Briefing time" hint="In your local time">
            <input className="field-input" type="time" value={briefingTime} onChange={(e) => setBriefingTime(e.target.value)} style={{ maxWidth: 140 }} />
          </SettingRow>
          <SettingRow label="Contacts per briefing">
            <Stepper value={contactCount} min={2} max={6} onChange={setContactCount} />
          </SettingRow>
        </SettingsSection>

        <SettingsSection title="Intelligence">
          <ToggleRow
            label="Search the web for contact signals"
            hint="Detects new roles, company news and product launches for dormant contacts."
            checked={signalSearch} onChange={setSignalSearch}
          />
          <ToggleRow
            label="Surface cross-client insights"
            hint="Spots themes resonating across your conversations and suggests where they may land."
            checked={crossClient} onChange={setCrossClient}
          />
          <SettingRow label="Dormant threshold" hint="Surface contacts inactive for at least:">
            <SelectControl
              value={dormantThreshold}
              onChange={setDormantThreshold}
              options={[
                { id: '3 months', label: '3 months' },
                { id: '6 months', label: '6 months' },
                { id: '12 months', label: '12 months' },
              ]}
            />
          </SettingRow>
        </SettingsSection>

        <SettingsSection title="Connections">
          <ConnectionRow connected platform="Gmail" detail="luke@harrison.media" />
          <ConnectionRow platform="LinkedIn" detail="Coming soon" />
          <ConnectionRow platform="WhatsApp" detail="Coming soon" />
          <ConnectionRow platform="Events"   detail="Coming soon" />
        </SettingsSection>

        <SettingsSection title="Account">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 500 }}>Plan</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)' }}>Unlimited briefings, full signal search</div>
            </div>
            <span style={{
              padding: '4px 12px', borderRadius: 999,
              background: 'rgba(201,168,76,0.10)',
              border: '1px solid var(--accent-border)',
              color: 'var(--accent-glow)', fontSize: 12, fontWeight: 600,
              letterSpacing: '0.02em',
            }}>Pro</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 0', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: 14, fontWeight: 500, color: 'var(--heat-cold)' }}>Sign out</div>
            <button style={{ color: 'var(--heat-cold)', fontSize: 13, fontWeight: 500 }}>Sign out →</button>
          </div>
        </SettingsSection>

        <div style={{
          marginTop: 40, padding: '18px 0 0',
          borderTop: '1px solid var(--border-subtle)',
          fontSize: 12, color: 'var(--text-tertiary)', textAlign: 'center',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        }}>
          <BBMark size={16} />
          <span>My Black Book · v0.1 · The book on everyone who matters.</span>
        </div>
      </div>
    </div>
  );
}

function SettingsSection({ title, children }) {
  return (
    <div className="fade-up" style={{ marginBottom: 36 }}>
      <h2 className="section-header" style={{ marginBottom: 14 }}>{title}</h2>
      <div className="card" style={{ padding: '4px 22px' }}>
        {children}
      </div>
    </div>
  );
}

function SettingRow({ label, hint, children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 24, padding: '16px 0',
      borderTop: '1px solid var(--border-subtle)',
    }}>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
        {hint && <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', marginTop: 2 }}>{hint}</div>}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

function ToggleRow({ label, hint, checked, onChange }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      gap: 24, padding: '16px 0',
      borderTop: '1px solid var(--border-subtle)',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500 }}>{label}</div>
        {hint && <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)', marginTop: 2, maxWidth: 480, lineHeight: 1.45 }}>{hint}</div>}
      </div>
      <button
        onClick={() => onChange(!checked)}
        style={{
          width: 40, height: 22, borderRadius: 999,
          background: checked ? 'var(--accent)' : 'var(--bg-elevated)',
          position: 'relative', transition: 'background 200ms',
          boxShadow: checked ? '0 0 0 1px rgba(201,168,76,0.4), 0 0 6px rgba(201,168,76,0.15)' : 'inset 0 0 0 1px var(--border-subtle)',
          flexShrink: 0,
        }}>
        <span style={{
          position: 'absolute', top: 3, left: checked ? 21 : 3,
          width: 16, height: 16, borderRadius: '50%',
          background: checked ? '#0F0B02' : '#9C9686',
          transition: 'left 220ms cubic-bezier(0.4, 0, 0.2, 1)',
        }} />
      </button>
    </div>
  );
}

function SelectControl({ value, onChange, options }) {
  const [open, setOpen] = React.useState(false);
  const current = options.find((o) => o.id === value) || options[0];
  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '9px 14px',
          background: 'var(--bg-elevated)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 8, fontSize: 13.5, fontWeight: 500,
          minWidth: 180, justifyContent: 'space-between',
          color: 'var(--text-primary)',
        }}>
        {current.label}
        <IconChevronDown size={14} style={{ color: 'var(--text-tertiary)' }} />
      </button>
      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 1 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute', top: 'calc(100% + 6px)', right: 0, zIndex: 2,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 10,
            padding: 4, minWidth: 180,
            boxShadow: '0 12px 28px rgba(0,0,0,0.4)',
          }}>
            {options.map((o) => (
              <button key={o.id}
                onClick={() => { onChange(o.id); setOpen(false); }}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  width: '100%', padding: '8px 12px', borderRadius: 6,
                  fontSize: 13.5, color: o.id === value ? 'var(--accent-glow)' : 'var(--text-secondary)',
                  background: o.id === value ? 'var(--accent-subtle)' : 'transparent',
                  textAlign: 'left',
                }}>
                {o.label}
                {o.id === value && <IconCheck size={13} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function Stepper({ value, min, max, onChange }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center',
      background: 'var(--bg-elevated)', borderRadius: 8,
      border: '1px solid var(--border-subtle)', overflow: 'hidden',
    }}>
      <button onClick={() => onChange(Math.max(min, value - 1))}
        style={{ padding: '8px 14px', color: 'var(--text-secondary)', fontSize: 16 }}>−</button>
      <div style={{ padding: '0 16px', fontSize: 14, fontWeight: 600, minWidth: 36, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </div>
      <button onClick={() => onChange(Math.min(max, value + 1))}
        style={{ padding: '8px 14px', color: 'var(--text-secondary)', fontSize: 16 }}>+</button>
    </div>
  );
}

function ConnectionRow({ connected, platform, detail }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '14px 0', borderTop: '1px solid var(--border-subtle)',
      gap: 16,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 11, flex: 1 }}>
        <span className="dot" style={{
          background: connected ? 'var(--heat-warm)' : 'var(--text-tertiary)',
        }} />
        <div>
          <div style={{ fontSize: 14, fontWeight: 500, color: connected ? 'var(--text-primary)' : 'var(--text-tertiary)' }}>{platform}</div>
          <div style={{ fontSize: 12.5, color: 'var(--text-tertiary)' }}>{detail}</div>
        </div>
      </div>
      {connected && <button style={{ color: 'var(--text-secondary)', fontSize: 13 }}>Reconnect</button>}
    </div>
  );
}


// CONTACTS list screen
function ContactsScreen({ contacts, onOpen, onDraft }) {
  const [filter, setFilter] = React.useState('all');
  const filters = [
    { id: 'all',      label: 'All' },
    { id: 'active',   label: 'Active' },
    { id: 'dormant',  label: 'Dormant' },
    { id: 'archive',  label: 'Archive' },
  ];
  const visible = filter === 'all'
    ? contacts
    : filter === 'active'
      ? contacts.filter((c) => ['warm', 'cooling', 'cold'].includes(c.heat))
      : filter === 'dormant'
        ? contacts.filter((c) => c.heat === 'dormant')
        : contacts.filter((c) => c.archived === true);

  return (
    <div className="scroll-area" style={{ height: '100%', overflowY: 'auto' }}>
      <div style={{ maxWidth: 920, margin: '0 auto', padding: '40px 48px 56px' }}>
        <div className="fade-up" style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.025em', margin: '0 0 6px' }}>
            Contacts
          </h1>
          <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Everyone in your book, pulled from Gmail.
          </div>
        </div>

        <div className="fade-up" style={{ display: 'flex', gap: 6, marginBottom: 18, flexWrap: 'wrap' }}>
          {filters.map((f) => {
            const active = f.id === filter;
            return (
              <button key={f.id} onClick={() => setFilter(f.id)}
                style={{
                  padding: '6px 13px', borderRadius: 999, fontSize: 12.5,
                  fontWeight: active ? 600 : 500,
                  background: active ? 'var(--accent-subtle)' : 'transparent',
                  border: `1px solid ${active ? 'var(--accent-border)' : 'var(--border-subtle)'}`,
                  color: active ? 'var(--accent-glow)' : 'var(--text-secondary)',
                }}>{f.label}</button>
            );
          })}
        </div>

        <div className="card" style={{ overflow: 'hidden' }}>
          {/* Table header */}
          <div style={{
            display: 'grid', gridTemplateColumns: '2.2fr 1fr 1.2fr auto',
            gap: 16, padding: '12px 20px',
            borderBottom: '1px solid var(--border-subtle)',
            fontSize: 11, fontWeight: 600, letterSpacing: '0.08em',
            textTransform: 'uppercase', color: 'var(--text-tertiary)',
            background: 'rgba(0,0,0,0.15)',
          }}>
            <div>Contact</div>
            <div>Heat</div>
            <div>Last topic</div>
            <div style={{ width: 80 }}></div>
          </div>

          {visible.map((c, i) => (
            <ContactRow key={c.id} contact={c} onOpen={() => onOpen(c.id)} onDraft={() => onDraft(c.id)} isLast={i === visible.length - 1} />
          ))}
        </div>
      </div>
    </div>
  );
}

function ContactRow({ contact, onOpen, onDraft, isLast }) {
  const [hover, setHover] = React.useState(false);
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={onOpen}
      style={{
        display: 'grid', gridTemplateColumns: '2.2fr 1fr 1.2fr auto',
        gap: 16, padding: '14px 20px',
        borderBottom: isLast ? 'none' : '1px solid var(--border-subtle)',
        background: hover ? 'var(--bg-hover)' : 'transparent',
        alignItems: 'center',
        cursor: 'pointer', transition: 'background 140ms',
      }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
        <Avatar initials={contact.initials} heat={contact.heat} size={34} />
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{contact.name}</div>
          <div style={{ fontSize: 12, color: 'var(--text-tertiary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {contact.role} · {contact.company}
          </div>
        </div>
      </div>
      <HeatLabel heat={contact.heat} label={contact.heatLabel} days={contact.days} daysLabel={contact.daysLabel} />
      <div style={{ fontSize: 13, color: 'var(--text-secondary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {contact.lastTopic}
      </div>
      <div style={{ width: 80, textAlign: 'right' }}>
        {hover && (
          <button className="btn btn-ghost btn-sm" onClick={(e) => { e.stopPropagation(); onDraft(); }}>
            Draft
          </button>
        )}
      </div>
    </div>
  );
}

Object.assign(window, { SettingsScreen, ContactsScreen });
