import { useMemo, useState } from 'react';

export function useSearchFilter(items) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return items;
    const q = query.toLowerCase();
    return items.filter(
      (item) =>
        item.title?.toLowerCase().includes(q) ||
        item.description?.toLowerCase().includes(q) ||
        item.source?.toLowerCase().includes(q) ||
        item.tags?.some((t) => t.toLowerCase().includes(q)),
    );
  }, [items, query]);

  return { query, setQuery, filtered };
}
