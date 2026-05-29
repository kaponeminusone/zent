import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { api } from '../api/client';
import { FeedCard } from '../components/FeedCard';
import { FeedControls } from '../components/FeedControls';
import { IconRefresh } from '../components/icons';
import { BottomNav, StatusBar } from '../components/layout';
import { useFeed } from '../hooks/useFeed';

export default function Feed() {
  const [category, setCategory] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [scrapeState, setScrapeState] = useState({ loading: false, label: 'Actualizar' });
  const scrollerRef = useRef(null);

  const { items, rawCount, hasNext, loading, error, loadMore, reload } = useFeed({
    category,
    search,
    filter,
  });

  useEffect(() => {
    if (!items.length) return;
    gsap.fromTo(
      '.feed-card',
      { autoAlpha: 0, y: 12 },
      { autoAlpha: 1, y: 0, duration: 0.28, stagger: 0.04, ease: 'power2.out', overwrite: 'auto' },
    );
  }, [category, filter, items.length]);

  useEffect(() => {
    const node = scrollerRef.current;
    if (!node) return undefined;
    const onScroll = () => {
      if (node.scrollTop + node.clientHeight > node.scrollHeight - 90) loadMore();
    };
    node.addEventListener('scroll', onScroll, { passive: true });
    return () => node.removeEventListener('scroll', onScroll);
  }, [loadMore]);

  const runScrape = async () => {
    setScrapeState({ loading: true, label: 'Scraping...' });
    try {
      await api.scrapeRun(6);
      setScrapeState({ loading: false, label: 'En proceso' });
      setTimeout(reload, 2600);
    } catch (err) {
      setScrapeState({ loading: false, label: err.message.includes('curso') ? 'En curso' : 'Error' });
    }
  };

  return (
    <div className="flex h-full flex-col overflow-hidden bg-white">
      <StatusBar />

      <header className="shrink-0 bg-white">
        <div className="flex items-center justify-between px-3 pb-1 pt-1">
          <div>
            <h1 className="font-logo text-[24px] leading-none">ZENT</h1>
            <p className="mt-0.5 text-[10px] text-muted">{rawCount} oportunidades</p>
          </div>
          <button
            type="button"
            onClick={runScrape}
            disabled={scrapeState.loading}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-black disabled:opacity-50"
            aria-label={scrapeState.label}
            title={scrapeState.label}
          >
            <span className={scrapeState.loading ? 'animate-spin' : ''}>
              <IconRefresh size={15} />
            </span>
          </button>
        </div>
        <FeedControls
          category={category}
          setCategory={setCategory}
          search={search}
          setSearch={setSearch}
          filter={filter}
          setFilter={setFilter}
        />
      </header>

      {error && (
        <div className="mx-3 mt-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-[11px] text-red-700">
          {error}. Verifica que el backend esté en el puerto 3001.
        </div>
      )}

      <main ref={scrollerRef} className="mobile-scroll min-h-0 flex-1 bg-white px-3">
        {loading && rawCount === 0 ? (
          <div className="flex justify-center py-16">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-black border-t-transparent" />
          </div>
        ) : items.length === 0 ? (
          <p className="py-16 text-center text-xs text-muted">No hay resultados para estos filtros.</p>
        ) : (
          items.map((item) => <FeedCard key={item.id} item={item} />)
        )}

        {hasNext && items.length > 0 && (
          <button type="button" onClick={loadMore} className="btn-outline my-3 h-9 w-full text-[11px]">
            Ver más
          </button>
        )}
      </main>

      <BottomNav />
    </div>
  );
}
