import { Link, useLocation } from 'react-router-dom';

export default function Navbar({ variant = 'landing' }) {
  const location = useLocation();
  const isFeed = location.pathname === '/feed';

  return (
    <header className={`fixed top-0 inset-x-0 z-50 flex items-center justify-between px-5 py-4 ${
      variant === 'feed'
        ? 'bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm'
        : 'bg-zent-bg/80 backdrop-blur-md border-b border-zent-border/50'
    }`}>
      <Link to="/" className="flex items-center gap-2.5 group">
        <span className="font-logo font-bold text-xl tracking-tight group-hover:opacity-80 transition-opacity">Zent</span>
      </Link>
      <nav className="flex items-center gap-3">
        {!isFeed && (
          <Link to="/feed" className="hidden sm:inline-flex text-sm hover:opacity-80 transition-opacity">
            Explorar feed
          </Link>
        )}
        <Link to="/feed"
          className="inline-flex items-center gap-2 rounded-full bg-black text-white px-4 py-2 text-sm font-semibold hover:opacity-90 transition-opacity">
          {variant === 'feed' ? 'Feed activo' : 'Entrar al feed'}
        </Link>
      </nav>
    </header>
  );
}
