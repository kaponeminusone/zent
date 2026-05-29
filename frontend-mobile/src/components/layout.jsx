import { NavLink, useLocation } from 'react-router-dom';
import { IconBell, IconChat, IconHome } from './icons';

export function PhoneShell({ children }) {
  const { pathname } = useLocation();
  const isDev = pathname === '/dev';

  if (isDev) return children;

  return (
    <div className="phone-stage">
      <div className="phone-device">
        <div className="phone-notch" />
        <div className="phone-screen">{children}</div>
      </div>
    </div>
  );
}

export function StatusBar({ dark = false }) {
  return (
    <div className={`h-8 shrink-0 px-4 pb-1 flex items-end justify-between ${dark ? 'text-white' : 'text-black'}`}>
      <span className="text-[13px] font-semibold tabular-nums">9:27</span>
      <div className="flex items-center gap-1 opacity-90 scale-90 origin-right">
        <svg width="16" height="10" viewBox="0 0 18 12" fill="currentColor">
          <rect x="0" y="7" width="3" height="5" rx="0.5" />
          <rect x="5" y="5" width="3" height="7" rx="0.5" />
          <rect x="10" y="2" width="3" height="10" rx="0.5" />
          <rect x="15" y="0" width="3" height="12" rx="0.5" />
        </svg>
        <svg width="14" height="10" viewBox="0 0 16 12" fill="currentColor">
          <path d="M8 3.6c2.2 0 4.2.9 5.7 2.3l1.2-1.2C12.9 2.7 10.6 1.6 8 1.6S3.1 2.7 1.1 4.7l1.2 1.2C3.8 4.5 5.8 3.6 8 3.6zm0 3.6c1.3 0 2.5.5 3.4 1.4l1.2-1.2C11.2 6.2 9.7 5.6 8 5.6S4.8 6.2 3.4 7.4l1.2 1.2c.9-.9 2.1-1.4 3.4-1.4zm0 3.6c.7 0 1.3.3 1.8.7L8 12l-1.8-1.5c.5-.4 1.1-.7 1.8-.7z" />
        </svg>
        <svg width="20" height="10" viewBox="0 0 25 12" fill="currentColor">
          <rect x="0.5" y="0.5" width="21" height="11" rx="2.5" stroke="currentColor" fill="none" />
          <rect x="2" y="2" width="16" height="8" rx="1.5" />
          <path d="M23 4v4a2 2 0 0 0 0-4z" />
        </svg>
      </div>
    </div>
  );
}

export function HomeIndicator() {
  return (
    <div className="shrink-0 flex justify-center pt-0.5 pb-1">
      <div className="h-1 w-[100px] rounded-full bg-black" />
    </div>
  );
}

export function BottomNav() {
  return (
    <nav className="shrink-0 bg-white/95 backdrop-blur shadow-[0_-0.5px_0_rgba(0,0,0,0.25)]">
      <div className="h-11 px-8 flex items-end justify-between">
        <NavLink
          to="/chat"
          className={({ isActive }) =>
            `-mt-1 min-w-12 flex flex-col items-center gap-0 ${isActive ? 'text-black' : 'text-muted/80'}`
          }
          aria-label="ZentIA"
        >
          {({ isActive }) => (
            <>
              <span className="h-8 flex items-center">
                <IconChat active={isActive} size={21} />
              </span>
              <span className="text-[11px] font-medium leading-none">ZentIA</span>
            </>
          )}
        </NavLink>
        <NavLink
          to="/feed"
          className={({ isActive }) =>
            `-mt-1 min-w-12 flex flex-col items-center gap-0 ${isActive ? 'text-black' : 'text-muted/80'}`
          }
          aria-label="Home"
        >
          {({ isActive }) => (
            <>
              <span className="h-8 flex items-center">
                <IconHome active={isActive} size={21} />
              </span>
              <span className="text-[11px] font-medium leading-none">Home</span>
            </>
          )}
        </NavLink>
        <NavLink
          to="/alerts"
          className={({ isActive }) =>
            `-mt-1 min-w-20 flex flex-col items-center gap-0 ${isActive ? 'text-black' : 'text-muted/80'}`
          }
          aria-label="Notificaciones"
        >
          {({ isActive }) => (
            <>
              <span className="h-8 flex items-center">
                <IconBell active={isActive} size={21} />
              </span>
              <span className="text-[11px] font-medium leading-none">Notificaciones</span>
            </>
          )}
        </NavLink>
      </div>
      <HomeIndicator />
    </nav>
  );
}
