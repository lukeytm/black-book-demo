// Black Book — icon library. Minimal, geometric strokes. 1.5 width.

const Icon = ({ children, size = 18, className = '', style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
    aria-hidden="true"
  >
    {children}
  </svg>
);

const IconBriefing = (p) => (
  <Icon {...p}>
    <path d="M4 6h16" />
    <path d="M4 12h10" />
    <path d="M4 18h14" />
  </Icon>
);

const IconContacts = (p) => (
  <Icon {...p}>
    <circle cx="9" cy="9" r="3.2" />
    <path d="M3 19c1-3 3.4-4.5 6-4.5s5 1.5 6 4.5" />
    <path d="M16 7.5a3 3 0 0 1 0 5.5" />
    <path d="M21 18.5c-.5-1.8-1.8-2.8-3.6-3.3" />
  </Icon>
);

const IconSignals = (p) => (
  <Icon {...p}>
    <path d="M4 14a8 8 0 0 1 8-8" />
    <path d="M7 14a5 5 0 0 1 5-5" />
    <circle cx="12" cy="14" r="1.6" fill="currentColor" stroke="none" />
    <path d="M12 14v6" />
  </Icon>
);

const IconSettings = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="2.8" />
    <path d="M19.4 13.6a1.6 1.6 0 0 0 .3 1.7l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.7-.3 1.6 1.6 0 0 0-1 1.5V19a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.7.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.7 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.7l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.7.3h0a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.7-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.7v0a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" />
  </Icon>
);

const IconChevronLeft = (p) => (
  <Icon {...p}><path d="M15 18l-6-6 6-6" /></Icon>
);
const IconChevronRight = (p) => (
  <Icon {...p}><path d="M9 6l6 6-6 6" /></Icon>
);
const IconChevronDown = (p) => (
  <Icon {...p}><path d="M6 9l6 6 6-6" /></Icon>
);

const IconCheck = (p) => (
  <Icon {...p}><path d="M4 12l5 5L20 6" /></Icon>
);

const IconSun = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3v2M12 19v2M3 12h2M19 12h2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M5.6 18.4L7 17M17 7l1.4-1.4" />
  </Icon>
);

const IconMoon = (p) => (
  <Icon {...p}>
    <path d="M20 14.2A8.2 8.2 0 1 1 9.8 4a6.6 6.6 0 0 0 10.2 10.2z" fill="currentColor" stroke="none" />
  </Icon>
);

const IconFlame = (p) => (
  <Icon {...p}>
    <path d="M12 3c1.5 2.5 4 4.2 4 7.5 0 2-1.5 4-4 4s-4-2-4-4c0-1.2.5-2 1.2-2.7C9 9.5 9 11 10 11.5c-.4-2.2 1-3.5 2-5.5z" />
    <path d="M7 14c0 3.4 2.5 6 5 6s5-2.6 5-6c0-1.5-.6-2.6-1.4-3.5" />
  </Icon>
);

const IconCalendar = (p) => (
  <Icon {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="2" />
    <path d="M3.5 9.5h17" />
    <path d="M8 3v4M16 3v4" />
  </Icon>
);

const IconRefresh = (p) => (
  <Icon {...p}>
    <path d="M3 12a9 9 0 0 1 15.5-6.2L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" />
    <path d="M3 21v-5h5" />
  </Icon>
);

const IconSend = (p) => (
  <Icon {...p}>
    <path d="M21 3 10.5 13.5" />
    <path d="M21 3l-7 18-3.5-7.5L3 10l18-7z" />
  </Icon>
);

const IconCopy = (p) => (
  <Icon {...p}>
    <rect x="8" y="8" width="12" height="12" rx="2" />
    <path d="M16 8V5a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h3" />
  </Icon>
);

const IconEdit = (p) => (
  <Icon {...p}>
    <path d="M14 4l6 6L9 21H3v-6z" />
  </Icon>
);

const IconSparkle = (p) => (
  <Icon {...p}>
    <path d="M12 3v6M12 15v6M3 12h6M15 12h6" />
    <path d="M5.5 5.5l3 3M15.5 15.5l3 3M5.5 18.5l3-3M15.5 8.5l3-3" />
  </Icon>
);

const IconBulb = (p) => (
  <Icon {...p}>
    <path d="M9 18h6" />
    <path d="M10 21h4" />
    <path d="M12 3a6 6 0 0 0-4 10.5c1 .8 1.5 1.5 1.5 2.5h5c0-1 .5-1.7 1.5-2.5A6 6 0 0 0 12 3z" />
  </Icon>
);

const IconClock = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Icon>
);

const IconMail = (p) => (
  <Icon {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="M3 7l9 6 9-6" />
  </Icon>
);

const IconArrowUpRight = (p) => (
  <Icon {...p}>
    <path d="M7 17L17 7" />
    <path d="M8 7h9v9" />
  </Icon>
);

const IconPlus = (p) => (
  <Icon {...p}><path d="M12 5v14M5 12h14" /></Icon>
);

const IconX = (p) => (
  <Icon {...p}><path d="M6 6l12 12M18 6L6 18" /></Icon>
);

const IconSnooze = (p) => (
  <Icon {...p}>
    <path d="M4 5h6L4 12h6" />
    <path d="M14 8h6l-6 7h6" />
  </Icon>
);

const IconBook = (p) => (
  <Icon {...p}>
    <path d="M5 4.5h11a4 4 0 0 1 4 4v11H9a4 4 0 0 1-4-4V4.5z" />
    <path d="M5 15.5a4 4 0 0 1 4-4h11" />
    <path d="M9 8.5h7" />
  </Icon>
);

// My Black Book mark — a bound ledger: charcoal cover, brass spine with
// raised bands, single italic serif monogram.
const BBMark = ({ size = 28, glow = false }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    aria-hidden="true"
    style={{ filter: glow ? 'drop-shadow(0 0 8px rgba(201,168,76,0.28))' : 'none' }}
  >
    {/* book cover */}
    <rect x="4" y="2.5" width="24" height="27" rx="2.5" fill="#17140F" stroke="rgba(201,168,76,0.35)" strokeWidth="1" />
    {/* gold spine */}
    <rect x="4" y="2.5" width="3.4" height="27" rx="1.2" fill="#C9A84C" />
    {/* raised spine bands */}
    <rect x="4" y="7.5" width="3.4" height="1.3" fill="#8A6F2A" opacity="0.6" />
    <rect x="4" y="12" width="3.4" height="1.3" fill="#8A6F2A" opacity="0.6" />
    {/* monogram */}
    <text
      x="19.6"
      y="21.5"
      textAnchor="middle"
      fontFamily="'Spectral', Georgia, serif"
      fontWeight="600"
      fontStyle="italic"
      fontSize="13.5"
      fill="#DCBE6E"
    >B</text>
  </svg>
);

Object.assign(window, {
  Icon, IconBriefing, IconContacts, IconSignals, IconSettings,
  IconChevronLeft, IconChevronRight, IconChevronDown, IconCheck,
  IconSun, IconMoon, IconFlame, IconCalendar, IconRefresh, IconCopy, IconSend, IconEdit,
  IconSparkle, IconBulb, IconClock, IconMail, IconArrowUpRight,
  IconPlus, IconX, IconSnooze, IconBook, BBMark,
  // back-compat alias
  EmberMark: BBMark,
});
