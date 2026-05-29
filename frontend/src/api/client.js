const BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || `Error ${res.status}`);
  }
  return res.json();
}

export const api = {
  getFeed: (page = 1, limit = 10, category = null) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (category) params.set('category', category);
    return request(`/api/feed?${params}`);
  },
  getFeedItem: (id) => request(`/api/feed/${id}`),
  sendChat: (message, history = []) =>
    request('/api/chat', { method: 'POST', body: JSON.stringify({ message, history }) }),
  health:      () => request('/api/health'),
  scrapeRun:   (maxEvents = 8) => request('/api/scrape/run', { method: 'POST', body: JSON.stringify({ maxEvents }) }),
  scrapeStatus: () => request('/api/scrape/status'),
  scrapeItems:  () => request('/api/scrape/items'),
  pipeline:     () => request('/api/pipeline'),
};
