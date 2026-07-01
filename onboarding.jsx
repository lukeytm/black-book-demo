// Black Book — onboarding screens (Welcome, Details, Cadence)

function OnboardingShell({ children, step }) {
  return (
    <div className="scroll-area" style={{
      height: '100%',
      width: '100%',
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '64px 32px 84px',
      position: 'relative',
      background: `
        radial-gradient(70% 50% at 50% -10%, rgba(201,168,76,0.07), transparent 65%),
        var(--bg-primary)
      `,
    }}>
      {/* Top-left wordmark */}
      <div style={{
        position: 'absolute', top: 28, left: 32,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <BBMark size={26} />
        <div className="wordmark" style={{ fontSize: 17, fontWeight: 600 }}>My Black Book</div>
      </div>

      {/* Step indicator */}
      {step && <StepIndicator step={step} />}

      <div className="fade-up" style={{ width: '100%', maxWidth: 460, flexShrink: 0 }}>
        {children}
      </div>
    </div>
  );
}

function StepIndicator({ step }) {
  // step = 1, 2, or 3
  return (
    <div style={{
      position: 'absolute', top: 36, left: '50%', transform: 'translateX(-50%)',
      display: 'flex', alignItems: 'center', gap: 8,
    }}>
      {[1,2,3].map((n) => {
        const state = n < step ? 'complete' : n === step ? 'active' : 'upcoming';
        return (
          <React.Fragment key={n}>
            <div style={{
              width: state === 'active' ? 9 : 7,
              height: state === 'active' ? 9 : 7,
              borderRadius: '50%',
              background: state === 'complete' ? 'var(--accent)' :
                          state === 'active'   ? 'var(--accent)' :
                          'transparent',
              border: state === 'upcoming' ? '1.5px solid var(--border-subtle)' : 'none',
              boxShadow: state === 'active' ? '0 0 0 4px rgba(201,168,76,0.18)' : 'none',
              transition: 'all 240ms',
            }} />
            {n < 3 && <div style={{
              width: 22, height: 1,
              background: n < step ? 'var(--accent-border)' : 'var(--border-subtle)',
            }} />}
          </React.Fragment>
        );
      })}
    </div>
  );
}

// SCREEN 1 — WELCOME
function OnboardingWelcome({ onNext }) {
  return (
    <OnboardingShell>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 36 }}>
        <div style={{ marginTop: -20 }}>
          <BBMark size={64} glow />
        </div>

        <div style={{ maxWidth: 560 }}>
          <h1 style={{
            fontSize: 34,
            lineHeight: 1.22,
            fontWeight: 600,
            letterSpacing: '-0.025em',
            margin: '0 0 22px',
            textWrap: 'balance',
            color: 'var(--text-primary)',
          }}>
            The best salespeople have always had a <span style={{ color: 'var(--accent-glow)' }}>black book</span>.
          </h1>
          <div style={{
            display: 'flex', flexDirection: 'column',
            fontSize: 16,
            lineHeight: 1.65,
            color: 'var(--text-secondary)',
          }}>
            <span>Keep relationships warm.</span>
            <span>Surface lost money.</span>
            <span>Close more business.</span>
          </div>
        </div>

        <div style={{ width: '100%', maxWidth: 380, display: 'flex', flexDirection: 'column', gap: 12, marginTop: 10 }}>
          <button className="btn btn-primary btn-lg btn-block" onClick={onNext}>
            Try it with your business
            <IconChevronRight size={16} />
          </button>
          <p style={{
            fontSize: 12, color: 'var(--text-tertiary)',
            textAlign: 'center', margin: 0, lineHeight: 1.5,
          }}>
            No account needed — we'll generate a sample book from what you tell us.
          </p>
        </div>
      </div>
    </OnboardingShell>
  );
}

