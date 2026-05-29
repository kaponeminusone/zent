import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

const CATEGORY_COLORS = {
  beca: 'bg-violet-500/20 text-violet-300 border-violet-500/40',
  convocatoria: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
  formacion: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
  evento: 'bg-pink-500/20 text-pink-300 border-pink-500/40',
};

function Badge({ label, color = 'bg-zinc-800 text-zinc-300 border-zinc-700' }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${color}`}>
      {label}
    </span>
  );
}

function Section({ title, children }) {
  return (
    <section className="rounded-xl border border-zinc-800 bg-zinc-900 overflow-hidden">
      <div className="px-4 py-3 border-b border-zinc-800 bg-zinc-800/50">
        <h2 className="text-sm font-semibold text-zinc-200">{title}</h2>
      </div>
      <div className="p-4">{children}</div>
    </section>
  );
}

// ── Health ────────────────────────────────────────────────────────────────────
function HealthPanel() {
  const [data, setData] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    api.health()
      .then(setData)
      .catch((e) => setErr(e.message));
  }, []);

  return (
    <Section title="🟢 Backend Health — GET /api/health">
      {err && <p className="text-red-400 text-sm">Error: {err} — ¿Está corriendo el backend en :3001?</p>}
      {data && (
        <div className="space-y-2 text-sm">
          <p>
            <span className="text-zinc-500">Status:</span>{' '}
            <span className="text-emerald-400 font-semibold">{data.status}</span>
            {' · '}
            <span className="text-zinc-400">{data.platform} v{data.version}</span>
          </p>
          <div className="mt-2">
            <p className="text-zinc-500 text-xs mb-1">Endpoints disponibles:</p>
            <ul className="font-mono text-xs text-zinc-400 space-y-0.5">
              {data.endpoints?.map((e) => <li key={e}>{e}</li>)}
            </ul>
          </div>
        </div>
      )}
    </Section>
  );
}

// ── Feed ─────────────────────────────────────────────────────────────────────
function FeedPanel() {
  const [data, setData] = useState(null);
  const [category, setCategory] = useState('');
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(() => {
    setLoading(true);
    setErr(null);
    api.getFeed(1, 5, category || null)
      .then(setData)
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
  }, [category]);

  useEffect(() => { load(); }, [load]);

  return (
    <Section title="📋 Feed — GET /api/feed">
      <div className="flex gap-2 mb-4 flex-wrap">
        {['', 'beca', 'convocatoria', 'formacion', 'evento'].map((c) => (
          <button
            key={c}
            onClick={() => setCategory(c)}
            className={`rounded-full px-3 py-1 text-xs font-medium border transition-colors ${
              category === c
                ? 'bg-white text-black border-white'
                : 'bg-zinc-800 text-zinc-400 border-zinc-700 hover:border-zinc-500'
            }`}
          >
            {c || 'Todo'}
          </button>
        ))}
        <button onClick={load} className="rounded-full px-3 py-1 text-xs border border-zinc-700 bg-zinc-800 text-zinc-400 hover:border-zinc-500 ml-auto">
          {loading ? '...' : '↻ Recargar'}
        </button>
      </div>

      {err && <p className="text-red-400 text-sm">{err}</p>}

      {data && (
        <>
          <div className="flex gap-4 text-xs text-zinc-500 mb-3">
            <span>Total: <strong className="text-zinc-300">{data.pagination.total}</strong></span>
            <span>Páginas: <strong className="text-zinc-300">{data.pagination.totalPages}</strong></span>
            <span>Mock: <strong className="text-zinc-300">{data.meta.mockCount}</strong></span>
            <span>Scraped: <strong className="text-zinc-300">{data.meta.scrapedCount}</strong></span>
          </div>

          <div className="space-y-2">
            {data.items.map((item) => (
              <div key={item.id} className="flex gap-3 rounded-lg border border-zinc-800 bg-zinc-800/40 p-3">
                <img src={item.image} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge label={item.category} color={CATEGORY_COLORS[item.category]} />
                    {item.scraped && <Badge label="en vivo" color="bg-emerald-500/20 text-emerald-400 border-emerald-500/30" />}
                  </div>
                  <p className="text-sm font-medium text-zinc-200 truncate">{item.title}</p>
                  <p className="text-xs text-zinc-500 truncate">{item.source} · {item.date}</p>
                  <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer"
                    className="text-[10px] text-violet-400 hover:text-violet-300 truncate block">
                    {item.sourceUrl}
                  </a>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </Section>
  );
}

// ── Chat ─────────────────────────────────────────────────────────────────────
function ChatPanel() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim() || loading) return;
    const msg = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: msg }]);
    setLoading(true);

    try {
      const history = messages.map((m) => ({ role: m.role, content: m.content }));
      const data = await api.sendChat(msg, history);
      setMessages((prev) => [...prev, {
        role: 'model',
        content: data.reply,
        relatedItems: data.relatedItems,
      }]);
    } catch (e) {
      setMessages((prev) => [...prev, { role: 'error', content: e.message }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Section title="💬 Chatbot — POST /api/chat">
      <div className="space-y-2 mb-3 max-h-72 overflow-y-auto pr-1">
        {messages.length === 0 && (
          <p className="text-zinc-600 text-sm">Envía un mensaje para probar el chatbot.</p>
        )}
        {messages.map((msg, i) => (
          <div key={i} className={`rounded-lg p-3 text-sm ${
            msg.role === 'user' ? 'bg-violet-500/20 text-violet-100 ml-8' :
            msg.role === 'error' ? 'bg-red-500/20 text-red-300' :
            'bg-zinc-800 text-zinc-200 mr-8'
          }`}>
            <span className="text-[10px] font-bold uppercase text-zinc-500 block mb-1">
              {msg.role === 'model' ? 'Zent' : msg.role}
            </span>
            <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
            {msg.relatedItems?.length > 0 && (
              <div className="mt-2 pt-2 border-t border-zinc-700">
                <p className="text-[10px] text-zinc-500 mb-1">Items relacionados:</p>
                {msg.relatedItems.map((item) => (
                  <p key={item.id} className="text-[11px] text-zinc-400">• {item.title}</p>
                ))}
              </div>
            )}
          </div>
        ))}
        {loading && <div className="text-zinc-500 text-sm animate-pulse">Zent está respondiendo...</div>}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Ej: ¿Qué becas hay disponibles?"
          className="flex-1 rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-2 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500"
        />
        <button
          onClick={send}
          disabled={loading || !input.trim()}
          className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium disabled:opacity-40 hover:bg-violet-500 transition-colors"
        >
          Enviar
        </button>
      </div>

      <div className="flex gap-2 mt-2 flex-wrap">
        {['¿Qué becas hay?', 'Convocatorias abiertas', 'Cursos del SENA', 'Eventos en Bogotá'].map((s) => (
          <button key={s} onClick={() => setInput(s)}
            className="rounded-full bg-zinc-800 border border-zinc-700 px-3 py-1 text-[11px] text-zinc-400 hover:border-zinc-500">
            {s}
          </button>
        ))}
      </div>
    </Section>
  );
}

// ── Scraper ───────────────────────────────────────────────────────────────────
function ScraperPanel() {
  const [status, setStatus] = useState(null);
  const [running, setRunning] = useState(false);
  const [maxEvents, setMaxEvents] = useState(5);
  const [result, setResult] = useState(null);

  const fetchStatus = useCallback(() => {
    api.scrapeStatus().then(setStatus).catch(console.error);
  }, []);

  useEffect(() => {
    fetchStatus();
    const t = setInterval(fetchStatus, 3000);
    return () => clearInterval(t);
  }, [fetchStatus]);

  const runScrape = async () => {
    setRunning(true);
    setResult(null);
    try {
      const r = await api.scrapeRun(maxEvents);
      setResult(r);
    } catch (e) {
      setResult({ error: e.message });
    }
    setTimeout(() => setRunning(false), 2000);
  };

  return (
    <Section title="🔍 Scraper — ciudadbolivar.gov.co">
      <div className="flex items-center gap-3 mb-4 flex-wrap">
        <div className="flex items-center gap-2">
          <label className="text-xs text-zinc-400">Máx. eventos:</label>
          <input
            type="number"
            min={1} max={20}
            value={maxEvents}
            onChange={(e) => setMaxEvents(Number(e.target.value))}
            className="w-16 rounded bg-zinc-800 border border-zinc-700 px-2 py-1 text-sm text-center text-zinc-200 focus:outline-none"
          />
        </div>
        <button
          onClick={runScrape}
          disabled={running || status?.isScraping}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium disabled:opacity-40 hover:bg-emerald-500 transition-colors"
        >
          {status?.isScraping ? '⏳ Scrapeando...' : '▶ Lanzar scraping'}
        </button>
      </div>

      {result && (
        <div className={`rounded-lg p-3 text-sm mb-3 ${result.error ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/10 text-emerald-300 border border-emerald-800'}`}>
          {result.error ? `Error: ${result.error}` : `Scraping iniciado para ${result.source} (máx. ${result.maxEvents} eventos)`}
        </div>
      )}

      {status && (
        <div className="text-xs space-y-1 text-zinc-400">
          <p>Estado: <span className={status.isScraping ? 'text-amber-400' : 'text-zinc-300'}>
            {status.isScraping ? '⏳ En progreso' : '✓ En reposo'}
          </span></p>
          <p>Items scrapeados en memoria: <strong className="text-zinc-200">{status.cachedItems}</strong></p>
          {status.lastScrapeResult && (
            <>
              <p>Último resultado: <span className={status.lastScrapeResult.status === 'success' ? 'text-emerald-400' : 'text-red-400'}>
                {status.lastScrapeResult.status}
              </span></p>
              {status.lastScrapeResult.linksFound !== undefined && (
                <p>Links encontrados: {status.lastScrapeResult.linksFound} · Eventos scrapeados: {status.lastScrapeResult.itemsScraped}</p>
              )}
              {status.lastScrapeResult.error && (
                <p className="text-red-400">Error: {status.lastScrapeResult.error}</p>
              )}
            </>
          )}
        </div>
      )}
    </Section>
  );
}

