// Black Book — main app shell + router

const DEFAULT_PROFILE = { firstName: 'Luke', title: 'Sales Director', company: 'Harrison Media', tone: 'Direct' };

function App() {
  // Persistent tweak defaults — see EDITMODE markers at end of index.html script
  const TWEAK_DEFAULTS = window.__BB_TWEAKS__ || window.__EMBER_TWEAKS__ || {};

  const tweaks = useTweaks(TWEAK_DEFAULTS);
  const [route, setRoute] = React.useState(tweaks.startScreen || 'briefing');
  const [contactRouteId, setContactRouteId] = React.useState(null);
  const [profile, setProfile] = React.useState(DEFAULT_PROFILE);
  const [cadence, setCadence] = React.useState('daily');
  const [contacts, setContacts] = React.useState(SAMPLE_CONTACTS);
  const [businessInfo, setBusinessInfo] = React.useState({ sells: '', client: '', focus: '' });
  const [generationStatus, setGenerationStatus] = React.useState('idle'); // idle | loading | ready | error
  const [inferringBusiness, setInferringBusiness] = React.useState(false);
  const isMobile = useIsMobile();
  const [mobileNavOpen, setMobileNavOpen] = React.useState(false);

  const inferBusinessInfo = () => {
    setInferringBusiness(true);
    fetch('/api/infer-business', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: profile.title, company: profile.company }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Inference request failed');
        return res.json();
      })
      .then((data) => {
        setBusinessInfo((prev) => ({
          sells: prev.sells || data.sells || '',
          client: prev.client || data.client || '',
          focus: prev.focus || data.focus || '',
        }));
      })
      .catch(() => {}) // silent — fields just stay empty, user can type their own
      .finally(() => setInferringBusiness(false));
  };

  const runGeneration = () => {
    setGenerationStatus('loading');
    fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        firstName: profile.firstName,
        title: profile.title,
        company: profile.company,
        tone: profile.tone,
        sells: businessInfo.sells,
        idealClient: businessInfo.client,
        focus: businessInfo.focus,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Generation request failed');
        return res.json();
      })
      .then((data) => {
        window.__BB_GENERATED__ = data;
        setGenerationStatus('ready');
      })
      .catch(() => setGenerationStatus('error'));
  };

  const applyGeneratedData = () => {
    const data = window.__BB_GENERATED__;
    if (data && Array.isArray(data.contacts)) {
      const withHistory = data.contacts.map((c) => ({ ...c, history: c.history || [] }));
      window.SAMPLE_CONTACTS.length = 0;
      window.SAMPLE_CONTACTS.push(...withHistory);
      window.SIGNALS_FEED.length = 0;
      window.SIGNALS_FEED.push(...(data.signals || []));
      window.CROSS_CLIENT_INSIGHTS.length = 0;
      window.CROSS_CLIENT_INSIGHTS.push(...(data.insights || []));
      setContacts(window.SAMPLE_CONTACTS.slice());
    }
  };
  const [pendingComplete, setPendingComplete] = React.useState(null); // contactId animating out on return from draft
  const [pendingConfirm, setPendingConfirm] = React.useState(null);  // contactId showing 'did you send it?'
  const [theme, setThemeState] = React.useState(() => {
    try { return localStorage.getItem('bb-theme') || 'dark'; } catch (e) { return 'dark'; }
  });
  const setTheme = (t) => {
    setThemeState(t);
    try { localStorage.setItem('bb-theme', t); } catch (e) {}
    document.documentElement.setAttribute('data-theme', t);
    var tokens = (window.__BB_THEME_TOKENS__ && window.__BB_THEME_TOKENS__[t]) || {};
    for (var k in tokens) document.documentElement.style.setProperty(k, tokens[k]);
  };

  // Keep in sync with the pre-hydration script's inline var application —
  // covers the case where React mounts with a theme that differs from
  // whatever was last painted (shouldn't normally happen, but cheap insurance).
  React.useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    var tokens = (window.__BB_THEME_TOKENS__ && window.__BB_THEME_TOKENS__[theme]) || {};
    for (var k in tokens) document.documentElement.style.setProperty(k, tokens[k]);
  }, []);

  // Keep route in sync when tweak changes start screen
  React.useEffect(() => {
    if (tweaks.startScreen && tweaks.startScreen !== route) {
      setRoute(tweaks.startScreen);
      setContactRouteId(null);
    }
    // eslint-disable-next-line
  }, [tweaks.startScreen]);

  // Empty state demo
  React.useEffect(() => {
    if (tweaks.emptyState) {
      setContacts([]);
    } else {
      setContacts(SAMPLE_CONTACTS);
    }
  }, [tweaks.emptyState]);

  const nav = (to) => {
    setRoute(to);
    setContactRouteId(null);
  };

  const goToDraft = (contactId) => {
    setContactRouteId(contactId);
    setRoute('draft');
  };
  const goToContact = (contactId) => {
    setContactRouteId(contactId);
    setRoute('contact');
  };
  const handleSnooze = (id) => {
    setContacts((c) => c.map((x) => x.id === id ? { ...x, snoozed: true } : x));
  };

  // Complete a contact — clock resets, card exits
  const handleComplete = (id) => {
    setContacts((c) => c.map((x) => x.id === id ? { ...x, snoozed: true, days: 0 } : x));
    setPendingConfirm(null);
    setPendingComplete(null);
  };

  // Fired when user clicks Send on draft — navigate back with animation pending
  const handleSendComplete = (id) => {
    setPendingComplete(id);
    setRoute('briefing');
    setContactRouteId(null);
    setTimeout(() => handleComplete(id), 430);
  };

  // Fired when user copies on draft — return to briefing showing confirm card
  const handleCopied = (id) => {
    setPendingConfirm(id);
    setRoute('briefing');
    setContactRouteId(null);
  };

  // Fallback to first contact if navigating directly to draft/contact via demo bar
  const activeContact =
    contacts.find((c) => c.id === contactRouteId) ||
    SAMPLE_CONTACTS.find((c) => c.id === contactRouteId) ||
    SAMPLE_CONTACTS[0];

  // Onboarding routes have no sidebar
  if (route.startsWith('onboarding-')) {
    return (
      <div style={{ height: '100%', width: '100%' }} data-screen-label={`${route}`}>
        {route === 'onboarding-welcome' && (
          <OnboardingWelcome onNext={() => {
            setProfile({ firstName: '', title: '', company: '', tone: 'Direct' });
            setRoute('onboarding-details');
          }} />
        )}
        {route === 'onboarding-details' && (
          <OnboardingDetails
            profile={profile}
            setProfile={setProfile}
            onNext={() => { inferBusinessInfo(); setRoute('onboarding-review'); }}
          />
        )}
        {route === 'onboarding-review' && (
          <OnboardingReview
            data={businessInfo}
            setData={setBusinessInfo}
            inferring={inferringBusiness}
            onDone={() => { runGeneration(); setRoute('onboarding-scanning'); }}
          />
        )}
        {route === 'onboarding-scanning' && (
          <OnboardingScanning
            ready={generationStatus === 'ready'}
            error={generationStatus === 'error'}
            onDone={() => { applyGeneratedData(); setRoute('onboarding-ready'); }}
            onRetry={runGeneration}
            onUseFallback={() => { setGenerationStatus('ready'); setRoute('onboarding-ready'); }}
          />
        )}
        {route === 'onboarding-ready' && (
          <OnboardingReady onEnter={() => setRoute('briefing')} />
        )}
        <BottomBar route={route} setRoute={setRoute} />
        <BlackBookTweaksPanel tweaks={tweaks} />
      </div>
    );
  }

  // Determine which sidebar item is active
  const sidebarActive =
    route === 'draft' || route === 'contact' ? 'briefing' :
    route === 'contacts' ? 'contacts' :
    route === 'signals' ? 'signals' :
    route === 'settings' ? 'settings' :
    route === 'add-contact' ? 'add-contact' :
    'briefing';

  const visibleCount = contacts.filter((c) => !c.snoozed).length;

  return (
    <div style={{ display: 'flex', height: '100%', width: '100%', background: 'var(--bg-primary)' }} data-screen-label={`app-${route}`}>
      <Sidebar
        active={sidebarActive}
        onNavigate={(to) => nav(to)}
        briefingMeta={visibleCount > 0 && sidebarActive === 'briefing' && route === 'briefing' ? String(visibleCount) : null}
        theme={theme}
        setTheme={setTheme}
        mobile={isMobile}
        open={!isMobile || mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
      />
      {isMobile && mobileNavOpen && (
        <div className="mobile-nav-backdrop" onClick={() => setMobileNavOpen(false)} />
      )}
      <main style={{
        flex: 1, minWidth: 0, height: '100%',
        background: 'var(--bg-primary)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        {isMobile && (
          <div className="mobile-topbar">
            <button onClick={() => setMobileNavOpen(true)} aria-label="Open menu">
              <div style={{ width: 15, height: 11, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <span style={{ display: 'block', height: 1.5, background: 'currentColor', borderRadius: 1 }} />
                <span style={{ display: 'block', height: 1.5, background: 'currentColor', borderRadius: 1 }} />
                <span style={{ display: 'block', height: 1.5, background: 'currentColor', borderRadius: 1 }} />
              </div>
            </button>
            <div className="wordmark" style={{ fontSize: 16, fontWeight: 600, color: 'var(--text-primary)' }}>My Black Book</div>
          </div>
        )}
        {/* Background flourish */}
        <div aria-hidden style={{
          position: 'absolute', inset: 0,
          background: 'radial-gradient(60% 40% at 50% -10%, rgba(201,168,76,0.05), transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative', height: '100%', flex: 1, minHeight: 0 }}>
          {route === 'briefing' && (
            <BriefingScreen
              contacts={contacts}
              onDraft={goToDraft}
              onSnooze={handleSnooze}
              onComplete={handleComplete}
              onOpenContact={goToContact}
              pendingComplete={pendingComplete}
              pendingConfirm={pendingConfirm}
              profile={profile}
              tweaks={tweaks}
            />
          )}
          {route === 'contacts' && (
            <ContactsScreen contacts={contacts} onOpen={goToContact} onDraft={goToDraft} />
          )}
          {route === 'signals' && (
            <SignalsScreen onDraft={goToDraft} onOpenContact={goToContact} />
          )}
          {route === 'settings' && (
            <SettingsScreen profile={profile} setProfile={setProfile} cadence={cadence} setCadence={setCadence} />
          )}
          {route === 'add-contact' && (
            <AddContactScreen
              onBack={() => setRoute('briefing')}
              onAdded={(c) => {
                setContacts((arr) => [c, ...arr]);
                setRoute('briefing');
              }}
            />
          )}
          {route === 'draft' && activeContact && (
            <DraftScreen
              contact={activeContact}
              onBack={() => nav('briefing')}
              onSendComplete={() => handleSendComplete(activeContact.id)}
              onCopied={() => handleCopied(activeContact.id)}
              profile={profile}
            />
          )}
          {route === 'contact' && activeContact && (
            <ContactDetailScreen contact={activeContact} onBack={() => setRoute('briefing')} onDraft={() => goToDraft(activeContact.id)} />
          )}
        </div>
      </main>
      <BottomBar route={route} setRoute={setRoute} />
      <BlackBookTweaksPanel tweaks={tweaks} />
    </div>
  );
}

// Floating bottom bar — quick jump to any screen for demo navigation
function BottomBar({ route, setRoute }) {
  const [open, setOpen] = React.useState(true);
  const screens = [
    { id: 'onboarding-welcome', label: '1 · Connect' },
    { id: 'onboarding-scanning', label: '2 · Scanning' },
    { id: 'onboarding-review', label: '3 · Review' },
    { id: 'onboarding-ready', label: '4 · Ready' },
    { id: 'briefing', label: '5 · Briefing' },
    { id: 'draft', label: '6 · Draft' },
    { id: 'signals', label: '7 · Signals' },
    { id: 'contact', label: '8 · Contact' },
    { id: 'settings', label: '9 · Settings' },
    { id: 'add-contact', label: '+ Met someone' },
  ];

  // Expose for testing/automation
  React.useEffect(() => {
    window.bbNav = (id) => setRoute(id);
    window.emberNav = window.bbNav;
  }, [setRoute]);

  return (
    <div style={{
      position: 'fixed', bottom: 14, left: 14,
      zIndex: 90,
      display: 'flex', alignItems: 'center', gap: 4, padding: 4,
      background: 'rgba(17,24,39,0.88)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid var(--border-subtle)',
      borderRadius: 999,
      boxShadow: '0 10px 36px rgba(0,0,0,0.5)',
      maxWidth: 'calc(100% - 28px)',
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(!open)}
        title="Demo: jump to screen"
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 11px 6px 9px', borderRadius: 999,
          fontSize: 11, fontWeight: 600, color: 'var(--accent-glow)',
          letterSpacing: '0.04em', textTransform: 'uppercase',
        }}>
        <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent)', boxShadow: '0 0 8px var(--accent)' }} />
        Demo
        <IconChevronDown size={11} style={{ transform: open ? 'rotate(0)' : 'rotate(-90deg)', transition: 'transform 200ms' }} />
      </button>
      {open && (
        <div style={{ display: 'flex', gap: 2, padding: '0 2px', maxWidth: '70vw', overflowX: 'auto' }}>
          {screens.map((s) => {
            const active = s.id === route;
            return (
              <button key={s.id} onClick={() => setRoute(s.id)}
                style={{
                  padding: '5px 10px', borderRadius: 999,
                  fontSize: 11, fontWeight: 500,
                  whiteSpace: 'nowrap',
                  background: active ? 'var(--accent-subtle)' : 'transparent',
                  color: active ? 'var(--accent-glow)' : 'var(--text-secondary)',
                }}>{s.label}</button>
            );
          })}
        </div>
      )}
    </div>
  );
}


