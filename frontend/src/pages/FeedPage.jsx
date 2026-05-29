import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import FeedCard from '../components/feed/FeedCard';
import FeedFilters from '../components/feed/FeedFilters';
import StatusBar from '../components/layout/StatusBar';
import TabBar from '../components/layout/TabBar';
import { useActiveCard, useFeed } from '../hooks/useFeed';

export default function FeedPage() {
  const [category, setCategory] = useState(null);
  const { items, loading, error, hasNext, loadMore, meta } = useFeed(category);
  const scrollRef   = useRef(null);
  const activeIndex = useActiveCard(scrollRef);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const handler = () => { if (hasNext && !loading) loadMore(); };
    el.addEventListener('feed-near-end', handler);
    return () => el.removeEventListener('feed-near-end', handler);
  }, [hasNext, loading, loadMore]);

  useEffect(() => {
    if (!items.length) return;
    const cards = scrollRef.current?.querySelectorAll('.feed-card');
    if (!cards?.length) return;
    gsap.fromTo(cards[cards.length - 1], { opacity: 0, scale: 0.98 }, { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out' });
  }, [items.length]);

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    scrollRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="h-full bg-black overflow-hidden flex flex-col">
      <div className="shrink-0 bg-gradient-to-b from-black to-transparent absolute top-0 inset-x-0 z-40 pt-0">
        <StatusBar />
        <FeedFilters active={category} onChange={handleCategoryChange} />
      </div>

      {error && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 rounded-2xl bg-red-500/20 border border-red-500/40 px-6 py-4 text-center max-w-sm">
          <p className="text-sm text-red-200">{error}</p>
          <p className="text-xs text-red-300/70 mt-1">¿Está corriendo el backend en localhost:3001?</p>
        </div>
      )}

      {loading && items.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 rounded-full border-2 border-white border-t-transparent animate-spin" />
            <p className="text-sm text-zinc-400">Cargando oportunidades...</p>
          </div>
        </div>
      ) : (
        <div ref={scrollRef} className="feed-scroll flex-1 h-full" style={{ scrollSnapType: 'y mandatory' }}>
          {items.map((item, i) => (
            <div key={item.id} style={{ height: '100%', scrollSnapAlign: 'start', scrollSnapStop: 'always' }}>
              <FeedCard item={item} isActive={i === activeIndex} />
            </div>
          ))}
          {items.length === 0 && !loading && (
            <div className="h-full flex items-center justify-center px-6 text-center">
              <p className="text-zinc-500">No hay oportunidades en esta categoría.</p>
            </div>
          )}
          {loading && items.length > 0 && (
            <div className="h-20 flex items-center justify-center shrink-0">
              <div className="w-6 h-6 rounded-full border-2 border-white border-t-transparent animate-spin" />
            </div>
          )}
        </div>
      )}

      {meta && (
        <div className="absolute bottom-16 left-3 z-30">
          <span className="text-[10px] text-zinc-600 bg-black/40 backdrop-blur rounded-full px-2 py-1">
            {meta.mockCount} mock · {meta.scrapedCount} en vivo
          </span>
        </div>
      )}

      <TabBar />
    </div>
  );
}
