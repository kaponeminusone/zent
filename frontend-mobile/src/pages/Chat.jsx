import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { api } from '../api/client';
import { BottomNav, StatusBar } from '../components/layout';
import { IconBack, IconUser, IconZentAI } from '../components/icons';

const suggestions = ['¿Qué becas hay?', 'Formaciones disponibles', 'Convocatorias abiertas'];

function InlineFormatted({ text }) {
  const parts = text.split(/(\*\*[^*]+\*\*|https?:\/\/\S+)/g).filter(Boolean);

  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={`${part}-${index}`}>{part.slice(2, -2)}</strong>;
    }

    if (/^https?:\/\//.test(part)) {
      const cleanUrl = part.replace(/[),.]$/, '');
      const suffix = part.slice(cleanUrl.length);
      return (
        <span key={`${part}-${index}`}>
          <a
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="break-all font-semibold underline decoration-black/40 underline-offset-2"
          >
            {cleanUrl}
          </a>
          {suffix}
        </span>
      );
    }

    return <span key={`${part}-${index}`}>{part}</span>;
  });
}

function FormattedMessage({ text }) {
  return (
    <div className="space-y-1.5">
      {text.split('\n').map((line, index) => {
        const trimmed = line.trim();
        if (!trimmed) return <div key={`blank-${index}`} className="h-1" />;

        if (trimmed.startsWith('•')) {
          return (
            <div key={`${line}-${index}`} className="flex gap-1.5">
              <span className="mt-[1px] shrink-0">•</span>
              <p className="min-w-0 break-words">
                <InlineFormatted text={trimmed.slice(1).trim()} />
              </p>
            </div>
          );
        }

        return (
          <p key={`${line}-${index}`} className="break-words">
            <InlineFormatted text={line} />
          </p>
        );
      })}
    </div>
  );
}

export default function Chat() {
  const [messages, setMessages] = useState([
    {
      role: 'model',
      content:
        'Hola, soy Zent. Pregúntame por becas, convocatorias, formaciones o eventos y te ayudaré a encontrar la fuente oficial.',
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, loading]);

  useEffect(() => {
    gsap.fromTo('.chat-message:last-child', { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.25 });
  }, [messages.length]);

  const send = async (value = input) => {
    const message = value.trim();
    if (!message || loading) return;

    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: message }]);
    setLoading(true);

    try {
      const history = messages.map((item) => ({ role: item.role, content: item.content }));
      const data = await api.sendChat(message, history);
      setMessages((prev) => [
        ...prev,
        {
          role: 'model',
          content: data.reply,
          warning: data.warning,
          relatedItems: data.relatedItems || [],
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { role: 'model', content: `No pude conectar con el backend: ${err.message}` },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      <div className="shrink-0 bg-white shadow-[0_0.5px_0_rgba(0,0,0,0.25)]">
        <StatusBar />
        <div className="relative flex h-10 items-center justify-center">
          <Link to="/feed" className="absolute left-2 p-2" aria-label="Volver">
            <IconBack />
          </Link>
          <h1 className="text-[15px] font-semibold tracking-[-0.3px]">Zent Assistant</h1>
        </div>
      </div>

      <main ref={listRef} className="mobile-scroll min-h-0 flex-1 space-y-4 px-4 py-4">
        {messages.map((item, index) => {
          const user = item.role === 'user';
          const visibleRelatedItems = (item.relatedItems || []).filter(
            (related) => !item.content.toLowerCase().includes(related.title.toLowerCase()),
          );

          return (
            <div key={`${item.role}-${index}`} className={`chat-message flex gap-2 ${user ? 'flex-row-reverse' : ''}`}>
              <div
                className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
                  user ? 'bg-zinc-100 text-black ring-1 ring-line' : 'bg-black text-white'
                }`}
              >
                {user ? <IconUser size={16} /> : <IconZentAI size={16} />}
              </div>
              <div
                className={`min-w-0 max-w-[80%] overflow-hidden rounded-md bg-black/[0.035] px-3 py-2 text-[13px] leading-[18px] ${
                  user ? 'rounded-tr-none' : 'rounded-tl-none'
                }`}
              >
                <FormattedMessage text={item.content} />
                {item.warning && <p className="mt-2 border-t border-black/5 pt-1 text-[10px] text-amber-700">{item.warning}</p>}
                {visibleRelatedItems.length > 0 && (
                  <div className="mt-2 space-y-1 border-t border-black/5 pt-2">
                    {visibleRelatedItems.map((related) => (
                      <Link key={related.id} to="/feed" className="block truncate text-[10px] font-semibold underline">
                        {related.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
        {loading && <p className="text-xs text-muted">Zent está respondiendo...</p>}
      </main>

      <div className="mobile-scroll shrink-0 flex gap-1.5 px-3 py-1">
        {suggestions.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => send(item)}
            className="shrink-0 rounded-full border border-line px-2.5 py-1 text-[10px] font-semibold text-muted"
          >
            {item}
          </button>
        ))}
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          send();
        }}
        className="flex shrink-0 gap-2 border-t border-line bg-white px-3 py-2"
      >
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Pregunta sobre oportunidades..."
          className="min-w-0 flex-1 rounded-md border border-line px-3 py-2 text-[12px] outline-none focus:border-black"
          maxLength={1000}
        />
        <button type="submit" disabled={loading || !input.trim()} className="btn-primary h-9 px-4 disabled:opacity-40">
          Enviar
        </button>
      </form>

      <BottomNav />
    </div>
  );
}
