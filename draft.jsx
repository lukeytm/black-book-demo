// Black Book — Draft message screen

function dateFromDaysAgo(days) {
  const d = new Date(2026, 5, 5); // today: 5 Jun 2026
  d.setDate(d.getDate() - (days || 0));
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function DraftScreen({ contact, onBack, profile, onSendComplete, onCopied }) {
  const isMobile = useIsMobile();
  const tone = profile.tone || 'Direct';
  const [draft, setDraft] = React.useState(contact.draft);
  const [copied, setCopied] = React.useState(false);
  const [regenerating, setRegenerating] = React.useState(false);
  const [snoozeOpen, setSnoozeOpen] = React.useState(false);

  // Send state — reply to a recent thread, or compose a new message
  const threadExists = (contact.days || 0) <= 90 && !!contact.threadSubject;
  const [mode, setMode] = React.useState(threadExists ? 'reply' : 'new');
  const [subject, setSubject] = React.useState(
    contact.newSubject || (contact.threadSubject ? `Re: ${contact.threadSubject}` : '')
  );
  const [sent, setSent] = React.useState(false); // false | 'sending' | 'sent'
  const threadDate = dateFromDaysAgo(contact.days);

  const hasSignal = !!contact.signal;
  const hasCrossClient = contact.id === 'rachel' || contact.id === 'priya';

  const handleCopy = () => {
    navigator.clipboard?.writeText(draft).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleRegenerate = () => {
    setRegenerating(true);
    setTimeout(() => setRegenerating(false), 900);
  };

  const handleAddInsight = () => {
    const addition = contact.id === 'rachel'
      ? "\n\nA few of our retail media measurement conversations this month have surfaced similar questions — happy to share what's landing well."
      : "\n\nWe've been hearing similar themes from a few other retail brands this month — would gladly trade notes.";
    setDraft((d) => d + addition);
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className="scroll-area" style={{ flex: 1, minHeight: 0, overflowY: 'auto' }}>
        <div style={{ maxWidth: 820, margin: '0 auto', padding: 'var(--screen-pad-v) var(--screen-pad-h) 28px' }}>
        {/* Back row */}
        <button
          onClick={onBack}
          className="fade-up"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            color: 'var(--text-secondary)', fontSize: 13, padding: '6px 10px 6px 6px',
            marginLeft: -10, marginBottom: 18, borderRadius: 6,
            transition: 'color 140ms, background 140ms',
          }}
          onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-hover)'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'transparent'; }}
        >
          <IconChevronLeft size={15} />
          Back to briefing
        </button>

        {/* Header */}
        <div className="fade-up" style={{ marginBottom: 24, display: 'flex', alignItems: 'flex-start', gap: 16 }}>
          <Avatar initials={contact.initials} heat={contact.heat} size={54} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.025em', margin: '0 0 4px', lineHeight: 1.25 }}>
              {contact.name} <span style={{ color: 'var(--text-tertiary)', fontWeight: 500 }}>·</span> <span style={{ color: 'var(--text-secondary)', fontWeight: 500 }}>{contact.company}</span>
            </h1>
            <div style={{ color: 'var(--text-tertiary)', fontSize: 13.5 }}>
              {contact.role}
            </div>
          </div>
        </div>

        {/* Context strip */}
        <div className="fade-up" style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 18 }}>
          <ContextPill icon={<IconClock size={12} />}>
            Last contact: <span style={{ color: 'var(--text-primary)' }}>{contact.daysLabel || `${contact.days} days ago`}</span>
          </ContextPill>
          <ContextPill icon={<IconMail size={12} />}>
            Last topic: <span style={{ color: 'var(--text-primary)' }}>{contact.lastTopic}</span>
          </ContextPill>
          <ContextPill icon={<IconEdit size={12} />}>
            Tone: <span style={{ color: 'var(--text-primary)' }}>{tone}</span>
          </ContextPill>
        </div>

        {/* Signal card */}
        {hasSignal && (
          <div className="fade-up" style={{
            display: 'flex', gap: 14, alignItems: 'flex-start',
            padding: '14px 16px',
            background: 'var(--accent-faint)',
            borderRadius: 10,
            borderLeft: '2px solid var(--accent)',
            marginBottom: 18,
          }}>
            <span aria-hidden="true" style={{ color: 'var(--accent)', fontSize: 11, lineHeight: 1.2, marginTop: 5, flexShrink: 0 }}>◆</span>
            <div style={{ fontSize: 13.5, lineHeight: 1.55, color: 'var(--text-secondary)' }}>
              <span style={{ color: 'var(--accent-glow)', fontWeight: 600 }}>Signal detected:</span>{' '}
              {contact.name.split(' ')[0]} {contact.signal.text.toLowerCase()}{contact.id === 'rachel' ? ' at Boots' : ''}. This has been woven into your draft.
            </div>
          </div>
        )}

        {/* Subject line — shown when composing a new message */}
        {mode === 'new' && (
          <div className="fade-up field" style={{ marginBottom: 16 }}>
            <label className="field-label" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              Subject
              <span style={{
                display: 'inline-flex', alignItems: 'center', gap: 4,
                color: 'var(--accent-glow)', fontWeight: 500, letterSpacing: 0,
              }}>
                <IconSparkle size={10} /> suggested
              </span>
            </label>
            <input
              className="field-input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Subject line"
            />
          </div>
        )}

        {/* Draft card */}
        <div className="fade-up card" style={{
          padding: '22px 24px 18px',
          marginBottom: 18,
          position: 'relative',
        }}>
          <div style={{
            position: 'absolute', top: 18, left: 24,
            fontSize: 11, color: 'var(--text-tertiary)',
            display: 'flex', alignItems: 'center', gap: 6,
            whiteSpace: 'nowrap',
            maxWidth: 'calc(100% - 70px)',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}>
            <IconSparkle size={11} style={{ flexShrink: 0, color: 'var(--accent)' }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>
              Written to sound like you — because it needs to.
            </span>
          </div>
          <button
            onClick={handleCopy}
            title={copied ? 'Copied' : 'Copy to clipboard'}
            aria-label="Copy message to clipboard"
            style={{
              position: 'absolute', top: 12, right: 14,
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 8px',
              borderRadius: 6,
              color: copied ? 'var(--accent-glow)' : 'var(--text-tertiary)',
              background: 'transparent',
              fontSize: 11.5, fontWeight: 500,
              transition: 'color 140ms, background 140ms',
            }}
            onMouseEnter={(e) => { if (!copied) { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-hover)'; } }}
            onMouseLeave={(e) => { if (!copied) { e.currentTarget.style.color = 'var(--text-tertiary)'; e.currentTarget.style.background = 'transparent'; } }}
          >
            {copied ? <><IconCheck size={13} /> Copied</> : <IconCopy size={13} />}
          </button>

          {regenerating ? (
            <div style={{
              minHeight: 240,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexDirection: 'column', gap: 12,
              color: 'var(--text-secondary)',
            }}>
              <BBMark size={36} glow />
              <div style={{ fontSize: 13 }}>Rewriting in a <span style={{ color: 'var(--accent-glow)' }}>{tone.toLowerCase()}</span> tone…</div>
            </div>
          ) : (
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              style={{
                width: '100%',
                minHeight: 200,
                marginTop: 22,
                background: 'transparent',
                border: 'none',
                outline: 'none',
                resize: 'vertical',
                fontFamily: 'inherit',
                fontSize: 15,
                lineHeight: 1.65,
                color: 'var(--text-primary)',
              }}
            />
          )}

          <div style={{
            marginTop: 8,
            paddingTop: 12,
            borderTop: '1px solid var(--border-subtle)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            fontSize: 12, color: 'var(--text-tertiary)',
          }}>
            <span>{draft.length} characters · ~{Math.ceil(draft.split(/\s+/).length / 200 * 60)}s read</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              <span className="dot" style={{ background: 'var(--heat-warm)' }} />
              Draft only — not sent
            </span>
          </div>
        </div>

        {/* Cross-client insight */}
        {hasCrossClient && (
          <div className="fade-up" style={{
            display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? 12 : 12, alignItems: isMobile ? 'stretch' : 'flex-start',
            padding: '14px 16px 14px 14px',
            background: 'var(--accent-faint)',
            border: '1px solid var(--accent-border)',
            borderRadius: 10,
            marginBottom: 24,
          }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
              <div style={{
                width: 28, height: 28, borderRadius: 6,
                background: 'var(--accent-subtle)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: 'var(--accent-glow)', flexShrink: 0,
              }}>
                <IconBulb size={15} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-glow)', letterSpacing: 0.02, marginBottom: 3, textTransform: 'uppercase' }}>
                  Cross-client insight
                </div>
                <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                  You've discussed <span style={{ color: 'var(--text-primary)' }}>retail media measurement</span> with 3 other clients this month. This topic may resonate with {contact.name.split(' ')[0]} given {contact.id === 'rachel' ? 'her new role' : 'the Sainsbury\'s announcement'}.
                </div>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={handleAddInsight} style={{ flexShrink: 0, alignSelf: isMobile ? 'stretch' : 'auto' }}>
              <IconPlus size={12} />
              Add to message
            </button>
          </div>
        )}

        {/* Snooze link */}
        <div style={{ marginTop: 8, textAlign: 'center' }}>
          {!snoozeOpen ? (
            <button onClick={() => setSnoozeOpen(true)} style={{ color: 'var(--text-tertiary)', fontSize: 13 }}>
              Not relevant — snooze this contact
            </button>
          ) : (
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '6px 8px', background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)', borderRadius: 999,
            }}>
              <span style={{ fontSize: 12, color: 'var(--text-tertiary)', marginLeft: 6 }}>Snooze for</span>
              {['1 week', '1 month', 'Remove'].map((opt) => (
                <button key={opt} onClick={() => { setSnoozeOpen(false); onBack(); }}
                  style={{
                    padding: '5px 10px', fontSize: 12, fontWeight: 500,
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
        {isMobile && (
          <SendBar
            mode={mode}
            setMode={setMode}
            threadExists={threadExists}
            threadSubject={contact.threadSubject}
            threadDate={threadDate}
            subject={subject}
            draft={draft}
            sent={sent}
            setSent={setSent}
            onSendComplete={onSendComplete}
            onCopied={onCopied}
          />
        )}
      </div>

      {!isMobile && (
        <SendBar
          mode={mode}
          setMode={setMode}
          threadExists={threadExists}
          threadSubject={contact.threadSubject}
          threadDate={threadDate}
          subject={subject}
          draft={draft}
          sent={sent}
          setSent={setSent}
          onSendComplete={onSendComplete}
          onCopied={onCopied}
        />
      )}
    </div>
  );
}

function ContextPill({ icon, children }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 7,
      padding: '6px 12px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 999,
      fontSize: 12.5,
      color: 'var(--text-secondary)',
      whiteSpace: 'nowrap',
    }}>
      <span style={{ color: 'var(--text-tertiary)', display: 'inline-flex' }}>{icon}</span>
      {children}
    </div>
  );
}

function TextLink({ onClick, children }) {
  const [hover, setHover] = React.useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{
        fontSize: 12.5, fontWeight: 500,
        color: hover ? 'var(--text-primary)' : 'var(--text-tertiary)',
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '2px 0', transition: 'color 140ms', whiteSpace: 'nowrap',
      }}
    >
      {children}
    </button>
  );
}

