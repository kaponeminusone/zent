export function IconHome({ active = false, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7}>
      <path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" strokeLinejoin="round" />
    </svg>
  );
}

export function IconChat({ active = false, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.1 : 1.7}>
      <path d="M21 12a8 8 0 0 1-8 8H8l-5 3V12a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8z" strokeLinejoin="round" />
    </svg>
  );
}

export function IconZentAI({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}>
      <rect x="4" y="6" width="16" height="13" rx="4" />
      <path d="M9 3v3M15 3v3M8.5 12h.01M15.5 12h.01M9 16c1.8 1 4.2 1 6 0" strokeLinecap="round" />
    </svg>
  );
}

export function IconUser({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.9}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M5 20c0-3.4 3.1-6 7-6s7 2.6 7 6" strokeLinecap="round" />
    </svg>
  );
}

export function IconBell({ active = false, size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.1 : 1.7}>
      <path d="M18 16H6l1.5-1.5V10a5.5 5.5 0 0 1 11 0v4.5zM10 19a2 2 0 0 0 4 0" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconSearch({ size = 14 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-5.5-5.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconBack({ size = 13 }) {
  return (
    <svg width={size} height={21} viewBox="0 0 12 21" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M10 2 2 10.5 10 19" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconPin({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M12 21s7-4.6 7-11a7 7 0 1 0-14 0c0 6.4 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

export function IconExternal({ size = 12 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M14 4h6v6M10 14 20 4M20 14v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconRefresh({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <path d="M20 6v5h-5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 18v-5h5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18.8 11A7 7 0 0 0 6.3 6.8L4 9M5.2 13a7 7 0 0 0 12.5 4.2L20 15" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconGrid({ active = false, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.1 : 1.6}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

export function IconGraduation({ active = false, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.1 : 1.6}>
      <path d="M12 3 2 8l10 5 10-5z" strokeLinejoin="round" />
      <path d="M6 11v4c0 2.2 2.7 4 6 4s6-1.8 6-4v-4" strokeLinecap="round" />
    </svg>
  );
}

export function IconMegaphone({ active = false, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.1 : 1.6}>
      <path d="M4 10v4M7 8l11-4v16L7 16z" strokeLinejoin="round" />
      <path d="M7 12h2" strokeLinecap="round" />
    </svg>
  );
}

export function IconBook({ active = false, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.1 : 1.6}>
      <path d="M5 4h8a3 3 0 0 1 3 3v13H8a3 3 0 0 0-3 3z" />
      <path d="M5 18h11" strokeLinecap="round" />
    </svg>
  );
}

export function IconCalendar({ active = false, size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.1 : 1.6}>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M8 3v4M16 3v4M3 10h18" strokeLinecap="round" />
    </svg>
  );
}
