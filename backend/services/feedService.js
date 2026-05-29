const { getImageByCategory } = require('../data/images');

const becasMock = require('../data/mocks/becas.json');
const convocatoriasMock = require('../data/mocks/convocatorias.json');
const formacionesMock = require('../data/mocks/formaciones.json');

// Cache en memoria del último scrape
let scrapedItems = [];
let lastScrapeAt = null;

function setScrapedItems(items) {
  scrapedItems = items;
  lastScrapeAt = new Date().toISOString();
}

function getScrapedItems() {
  return scrapedItems;
}

// Normaliza cualquier item al schema estándar de Zent
function normalize(item) {
  return {
    id: item.id || `item-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    title: item.title || 'Sin título',
    description: item.description || '',
    category: item.category || 'evento',
    source: item.source || 'Fuente oficial',
    sourceUrl: item.sourceUrl || '#',
    date: item.date || new Date().toISOString().split('T')[0],
    closingDate: item.closingDate || null,
    image: item.image || getImageByCategory(item.category || 'evento'),
    tags: item.tags || [],
    scraped: item.scraped || false,
  };
}

// Mezcla mock + scraped, asigna imágenes a los que no tienen, y ordena por fecha desc
function buildFeed() {
  const allMocks = [
    ...becasMock,
    ...convocatoriasMock,
    ...formacionesMock,
  ].map(normalize);

  const allScraped = scrapedItems.map(normalize);

  const combined = [...allScraped, ...allMocks];

  // Ordenar: scraped primero (más recientes), luego mocks por fecha desc
  combined.sort((a, b) => {
    if (a.scraped && !b.scraped) return -1;
    if (!a.scraped && b.scraped) return 1;
    return new Date(b.date) - new Date(a.date);
  });

  return combined;
}

// Paginación simple
function getFeedPage(page = 1, limit = 10, category = null) {
  let feed = buildFeed();

  if (category) {
    feed = feed.filter((item) => item.category === category);
  }

  const total = feed.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const items = feed.slice(offset, offset + limit);

  return {
    items,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    meta: {
      lastScrapeAt,
      scrapedCount: scrapedItems.length,
      mockCount: becasMock.length + convocatoriasMock.length + formacionesMock.length,
    },
  };
}

function getFeedItem(id) {
  return buildFeed().find((item) => item.id === id) || null;
}

function getFeedSummary() {
  const feed = buildFeed();
  return feed.map(({ id, title, category, source, sourceUrl, date, image, scraped }) => ({
    id, title, category, source, sourceUrl, date, image, scraped,
  }));
}

module.exports = {
  buildFeed,
  getFeedPage,
  getFeedItem,
  getFeedSummary,
  setScrapedItems,
  getScrapedItems,
};