function SendBar({ mode, setMode, threadExists, threadSubject, threadDate, subject, draft, sent, setSent, onSendComplete, onCopied }) {
  const isMobile = useIsMobile();
  const [copied, setCopied] = React.useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(draft).catch(() => {});
    setCopied(true);
    // After showing 'Copied', auto-return to briefing with confirm prompt
    setTimeout(() => { if (onCopied) onCopied(); }, 1200);
  };

  const send = () => {
    if (sent) return;
    setSent('sending');
    setTimeout(() => setSent('sent'), 700);
    setTimeout(() => onSendComplete && onSendComplete(), 1500);
  };

  const openGmail = () => {
    const su = encodeURIComponent(subject || '');
    const body = encodeURIComponent(draft || '');
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&su=${su}&body=${body}`, '_blank', 'noopener');
  };

  const primaryLabel = mode === 'reply' ? 'Send reply' : 'Send now';

  return (
    <div style={isMobile ? {
      borderTop: '1px solid var(--border-subtle)',
    } : {
      flexShrink: 0,
      borderTop: '1px solid var(--border-subtle)',
      background: 'color-mix(in oklab, var(--bg-primary) 88%, transparent)',
      backdropFilter: 'blur(18px)',
      WebkitBackdropFilter: 'blur(18px)',
    }}>
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '14px var(--screen-pad-h) 16px' }}>
        {/* Thread context — confirmatory, muted */}
        {mode === 'reply' && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12,
            fontSize: 12.5, color: 'var(--text-tertiary)', minWidth: 0,
          }}>
            <IconMail size={12} style={{ flexShrink: 0 }} />
            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              Replying to:{' '}
              <span style={{ color: 'var(--text-secondary)' }}>Re: {threadSubject}</span>
              {' · '}{threadDate}
            </span>
          </div>
        )}

        {/* Primary + copy + (gmail) */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'stretch', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary btn-lg"
            onClick={send}
            disabled={!!sent}
            style={{ flex: 1, minWidth: isMobile ? 0 : 200, ...(sent ? { pointerEvents: 'none', opacity: 0.95 } : {}) }}
          >
            {sent === 'sent'
              ? <><IconCheck size={16} /> Sent</>
              : sent === 'sending'
                ? 'Sending…'
                : <><IconSend size={15} /> {primaryLabel}</>}
          </button>

          <button
            className="btn btn-ghost btn-lg"
            onClick={copy}
            style={{
              flex: isMobile ? 1 : undefined,
              minWidth: isMobile ? 0 : 150,
              color: copied ? 'var(--accent-glow)' : undefined,
              borderColor: copied ? 'var(--accent-border)' : undefined,
            }}
          >
            {copied ? <><IconCheck size={15} /> Copied</> : <><IconCopy size={14} /> Copy message</>}
          </button>

          {mode === 'new' && (
            <button className="btn btn-ghost btn-lg" onClick={openGmail} title="Compose in Gmail instead" style={isMobile ? { flex: 1, minWidth: 0 } : undefined}>
              <IconArrowUpRight size={14} /> {isMobile ? 'Gmail' : 'Open in Gmail'}
            </button>
          )}
        </div>

        {/* Switch send mode */}
        {(mode === 'reply' || threadExists) && (
          <div style={{ marginTop: 12 }}>
            {mode === 'reply' ? (
              <TextLink onClick={() => setMode('new')}>Send as new message instead</TextLink>
            ) : (
              <TextLink onClick={() => setMode('reply')}>
                <IconChevronLeft size={12} /> Reply to existing thread instead
              </TextLink>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

window.DraftScreen = DraftScreen;
