const express = require('express');
const router = express.Router();
const { getCalendarLinks } = require('../scraper/calendarioScraper');
const { scrapeAllEvents } = require('../scraper/eventScraper');
const { setScrapedItems, getScrapedItems } = require('../services/feedService');

// Estado del scrape
let isScraping = false;
let lastScrapeResult = null;

// GET /api/scrape/status — estado del último scrape
router.get('/status', (req, res) => {
  res.json({
    isScraping,
    lastScrapeResult,
    cachedItems: getScrapedItems().length,
  });
});

// POST /api/scrape/run — ejecuta el scraping (async, responde inmediatamente)
router.post('/run', async (req, res) => {
  if (isScraping) {
    return res.status(409).json({ error: 'Ya hay un scraping en curso. Espera a que termine.' });
  }

  const maxEvents = parseInt(req.body?.maxEvents) || 8;

  // Responde inmediatamente y corre en background
  res.json({ message: 'Scraping iniciado.', source: 'ciudadbolivar.gov.co', maxEvents });

  isScraping = true;
  const startedAt = new Date().toISOString();

  try {
    console.log('[scrape] Obteniendo links del calendario...');
    const links = await getCalendarLinks();
    console.log(`[scrape] ${links.length} links encontrados.`);

    const events = await scrapeAllEvents(links, maxEvents);
    console.log(`[scrape] ${events.length} eventos scrapeados.`);

    setScrapedItems(events);

    lastScrapeResult = {
      status: 'success',
      startedAt,
      finishedAt: new Date().toISOString(),
      linksFound: links.length,
      itemsScraped: events.length,
    };
  } catch (err) {
    console.error('[scrape] Error:', err.message);
    lastScrapeResult = {
      status: 'error',
      startedAt,
      finishedAt: new Date().toISOString(),
      error: err.message,
    };
  } finally {
    isScraping = false;
  }
});

// GET /api/scrape/items — devuelve los items scrapeados actuales
router.get('/items', (req, res) => {
  res.json({
    items: getScrapedItems(),
    count: getScrapedItems().length,
  });
});

module.exports = router;
