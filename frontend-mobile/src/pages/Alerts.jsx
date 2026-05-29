import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { BottomNav, StatusBar } from '../components/layout';

export default function Alerts() {
  const [health, setHealth] = useState(null);
  const [scrape, setScrape] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([api.health(), api.scrapeStatus()])
      .then(([healthData, scrapeData]) => {
        setHealth(healthData);
        setScrape(scrapeData);
      })
      .catch((err) => setError(err.message));
  }, []);

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      <StatusBar />

      <header className="shrink-0 border-b border-line bg-white px-3 pb-3 pt-1">
        <h1 className="text-[18px] font-bold">Alertas</h1>
        <p className="mt-0.5 text-[10px] text-muted">Estado del backend y actualizaciones del feed.</p>
      </header>

      <main className="mobile-scroll min-h-0 flex-1 space-y-3 bg-zinc-100/70 px-3 py-3">
        {error && (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-3 text-[11px] text-red-700">
            {error}
          </section>
        )}

        <section className="rounded-2xl border border-line bg-white p-3 shadow-[0_4px_18px_rgba(0,0,0,0.06)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted">Backend</p>
          <h2 className="mt-1 text-[15px] font-semibold">{health ? `${health.platform} activo` : 'Verificando...'}</h2>
          <p className="mt-1 text-[11px] text-muted">
            {health ? `Versión ${health.version} · ${health.status}` : 'Conectando con /api/health'}
          </p>
        </section>

        <section className="rounded-2xl border border-line bg-white p-3 shadow-[0_4px_18px_rgba(0,0,0,0.06)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-muted">Scraping</p>
          <h2 className="mt-1 text-[15px] font-semibold">
            {scrape?.isScraping ? 'Actualizando oportunidades' : 'Scraper en reposo'}
          </h2>
          <p className="mt-1 text-[11px] text-muted">
            {scrape
              ? `${scrape.cachedItems} items en memoria · ${scrape.lastScrapeResult?.status || 'sin ejecución reciente'}`
              : 'Conectando con /api/scrape/status'}
          </p>
        </section>
      </main>

      <BottomNav />
    </div>
  );
}
