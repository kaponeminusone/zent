import { Navigate, Route, Routes } from 'react-router-dom';
import { PhoneShell } from './components/layout';
import Alerts from './pages/Alerts';
import Chat from './pages/Chat';
import Dev from './pages/Dev';
import Feed from './pages/Feed';
import Splash from './pages/Splash';

export default function App() {
  return (
    <PhoneShell>
      <Routes>
        <Route path="/" element={<Splash />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/alerts" element={<Alerts />} />
        <Route path="/dev" element={<Dev />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PhoneShell>
  );
}
