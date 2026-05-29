import { useLocation } from 'react-router-dom';

const PHONE_ROUTES = ['/feed', '/chat'];

export default function PhoneShell({ children }) {
  const { pathname } = useLocation();
  const isPhoneApp = PHONE_ROUTES.includes(pathname);

  if (!isPhoneApp) return <>{children}</>;

  return (
    <div className="phone-stage">
      <div className="phone-device">
        <div className="phone-notch" aria-hidden />
        <div className="phone-screen">{children}</div>
      </div>
      <p className="phone-caption hidden md:block">Zent · Vista móvil · 375 × 812</p>
    </div>
  );
}
