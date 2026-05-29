import { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { isClosingSoon } from '../lib/constants';

export function useFeed({ category, search, filter }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(
    async (nextPage = 1, append = false) => {
      setLoading(true);
      setError('');
      try {
        const data = await api.getFeed({ page: nextPage, limit: 8, category });
        setItems((prev) => (append ? [...prev, ...data.items] : data.items));
        setHasNext(Boolean(data.pagination?.hasNext));
        setMeta(data.meta);
        setPage(nextPage);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    },
    [category],
  );

  useEffect(() => {
    load(1, false);
  }, [load]);

  const filteredItems = useMemo(() => {
    let result = items;
    const q = search.trim().toLowerCase();

    if (q) {
      result = result.filter((item) => {
        const haystack = [
          item.title,
          item.description,
          item.source,
          item.category,
          ...(item.tags || []),
        ]
          .join(' ')
          .toLowerCase();
        return haystack.includes(q);
      });
    }

    if (filter === 'live') result = result.filter((item) => item.scraped);
    if (filter === 'closing') result = result.filter((item) => isClosingSoon(item.closingDate));
    if (filter === 'official') result = result.filter((item) => !item.scraped);

    return result;
  }, [filter, items, search]);

  return {
    items: filteredItems,
    rawCount: items.length,
    page,
    hasNext,
    meta,
    loading,
    error,
    reload: () => load(1, false),
    loadMore: () => {
      if (!loading && hasNext) load(page + 1, true);
    },
  };
}
