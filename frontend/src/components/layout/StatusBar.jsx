export default function StatusBar() {
  const now = new Date().toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  return (
    <div className="h-6 px-5 flex items-center justify-between text-[11px] font-semibold">
      <span>{now}</span>
      <div className="flex items-center gap-1">
        <svg width="15" height="11" viewBox="0 0 15 11" fill="currentColor">
          <rect x="0"  y="4" width="3" height="7" rx="1" />
          <rect x="4"  y="2.5" width="3" height="8.5" rx="1" />
          <rect x="8"  y="1" width="3" height="10" rx="1" />
          <rect x="12" y="0" width="3" height="11" rx="1" opacity="0.3" />
        </svg>
        <svg width="16" height="12" viewBox="0 0 25 12" fill="currentColor">
          <rect x="0" y="0" width="22" height="12" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <rect x="1.5" y="1.5" width="16" height="9" rx="2" />
          <rect x="23" y="3.5" width="2" height="5" rx="1" />
        </svg>
      </div>
    </div>
  );
}
