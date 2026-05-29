import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';

export default function Dev() {
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
    <div className="min-h-dvh bg-zinc-950 p-5 text-zinc-100">
      <div className="mx-auto max-w-3xl">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold">Zent Mobile · Dev</h1>
            <p className="mt-1 text-xs text-zinc-500">Verificación rápida contra backend actual.</p>
          </div>
          <Link to="/feed" className="rounded-lg border border-zinc-700 px-3 py-2 text-xs text-zinc-300">
            Volver
          </Link>
        </div>

        {error && <p className="rounded-xl border border-red-900 bg-red-950 p-4 text-sm text-red-300">{error}</p>}

        <div className="grid gap-4 md:grid-cols-2">
          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <h2 className="mb-3 text-sm font-semibold">Health</h2>
            {health ? (
              <pre className="overflow-auto text-xs text-zinc-400">{JSON.stringify(health, null, 2)}</pre>
            ) : (
              <p className="text-sm text-zinc-500">Cargando...</p>
            )}
          </section>

          <section className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
            <h2 className="mb-3 text-sm font-semibold">Scrape Status</h2>
            {scrape ? (
              <pre className="overflow-auto text-xs text-zinc-400">{JSON.stringify(scrape, null, 2)}</pre>
            ) : (
              <p className="text-sm text-zinc-500">Cargando...</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