// ── Pipeline ──────────────────────────────────────────────────────────────────
function PipelinePanel() {
  const [pipeline, setPipeline] = useState(null);
  const [err, setErr] = useState(null);

  useEffect(() => {
    api.pipeline().then(setPipeline).catch((e) => setErr(e.message));
  }, []);

  if (err) return <Section title="⚙ Pipeline N8N-like"><p className="text-red-400 text-sm">{err}</p></Section>;
  if (!pipeline) return <Section title="⚙ Pipeline N8N-like"><p className="text-zinc-500 text-sm">Cargando...</p></Section>;

  const typeColors = {
    scraper: 'border-emerald-600 bg-emerald-500/10 text-emerald-300',
    mock: 'border-zinc-600 bg-zinc-800 text-zinc-400',
    transformer: 'border-blue-600 bg-blue-500/10 text-blue-300',
    store: 'border-amber-600 bg-amber-500/10 text-amber-300',
    output: 'border-violet-600 bg-violet-500/10 text-violet-300',
    ai: 'border-pink-600 bg-pink-500/10 text-pink-300',
  };

  const statusDot = {
    active: 'bg-emerald-400',
    mock: 'bg-zinc-500',
  };

  return (
    <Section title="⚙ Pipeline N8N-like — GET /api/pipeline">
      <p className="text-xs text-zinc-500 mb-4">{pipeline.description}</p>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 mb-4">
        {pipeline.nodes.map((node) => (
          <div key={node.id}
            className={`rounded-lg border p-3 text-xs ${typeColors[node.type] || 'border-zinc-700 bg-zinc-800 text-zinc-300'}`}>
            <div className="flex items-center gap-1.5 mb-1">
              <span className={`w-2 h-2 rounded-full shrink-0 ${statusDot[node.status] || 'bg-zinc-500'}`} />
              <span className="font-semibold truncate">{node.label}</span>
            </div>
            <span className="text-[10px] opacity-60 uppercase">{node.type} · {node.status}</span>
            {node.description && <p className="text-[10px] opacity-70 mt-1 line-clamp-2">{node.description}</p>}
          </div>
        ))}
      </div>

      <div>
        <p className="text-[11px] text-zinc-500 mb-2">Conexiones ({pipeline.edges.length}):</p>
        <div className="space-y-1 font-mono text-[11px] text-zinc-500">
          {pipeline.edges.map((e, i) => (
            <p key={i}>{e.from} → {e.to} <span className="text-zinc-600">({e.label})</span></p>
          ))}
        </div>
      </div>
    </Section>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function DevPage() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-zinc-100">Zent — Panel de Desarrollo</h1>
            <p className="text-xs text-zinc-500 mt-0.5">Mock page para probar todas las funcionalidades del backend</p>
          </div>
          <Link to="/" className="rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-zinc-400 hover:text-zinc-200 transition-colors">
            ← Ir a la app
          </Link>
        </div>

        <div className="space-y-4">
          <HealthPanel />
          <FeedPanel />
          <ChatPanel />
          <ScraperPanel />
          <PipelinePanel />
        </div>

        <p className="text-center text-xs text-zinc-700 mt-8">
          Zent MVP · Backend en localhost:3001 · Esta página no forma parte del producto final
        </p>
      </div>
    </div>
  );
}
