const axios = require('axios');
const cheerio = require('cheerio');
const { v4: uuidv4 } = require('uuid');
const { getImageByCategory } = require('../data/images');

const BASE_URL = 'http://www.ciudadbolivar.gov.co';

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'es-CO,es;q=0.9,en;q=0.8',
};

function detectCategory(url, title, body) {
  const text = `${url} ${title} ${body}`.toLowerCase();
  if (text.includes('beca') || text.includes('scholarship')) return 'beca';
  if (text.includes('convocatoria') || text.includes('inscripci')) return 'convocatoria';
  if (text.includes('formaci') || text.includes('taller') || text.includes('curso') || text.includes('capacitaci')) return 'formacion';
  return 'evento';
}

function extractDate($) {
  // Intentamos varios selectores comunes en Drupal (CMS de ciudadbolivar)
  const selectors = [
    'span.date-display-single',
    '.field--name-field-fecha',
    '.field-name-field-fecha',
    'time[datetime]',
    '.event-date',
    '.fecha',
  ];
  for (const sel of selectors) {
    const val = $(sel).first().text().trim() || $(sel).first().attr('datetime');
    if (val) return val;
  }
  return null;
}

function extractBody($) {
  const selectors = [
    '.field--name-body',
    '.field-name-body',
    '.node__content p',
    'article p',
    '.content p',
  ];
  for (const sel of selectors) {
    const val = $(sel).first().text().trim();
    if (val && val.length > 20) return val.slice(0, 400);
  }
  // fallback: primer párrafo con texto útil
  let found = '';
  $('p').each((_, el) => {
    const t = $(el).text().trim();
    if (!found && t.length > 30) found = t.slice(0, 400);
  });
  return found || 'Sin descripción disponible.';
}

function extractTitle($, fallback) {
  return (
    $('h1').first().text().trim() ||
    $('title').text().trim() ||
    fallback
  );
}

async function scrapeEvent({ url, title: linkTitle }) {
  const timeout = parseInt(process.env.SCRAPE_TIMEOUT_MS || '10000');
  try {
    const { data } = await axios.get(url, { headers: HEADERS, timeout });
    const $ = cheerio.load(data);

    const title = extractTitle($, linkTitle);
    const description = extractBody($);
    const dateRaw = extractDate($);
    const category = detectCategory(url, title, description);

    return {
      id: uuidv4(),
      title,
      description,
      category,
      source: 'Alcaldía Ciudad Bolívar',
      sourceUrl: url,
      date: dateRaw || new Date().toISOString().split('T')[0],
      image: getImageByCategory(category),
      tags: ['oficial', 'bogotá', category],
      scraped: true,
    };
  } catch (err) {
    console.error(`[eventScraper] Error scraping ${url}:`, err.message);
    return null;
  }
}

async function scrapeAllEvents(links, maxEvents = 10) {
  const results = [];
  const limited = links.slice(0, maxEvents);

  for (const link of limited) {
    const event = await scrapeEvent(link);
    if (event) results.push(event);
    // Pausa corta para no saturar el servidor
    await new Promise((r) => setTimeout(r, 600));
  }

  return results;
}

module.exports = { scrapeAllEvents, scrapeEvent };
