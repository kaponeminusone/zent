import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import StatusBar from '../components/layout/StatusBar';
import TabBar from '../components/layout/TabBar';
import { api } from '../api/client';
import { categoryLabel } from '../lib/constants';

const SUGGESTIONS = ['¿Qué becas hay?', 'Convocatorias abiertas', 'Formaciones SENA'];

export default function ChatPage() {
  const [messages, setMessages] = useState([{
    role: 'model',
    content: '¡Hola! Soy Zent. Pregúntame sobre becas, convocatorias, formaciones o eventos del feed y te orientaré hacia la fuente oficial.',
  }]);
  const [input,   setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    gsap.from('.chat-bubble', { opacity: 0, y: 10, stagger: 0.05, duration: 0.3 });
  }, [messages.length]);

  const send = async (text) => {
    const msg = text.trim();
    if (!msg || loading) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: msg }]);
    setLoading(true);
    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const data = await api.sendChat(msg, history);
      setMessages((prev) => [...prev, { role: 'model', content: data.reply, relatedItems: data.relatedItems }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'model', content: 'No pude conectar con el backend. Verifica que esté en el puerto 3001.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-hidden">
      <div className="shrink-0 bg-white shadow-[0_0.5px_0_rgba(0,0,0,0.3)]">
        <StatusBar />
        <div className="relative h-11 flex items-center justify-center border-t border-transparent">
          <Link to="/feed" className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-black" aria-label="Volver">
            <svg width="12" height="21" viewBox="0 0 12 21" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M10 2L2 10.5L10 19" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <h1 className="text-[17px] font-semibold tracking-[-0.4px]">Zent</h1>
        </div>
      </div>

      <div ref={listRef} className="feed-scroll flex-1 min-h-0 px-4 pt-4 pb-2 space-y-4">
        {messages.map((msg, i) => {
          const isUser = msg.role === 'user';
          return (
            <div key={i} className={`chat-bubble flex gap-2 ${isUser ? 'flex-row-reverse' : ''}`}>
              <div className="w-7 h-7 rounded-full bg-zinc-200 shrink-0 mt-0.5" />
              <div className={`max-w-[80%] px-4 py-3 text-[13px] leading-[18px] rounded-xl ${
                isUser ? 'bg-black text-white' : 'bg-zinc-100 text-black'
              }`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
                {msg.relatedItems?.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-zinc-200 space-y-1.5">
                    {msg.relatedItems.map((item) => (
                      <Link key={item.id} to="/feed" className="block text-xs underline truncate text-zinc-500">
                        {item.title} · {categoryLabel(item.category)}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {loading && (
          <div className="flex gap-2">
            <div className="w-7 h-7 rounded-full bg-zinc-200" />
            <div className="bg-zinc-100 rounded-xl px-4 py-2 text-xs text-zinc-500">Escribiendo...</div>
          </div>
        )}
      </div>

      <div className="shrink-0 px-3 pt-1 pb-1 flex gap-1.5 overflow-x-auto">
        {SUGGESTIONS.map((s) => (
          <button key={s} type="button" onClick={() => send(s)}
            className="shrink-0 text-[10px] border border-zinc-200 rounded-full px-2.5 py-1 text-zinc-500">
            {s}
          </button>
        ))}
      </div>

      <form onSubmit={(e) => { e.preventDefault(); send(input); }}
        className="shrink-0 flex gap-2 px-3 py-2 border-t border-zinc-100 bg-white">
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
          placeholder="Pregunta sobre oportunidades..." maxLength={1000}
          className="flex-1 text-sm border border-zinc-200 rounded-md px-3 py-2.5 outline-none focus:border-black" />
        <button type="submit" disabled={loading || !input.trim()}
          className="btn-filled px-4 w-12 disabled:opacity-40">→</button>
      </form>

      <TabBar />
    </div>
  );
}
