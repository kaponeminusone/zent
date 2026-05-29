import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import { categoryLabel, formatDate } from '../../lib/constants';

const SUGGESTIONS = ['¿Qué becas hay?', 'Convocatorias abiertas', 'Formaciones SENA', 'Eventos este mes'];

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{
    role: 'model',
    content: '¡Hola! Soy Zent. Pregúntame sobre becas, convocatorias, formaciones o eventos del feed.',
  }]);
  const [input, setInput]   = useState('');
  const [loading, setLoading] = useState(false);
  const panelRef   = useRef(null);
  const messagesRef = useRef(null);

  useEffect(() => {
    if (open && panelRef.current) {
      gsap.fromTo(panelRef.current, { opacity: 0, y: 20, scale: 0.95 }, { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'back.out(1.2)' });
    }
  }, [open]);

  useEffect(() => {
    messagesRef.current?.scrollTo({ top: messagesRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

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
    <>
      <button type="button" onClick={() => setOpen((v) => !v)}
        className="fixed bottom-6 right-6 z-[60] group" aria-label={open ? 'Cerrar chat' : 'Abrir chat'}>
        <span className="relative flex items-center justify-center w-14 h-14 rounded-full bg-black text-white shadow-xl text-2xl hover:scale-105 transition-transform">
          {open ? '✕' : '💬'}
        </span>
      </button>

      {open && (
        <div ref={panelRef}
          className="fixed bottom-24 right-4 sm:right-6 z-[60] w-[calc(100vw-2rem)] sm:w-[380px] max-h-[70dvh] flex flex-col rounded-2xl border border-zinc-200 bg-white shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-100">
            <div>
              <p className="text-sm font-semibold">Zent Assistant</p>
              <p className="text-[10px] text-emerald-600">En línea · IA</p>
            </div>
            <button type="button" onClick={() => setOpen(false)} className="text-zinc-400 hover:text-black p-1">✕</button>
          </div>

          <div ref={messagesRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[280px] max-h-[45dvh]">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                  msg.role === 'user' ? 'bg-black text-white rounded-br-md' : 'bg-zinc-100 text-zinc-800 rounded-bl-md'
                }`}>
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                  {msg.relatedItems?.length > 0 && (
                    <div className="mt-2 space-y-1.5 border-t border-zinc-200 pt-2">
                      {msg.relatedItems.map((item) => (
                        <Link key={item.id} to="/feed" onClick={() => setOpen(false)}
                          className="flex items-center gap-2 rounded-lg bg-white p-2 hover:bg-zinc-50 transition-colors border border-zinc-100">
                          {item.image && <img src={item.image} alt="" className="w-8 h-8 rounded object-cover shrink-0" />}
                          <div className="min-w-0">
                            <p className="text-xs font-medium truncate">{item.title}</p>
                            <p className="text-[10px] text-zinc-500">{categoryLabel(item.category)} · {formatDate(item.date)}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-zinc-100 rounded-2xl rounded-bl-md px-4 py-3">
                  <div className="flex gap-1">
                    {[0,1,2].map((d) => (
                      <span key={d} className="w-2 h-2 rounded-full bg-zinc-400 animate-bounce" style={{ animationDelay: `${d * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="px-3 pb-2 flex gap-1.5 overflow-x-auto scrollbar-none">
            {SUGGESTIONS.map((s) => (
              <button key={s} type="button" onClick={() => send(s)}
                className="shrink-0 rounded-full border border-zinc-200 px-2.5 py-1 text-[10px] text-zinc-500 hover:border-zinc-400 transition-colors">
                {s}
              </button>
            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); send(input); }}
            className="flex gap-2 p-3 border-t border-zinc-100">
            <input type="text" value={input} onChange={(e) => setInput(e.target.value)}
              placeholder="Pregunta sobre oportunidades..." maxLength={1000}
              className="flex-1 rounded-xl bg-zinc-50 border border-zinc-200 px-3 py-2.5 text-sm focus:outline-none focus:border-zinc-400 transition-colors" />
            <button type="submit" disabled={loading || !input.trim()}
              className="rounded-xl bg-black text-white px-4 py-2.5 text-sm font-semibold disabled:opacity-40">→</button>
          </form>
        </div>
      )}
    </>
  );
}
