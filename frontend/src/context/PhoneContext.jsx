import { createContext, useContext, useMemo, useState } from 'react';

const PhoneContext = createContext(null);

export function PhoneProvider({ children }) {
  const [chatOpen, setChatOpen] = useState(false);
  const value = useMemo(() => ({
    chatOpen,
    openChat:   () => setChatOpen(true),
    closeChat:  () => setChatOpen(false),
    toggleChat: () => setChatOpen((v) => !v),
  }), [chatOpen]);

  return <PhoneContext.Provider value={value}>{children}</PhoneContext.Provider>;
}

export function usePhone() {
  const ctx = useContext(PhoneContext);
  if (!ctx) throw new Error('usePhone must be used within PhoneProvider');
  return ctx;
}
