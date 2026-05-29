import { Routes, Route, useLocation } from 'react-router-dom';
import PhoneShell from './components/layout/PhoneShell';
import LandingPage from './pages/LandingPage';
import FeedPage from './pages/FeedPage';
import ChatPage from './pages/ChatPage';
import DevPage from './pages/DevPage';

export default function App() {
  const { pathname } = useLocation();

  return (
    <PhoneShell>
      <Routes>
        <Route path="/"     element={<LandingPage />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/dev"  element={<DevPage />} />
      </Routes>
    </PhoneShell>
  );
}
