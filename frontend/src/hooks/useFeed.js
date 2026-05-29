import { useCallback, useEffect, useRef, useState } from 'react';
import { api } from '../api/client';

export function useFeed(category = null) {
  const [items,   setItems]   = useState([]);
  const [page,    setPage]    = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);
  const [meta,    setMeta]    = useState(null);

  const load = useCallback(async (pageNum, append = false) => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getFeed(pageNum, 10, category);
      setItems((prev) => (append ? [...prev, ...data.items] : data.items));
      setHasNext(data.pagination.hasNext);
      setPage(pageNum);
      setMeta(data.meta);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => { load(1, false); }, [load]);

  const loadMore = () => { if (hasNext && !loading) load(page + 1, true); };

  return { items, loading, error, hasNext, loadMore, meta, reload: () => load(1, false) };
}

export function useActiveCard(containerRef) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onScroll = () => {
      const cards = el.querySelectorAll('.feed-card');
      const mid   = el.scrollTop + el.clientHeight / 2;
      cards.forEach((card, i) => {
        const top    = card.offsetTop;
        const bottom = top + card.offsetHeight;
        if (mid >= top && mid < bottom) setActiveIndex(i);
      });
      if (el.scrollTop + el.clientHeight >= el.scrollHeight - 100) {
        el.dispatchEvent(new CustomEvent('feed-near-end'));
      }
    };

    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, [containerRef]);

  return activeIndex;
}
