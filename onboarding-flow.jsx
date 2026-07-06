// Black Book — onboarding flow (Scanning, Profile review, Entry confirmation)
// Flat, dark, premium. No gradients, no glow. Gold reserved for state + CTA.

// ─────────────────────────────────────────────────────────────
// Shared flat stage shell
// ─────────────────────────────────────────────────────────────
function OnboardingStage({ children, maxWidth = 480, step, label }) {
  return (
    <div className="scroll-area" style={{
      height: '100%', width: '100%', overflowY: 'auto',
      position: 'relative', background: 'var(--bg-primary)',
    }} data-screen-label={label}>
      {/* Wordmark */}
      <div style={{
        position: 'fixed', top: 30, left: 34, zIndex: 5,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <BBMark size={26} />
        <div className="wordmark" style={{ fontSize: 16, fontWeight: 600 }}>My Black Book</div>
      </div>

      {step && <FlatStepRail step={step} />}

      {/* Centering wrapper — grows past 100% so tall content scrolls from the top */}
      <div style={{
        minHeight: '100%', width: '100%',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '96px 32px 108px',
      }}>
        <div style={{ width: '100%', maxWidth, flexShrink: 0 }}>
          {children}
        </div>
      </div>
    </div>
  );
}

// Flat step rail — 4 steps, no glow
function FlatStepRail({ step }) {
  return (
    <div style={{
      position: 'fixed', top: 34, left: '50%', transform: 'translateX(-50%)', zIndex: 5,
      display: 'flex', alignItems: 'center', gap: 7,
    }}>
      {[1, 2, 3, 4].map((n) => {
        const done = n < step, active = n === step;
        return (
          <React.Fragment key={n}>
            <div style={{
              width: active ? 18 : 6, height: 6, borderRadius: 999,
              background: done || active ? 'var(--accent)' : 'var(--border-subtle)',
              transition: 'all 320ms cubic-bezier(0.4,0,0.2,1)',
            }} />
          </React.Fragment>
        );
      })}
    </div>
  );
}

// Row that fades + lifts in on mount
function RevealRow({ delay = 0, children, style = {} }) {
  const [shown, setShown] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setShown(true), delay);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={{
      opacity: shown ? 1 : 0,
      transform: shown ? 'translateY(0)' : 'translateY(7px)',
      transition: 'opacity 420ms ease, transform 420ms cubic-bezier(0.2,0.65,0.3,1)',
      ...style,
    }}>
      {children}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP 2 — SCANNING
// ─────────────────────────────────────────────────────────────
function OnboardingScanning({ onDone, ready, error, onRetry, onUseFallback }) {
  const items = [
    { id: 'profile', label: 'Reading your business details',     result: 'Profile understood',      Icon: IconMail,     dur: 1300 },
    { id: 'rel',     label: 'Generating plausible contacts',     result: '5 contacts created',       Icon: IconContacts, dur: 1500 },
    { id: 'co',      label: 'Researching relevant companies',    result: 'Industry context applied', Icon: IconBriefing, dur: 1400 },
    { id: 'signals', label: 'Drafting company-news signals',     result: 'Signals generated',         Icon: IconSignals,  dur: 1300 },
    { id: 'network', label: 'Writing sample outreach drafts',    result: 'Drafts ready',              Icon: IconSparkle,  dur: 1400 },
  ];

  const [active, setActive] = React.useState(-1);   // index currently working
  const [doneCount, setDoneCount] = React.useState(0);
  const [waiting, setWaiting] = React.useState(false); // cosmetic animation done, waiting on real API
  const timers = React.useRef([]);

  React.useEffect(() => {
    let i = 0;
    const step = () => {
      if (i >= items.length) {
        setWaiting(true);
        return;
      }
      setActive(i);
      timers.current.push(setTimeout(() => {
        setDoneCount(i + 1);
        i += 1;
        timers.current.push(setTimeout(step, 300));
      }, items[i].dur));
    };
    timers.current.push(setTimeout(step, 500));
    return () => timers.current.forEach(clearTimeout);
  }, []);

  // Only advance once BOTH the cosmetic animation has finished AND the real
  // generation call has resolved — whichever finishes last gates the transition.
  React.useEffect(() => {
    if (waiting && ready && !error) {
      const t = setTimeout(() => onDone && onDone(), 500);
      return () => clearTimeout(t);
    }
  }, [waiting, ready, error]);

  const pct = Math.round((doneCount / items.length) * 100);
  const finished = doneCount >= items.length;

  if (waiting && error) {
    return (
      <OnboardingStage maxWidth={480} step={2} label="onboarding-scanning-error">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22, textAlign: 'center', alignItems: 'center' }}>
          <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>
            Couldn't generate your book
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 14.5, lineHeight: 1.55 }}>
            Something went wrong reaching the generator. You can try again, or continue with a generic sample book instead.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 11, width: '100%', maxWidth: 320 }}>
            <button className="btn btn-primary btn-lg btn-block" onClick={onRetry}>Try again</button>
            <button className="btn btn-ghost btn-block" onClick={onUseFallback}>Continue with sample data</button>
          </div>
        </div>
      </OnboardingStage>
    );
  }

  return (
    <OnboardingStage maxWidth={520} step={2} label="onboarding-scanning">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
        <div>
          <h1 style={{
            fontSize: 28, fontWeight: 600, letterSpacing: '-0.025em',
            margin: '0 0 9px', display: 'inline-flex', alignItems: 'baseline', gap: 2,
          }}>
            Building your book
            <span className="bb-dots" aria-hidden="true">…</span>
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 14.5, lineHeight: 1.55 }}>
            Generating a sample set of contacts and drafts based on what you told us.
          </p>
        </div>

        {/* Feed */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
        }}>
          {items.map((it, idx) => {
            if (idx > active) return null;
            const isDone = idx < doneCount;
            const isActive = idx === active && !isDone;
            return (
              <RevealRow key={it.id}>
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  padding: '15px 17px',
                  borderTop: idx === 0 ? 'none' : '1px solid var(--border-subtle)',
                }}>
                  {/* Source icon */}
                  <div style={{
                    width: 32, height: 32, flexShrink: 0, borderRadius: 9,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: isDone || isActive ? 'var(--accent-faint)' : 'transparent',
                    border: '1px solid',
                    borderColor: isDone || isActive ? 'var(--accent-border)' : 'var(--border-subtle)',
                    color: isDone || isActive ? 'var(--accent-glow)' : 'var(--text-tertiary)',
                    transition: 'all 240ms',
                  }}>
                    <it.Icon size={16} />
                  </div>

                  {/* Label + result */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 14.5, fontWeight: 500,
                      color: isDone || isActive ? 'var(--text-primary)' : 'var(--text-secondary)',
                      transition: 'color 240ms',
                    }}>{it.label}</div>
                    <div style={{
                      fontSize: 12.5, color: 'var(--silver-dim)',
                      maxHeight: isDone ? 20 : 0, opacity: isDone ? 1 : 0,
                      marginTop: isDone ? 2 : 0,
                      overflow: 'hidden',
                      transition: 'all 320ms cubic-bezier(0.2,0.65,0.3,1)',
                    }}>{it.result}</div>
                  </div>

                  {/* Status */}
                  <div style={{ flexShrink: 0, width: 22, display: 'flex', justifyContent: 'center' }}>
                    {isDone ? (
                      <div style={{
                        width: 20, height: 20, borderRadius: '50%',
                        background: 'var(--accent)', color: '#0F0B02',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <IconCheck size={12} />
                      </div>
                    ) : (
                      <span className="dot dot-pulse" style={{ color: 'var(--accent)', background: 'var(--accent)' }} />
                    )}
                  </div>
                </div>
              </RevealRow>
            );
          })}
        </div>

        {/* Progress */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <span style={{ fontSize: 12.5, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
              {waiting && !ready && <span className="spinner" aria-hidden="true" />}
              {finished && ready ? 'Done' : waiting ? 'Almost there — writing your drafts' : 'Generating'}
            </span>
            {!(waiting && !ready) && (
              <span style={{
                fontSize: 12.5, fontWeight: 600,
                color: finished ? 'var(--accent-glow)' : 'var(--text-tertiary)',
                fontVariantNumeric: 'tabular-nums',
              }}>{pct}%</span>
            )}
          </div>
          <div style={{
            position: 'relative',
            height: 4, borderRadius: 999, background: 'var(--border-subtle)', overflow: 'hidden',
          }}>
            {waiting && !ready ? (
              <div className="progress-indeterminate" />
            ) : (
              <div style={{
                height: '100%', width: `${pct}%`, background: 'var(--accent)', borderRadius: 999,
                transition: 'width 600ms cubic-bezier(0.4,0,0.2,1)',
              }} />
            )}
          </div>
        </div>
      </div>
    </OnboardingStage>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP 3 — PROFILE REVIEW
// ─────────────────────────────────────────────────────────────
function ReviewField({ label, value, onChange, multiline, editAll, placeholder }) {
  const [editing, setEditing] = React.useState(false);
  const [hover, setHover] = React.useState(false);
  const inputRef = React.useRef(null);
  const isEditing = editing || editAll;

  React.useEffect(() => {
    if (editing && inputRef.current) {
      const el = inputRef.current;
      el.focus();
      el.setSelectionRange(el.value.length, el.value.length);
    }
  }, [editing]);

  const commit = () => setEditing(false);
  const onKey = (e) => {
    if (e.key === 'Enter' && !multiline) { e.preventDefault(); commit(); }
    if (e.key === 'Escape') commit();
  };

  return (
    <div style={{
      padding: '16px 0',
      borderTop: '1px solid var(--border-subtle)',
    }}>
      <div className="section-header" style={{ marginBottom: 8 }}>{label}</div>

      {isEditing ? (
        multiline ? (
          <textarea
            ref={inputRef}
            className="field-input"
            value={value}
            placeholder={placeholder}
            rows={2}
            onChange={(e) => onChange(e.target.value)}
            onBlur={commit}
            onKeyDown={onKey}
            style={{ resize: 'none', lineHeight: 1.5, fontSize: 15 }}
          />
        ) : (
          <input
            ref={inputRef}
            className="field-input"
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            onBlur={commit}
            onKeyDown={onKey}
          />
        )
      ) : (
        <button
          onClick={() => setEditing(true)}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          style={{
            display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
            gap: 12, width: '100%', textAlign: 'left',
            padding: '4px 0',
            cursor: 'text',
          }}
        >
          <span style={{
            fontSize: 15.5, fontWeight: 500, lineHeight: 1.5,
            color: 'var(--text-primary)',
            borderBottom: '1px solid',
            borderColor: hover ? 'var(--accent-border)' : 'transparent',
            transition: 'border-color 160ms',
            textWrap: 'pretty',
          }}>{value}</span>
          <span style={{
            flexShrink: 0, marginTop: 2,
            color: hover ? 'var(--accent-glow)' : 'var(--text-tertiary)',
            opacity: hover ? 1 : 0,
            transform: hover ? 'translateY(0)' : 'translateY(-2px)',
            transition: 'all 160ms',
          }}>
            <IconEdit size={14} />
          </span>
        </button>
      )}
    </div>
  );
}

function OnboardingReview({ data, setData, onDone, inferring }) {
  const set = (k) => (v) => setData((d) => ({ ...d, [k]: v }));
  const canContinue = data.sells.trim().length > 0 && data.client.trim().length > 0;

  return (
    <OnboardingStage maxWidth={520} step={3} label="onboarding-review">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
        <div>
          <h1 style={{
            fontSize: 27, fontWeight: 600, letterSpacing: '-0.025em',
            margin: '0 0 9px', lineHeight: 1.25, textWrap: 'balance',
          }}>
            Tell us about your business.
          </h1>
          <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 14.5, lineHeight: 1.55 }}>
            {inferring
              ? "Taking a first guess based on your title and company — edit anything below."
              : "We'll generate a sample book of plausible contacts and drafts around this — nothing here is sent anywhere or connected to a real inbox."}
          </p>
        </div>

        {/* Card */}
        <div className="card" style={{ padding: '6px 22px 22px' }}>
          <ReviewField label="What you sell"     value={data.sells}  onChange={set('sells')}  placeholder={inferring ? 'Thinking…' : 'Programmatic ad inventory and sponsorship packages'} multiline editAll />
          <ReviewField label="Your ideal client" value={data.client} onChange={set('client')} placeholder={inferring ? 'Thinking…' : 'Brand and agency marketing leads at mid-market companies'} multiline editAll />
          <ReviewField label="Current focus"     value={data.focus} onChange={set('focus')}  placeholder={inferring ? 'Thinking…' : 'Reviving lapsed relationships from last year'} multiline editAll />
        </div>

        {/* Actions */}
        <button className="btn btn-primary btn-lg btn-block" onClick={onDone} disabled={!canContinue}>
          Generate my book
          <IconChevronRight size={16} />
        </button>
      </div>
    </OnboardingStage>
  );
}

// ─────────────────────────────────────────────────────────────
// STEP 4 — ENTRY CONFIRMATION
// ─────────────────────────────────────────────────────────────
function OnboardingReady({ onEnter }) {
  return (
    <OnboardingStage maxWidth={460} step={4} label="onboarding-ready">
      <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        textAlign: 'center', gap: 30,
      }}>
        <RevealRow delay={80}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'var(--accent)', color: '#0F0B02',
          }}>
            <IconCheck size={30} />
          </div>
        </RevealRow>

        <RevealRow delay={180}>
          <div style={{ maxWidth: 400 }}>
            <h1 style={{
              fontSize: 32, fontWeight: 600, letterSpacing: '-0.03em',
              margin: '0 0 14px', lineHeight: 1.2,
            }}>
              My Black Book is ready.
            </h1>
            <p style={{ color: 'var(--text-secondary)', margin: 0, fontSize: 15.5, lineHeight: 1.6 }}>
              Personalised to your relationships, your deals and your voice. Every briefing from here is built for you.
            </p>
          </div>
        </RevealRow>

        <RevealRow delay={300} style={{ width: '100%', maxWidth: 320 }}>
          <button className="btn btn-primary btn-lg btn-block" onClick={onEnter}>
            Enter My Black Book
            <IconChevronRight size={16} />
          </button>
        </RevealRow>
      </div>
    </OnboardingStage>
  );
}

Object.assign(window, {
  OnboardingStage, OnboardingScanning, OnboardingReview, OnboardingReady,
});
