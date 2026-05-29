const BASE_URL = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.error || `Error ${response.status}`);
  }

  return response.json();
}

export const api = {
  health: () => request('/api/health'),

  getFeed: ({ page = 1, limit = 10, category = null } = {}) => {
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (category) params.set('category', category);
    return request(`/api/feed?${params.toString()}`);
  },

  getFeedItem: (id) => request(`/api/feed/${id}`),

  sendChat: (message, history = []) =>
    request('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message, history }),
    }),

  scrapeRun: (maxEvents = 8) =>
    request('/api/scrape/run', {
      method: 'POST',
      body: JSON.stringify({ maxEvents }),
    }),

  scrapeStatus: () => request('/api/scrape/status'),
  scrapeItems: () => request('/api/scrape/items'),
  pipeline: () => request('/api/pipeline'),
};
