const express = require('express');
const router = express.Router();
const { chat } = require('../services/chatbotService');

// POST /api/chat
// Body: { message: string, history: [{ role: 'user'|'model', content: string }] }
router.post('/', async (req, res) => {
  const { message, history = [] } = req.body;

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return res.status(400).json({ error: 'El campo "message" es requerido.' });
  }

  if (message.length > 1000) {
    return res.status(400).json({ error: 'Mensaje demasiado largo (máx. 1000 caracteres).' });
  }

  try {
    const result = await chat(message.trim(), history);
    res.json({
      reply: result.reply,
      relatedItems: result.relatedItems,
    });
  } catch (err) {
    console.error('[POST /api/chat]', err.message);
    res.status(500).json({ error: 'Error interno del servidor.' });
  }
});

module.exports = router;
