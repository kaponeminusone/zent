const express = require('express');
const router = express.Router();
const { getFeedPage, getFeedItem } = require('../services/feedService');

// GET /api/feed?page=1&limit=10&category=beca
router.get('/', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const category = req.query.category || null;

  if (page < 1 || limit < 1 || limit > 50) {
    return res.status(400).json({ error: 'Parámetros de paginación inválidos.' });
  }

  const result = getFeedPage(page, limit, category);
  res.json(result);
});

// GET /api/feed/:id
router.get('/:id', (req, res) => {
  const item = getFeedItem(req.params.id);
  if (!item) {
    return res.status(404).json({ error: 'Item no encontrado.' });
  }
  res.json(item);
});

module.exports = router;
