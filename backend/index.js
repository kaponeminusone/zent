require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initGemini } = require('./services/chatbotService');

const feedRoutes = require('./routes/feed');
const chatRoutes = require('./routes/chat');
const scrapeRoutes = require('./routes/scrape');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/feed', feedRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/scrape', scrapeRoutes);

// Flujo N8N-like (solo lectura del schema)
app.get('/api/pipeline', (req, res) => {
  const pipeline = require('./flow/pipeline.json');
  res.json(pipeline);
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    platform: 'Zent',
    version: '0.1.0',
    timestamp: new Date().toISOString(),
    endpoints: [
      'GET  /api/health',
      'GET  /api/feed?page=1&limit=10&category=beca|convocatoria|formacion|evento',
      'GET  /api/feed/:id',
      'POST /api/chat  { message, history? }',
      'POST /api/scrape/run  { maxEvents? }',
      'GET  /api/scrape/status',
      'GET  /api/scrape/items',
      'GET  /api/pipeline',
    ],
  });
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: `Ruta no encontrada: ${req.method} ${req.path}` });
});

app.listen(PORT, () => {
  console.log(`\n🌐 Zent backend corriendo en http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
  console.log(`   Feed:   http://localhost:${PORT}/api/feed`);
  console.log(`   Chat:   POST http://localhost:${PORT}/api/chat\n`);

  // Inicializa Gemini al arrancar
  const ok = initGemini();
  if (ok) {
    console.log('   Gemini: inicializado correctamente');
  } else {
    console.warn('   Gemini: NO inicializado — revisa GEMINI_API_KEY en .env');
  }
});