// Tweaks panel
function BlackBookTweaksPanel({ tweaks }) {
  return (
    <TweaksPanel title="Tweaks">
      <TweakSection title="Demo navigation">
        <TweakSelect
          label="Open screen"
          value={tweaks.startScreen}
          onChange={(v) => tweaks.setTweak('startScreen', v)}
          options={[
            { value: 'onboarding-welcome', label: '1. Connect Gmail' },
            { value: 'onboarding-scanning', label: '2. Scanning' },
            { value: 'onboarding-review', label: '3. Profile review' },
            { value: 'onboarding-ready', label: '4. Ready' },
            { value: 'briefing', label: '5. Briefing (hero)' },
            { value: 'draft', label: '6. Draft message' },
            { value: 'signals', label: '7. Signals' },
            { value: 'contact', label: '8. Contact detail' },
            { value: 'settings', label: '9. Settings' },
            { value: 'add-contact', label: '+ I just met someone' },
            { value: 'contacts', label: '+ Contacts list' },
          ]}
        />
      </TweakSection>

      <TweakSection title="Briefing">
        <TweakToggle
          label="Empty state"
          hint="You're all caught up"
          value={!!tweaks.emptyState}
          onChange={(v) => tweaks.setTweak('emptyState', v)}
        />
        <TweakRadio
          label="Card density"
          value={tweaks.density}
          onChange={(v) => tweaks.setTweak('density', v)}
          options={[
            { value: 'comfortable', label: 'Comfortable' },
            { value: 'compact', label: 'Compact' },
          ]}
        />
      </TweakSection>
    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