// SCREEN 2 — DETAILS
function OnboardingDetails({ onNext, profile, setProfile }) {
  return (
    <OnboardingShell step={2}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 8px' }}>
            A little about you.
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 14.5 }}>
            So every message sounds like you — not a template.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          <div className="field">
            <label className="field-label">First name</label>
            <input className="field-input" value={profile.firstName} onChange={(e) => setProfile({...profile, firstName: e.target.value})} placeholder="Luke" />
          </div>
          <div className="field">
            <label className="field-label">Job title</label>
            <input className="field-input" value={profile.title} onChange={(e) => setProfile({...profile, title: e.target.value})} placeholder="Sales Director" />
          </div>
          <div className="field">
            <label className="field-label">Company name</label>
            <input className="field-input" value={profile.company} onChange={(e) => setProfile({...profile, company: e.target.value})} placeholder="Acme Media" />
          </div>
          <div className="field">
            <label className="field-label">Tone preference</label>
            <div className="pill-row" style={{ opacity: profile.toneFromEmails ? 0.4 : 1, transition: 'opacity 180ms' }}>
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
                marginTop: 10,
                display: 'flex', alignItems: 'center', gap: 11,
                padding: '12px 14px',
                width: '100%',
                textAlign: 'left',
                background: profile.toneFromEmails ? 'rgba(201,168,76,0.08)' : 'var(--bg-card)',
                border: '1px solid',
                borderColor: profile.toneFromEmails ? 'var(--accent-border)' : 'var(--border-subtle)',
                borderRadius: 10,
                boxShadow: profile.toneFromEmails ? '0 0 0 3px rgba(201,168,76,0.08)' : 'none',
                transition: 'all 180ms',
              }}
            >
              <div style={{
                width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                background: profile.toneFromEmails ? 'var(--accent)' : 'transparent',
                border: '1.5px solid',
                borderColor: profile.toneFromEmails ? 'var(--accent)' : 'var(--border-strong, var(--border-subtle))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#0F0B02',
                transition: 'all 180ms',
              }}>
                {profile.toneFromEmails && <IconCheck size={12} />}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 13.5, fontWeight: 500,
                  color: profile.toneFromEmails ? 'var(--accent-glow)' : 'var(--text-primary)',
                  display: 'flex', alignItems: 'center', gap: 6,
                }}>
                  <IconSparkle size={12} />
                  Match the tone from my current emails
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 2, lineHeight: 1.45 }}>
                  Learned from your last 60 days of sent mail.
                </div>
              </div>
            </button>
            <div style={{ fontSize: 12, color: 'var(--text-tertiary)', marginTop: 8 }}>
              You can change this for individual messages too.
            </div>
          </div>
        </div>

        <button className="btn btn-primary btn-lg btn-block" onClick={onNext}>
          Continue
          <IconChevronRight size={16} />
        </button>
      </div>
    </OnboardingShell>
  );
}

// SCREEN 3 — CADENCE
function OnboardingCadence({ onNext, cadence, setCadence }) {
  const options = [
    { id: 'daily',    name: 'Daily',       desc: 'Every morning, fresh priorities', Icon: IconSun },
    { id: '2day',     name: 'Every 2 days', desc: 'Steady pace, focused outreach',  Icon: IconFlame },
    { id: 'mon-thu',  name: 'Mon & Thu',   desc: 'Twice weekly rhythm',             Icon: IconCalendar },
    { id: 'weekly',   name: 'Weekly',      desc: 'One focused session per week',    Icon: IconRefresh },
  ];

  return (
    <OnboardingShell step={3}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
        <div>
          <h2 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 8px' }}>
            When should your book brief you?
          </h2>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 14.5 }}>
            You can change this any time in settings.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {options.map((opt) => {
            const isSelected = cadence === opt.id;
            return (
              <button key={opt.id}
                onClick={() => setCadence(opt.id)}
                style={{
                  textAlign: 'left',
                  padding: '18px 16px',
                  background: isSelected ? 'rgba(201,168,76,0.08)' : 'var(--bg-card)',
                  border: '1px solid',
                  borderColor: isSelected ? 'var(--accent-border)' : 'var(--border-subtle)',
                  borderRadius: 12,
                  boxShadow: isSelected ? '0 0 0 3px rgba(201,168,76,0.10)' : 'none',
                  display: 'flex', flexDirection: 'column', gap: 8,
                  transition: 'all 180ms',
                }}>
                <opt.Icon size={20} style={{ color: isSelected ? 'var(--accent-glow)' : 'var(--text-secondary)' }} />
                <div>
                  <div style={{ fontSize: 15, fontWeight: 600, marginBottom: 2 }}>{opt.name}</div>
                  <div style={{ fontSize: 12.5, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                    {opt.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        <button className="btn btn-primary btn-lg btn-block" onClick={onNext}>
          Enter my book
          <IconChevronRight size={16} />
        </button>
      </div>
    </OnboardingShell>
  );
}

Object.assign(window, { OnboardingWelcome, OnboardingDetails, OnboardingCadence });
