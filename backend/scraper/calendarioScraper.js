const axios = require('axios');
const cheerio = require('cheerio');

const BASE_URL = 'http://www.ciudadbolivar.gov.co';
const CALENDAR_URL = `${BASE_URL}/calendario`;

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'es-CO,es;q=0.9,en;q=0.8',
  'Connection': 'keep-alive',
};

async function getCalendarLinks() {
  const timeout = parseInt(process.env.SCRAPE_TIMEOUT_MS || '10000');

  try {
    const { data } = await axios.get(CALENDAR_URL, { headers: HEADERS, timeout });
    const $ = cheerio.load(data);
    const links = [];

    // El calendario de ciudadbolivar lista eventos con <a> dentro de .view-content o similar
    $('a[href]').each((_, el) => {
      const href = $(el).attr('href');
      const text = $(el).text().trim();

      if (!href || !text) return;

      // Filtramos solo links de eventos/noticias relevantes
      const isEvent =
        href.includes('/eventos/') ||
        href.includes('/noticias/') ||
        href.includes('/convocatorias/') ||
        href.includes('/formacion/');

      if (isEvent) {
        const fullUrl = href.startsWith('http') ? href : `${BASE_URL}${href}`;
        if (!links.find((l) => l.url === fullUrl)) {
          links.push({ url: fullUrl, title: text });
        }
      }
    });

    return links;
  } catch (err) {
    console.error('[calendarioScraper] Error fetching calendar:', err.message);
    return [];
  }
}

module.exports = { getCalendarLinks };
