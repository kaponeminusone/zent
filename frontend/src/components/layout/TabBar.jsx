import { Link, useLocation } from 'react-router-dom';
import HomeIndicator from './HomeIndicator';
import { IconChat, IconHome, IconBell } from '../icons';

const NAV = [
  { to: '/chat', label: 'Chat',   Icon: IconChat },
  { to: '/feed', label: 'Home',   Icon: IconHome, center: true },
  { to: '/feed', label: 'Alertas',Icon: IconBell },
];

export default function TabBar() {
  const { pathname } = useLocation();

  return (
    <nav className="shrink-0 bg-white/95 backdrop-blur-md shadow-[0_-0.5px_0_rgba(0,0,0,0.3)] z-20">
      <div className="h-11 flex items-end justify-around px-6">
        {NAV.map((item) => {
          const active = item.center ? pathname === '/feed' : pathname === item.to;
          const { Icon } = item;
          return (
            <Link key={item.label} to={item.to}
              className={`flex flex-col items-center gap-0 min-w-[48px] pb-0.5 ${active ? 'text-black' : 'text-zent-gray opacity-70'}`}
              aria-label={item.label}
            >
              <Icon active={active} size={20} />
              {item.center && (
                <span className={`text-[11px] font-medium leading-tight ${active ? 'text-black' : 'text-zent-gray'}`}>
                  Home
                </span>
              )}
            </Link>
          );
        })}
      </div>
      <HomeIndicator />
    </nav>
  );
}
