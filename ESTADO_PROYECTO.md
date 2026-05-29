# Zent – Estado del Proyecto
**Fecha:** 2026-05-29 | **Fase:** MVP Prototipo | **Etapa actual:** Backend completo ✅

---

## ¿Qué es Zent?
Plataforma que centraliza oportunidades educativas oficiales (becas, convocatorias, formaciones, eventos) y las presenta en un feed tipo Instagram/Threads con scroll vertical. Incluye chatbot de orientación que redirige a la fuente original.

---

## BACKEND — `backend/` ✅ COMPLETO

### Servidor
- **Node.js + Express** corriendo en `http://localhost:3001`
- CORS habilitado, listo para conectar cualquier frontend

### Scraper (ciudadbolivar.gov.co) — REAL
| Archivo | Función |
|---------|---------|
| `scraper/calendarioScraper.js` | Extrae todos los links de eventos del calendario oficial |
| `scraper/eventScraper.js` | Scrape del detalle de cada evento: título, descripción, fecha, categoría |

- Detecta categoría automáticamente (evento / formación / convocatoria / beca) por keywords en la URL y el contenido
- Pausa entre requests para no saturar el servidor
- Máximo configurable de eventos por scrape

### Datos Mock (fuentes pendientes de scraping real)
| Archivo | Contenido |
|---------|-----------|
| `data/mocks/becas.json` | 5 becas: ICETEX, Colfuturo, Generación E, SENA, IDARTES |
| `data/mocks/convocatorias.json` | 5 convocatorias: Jóvenes en Acción, MinTIC, Fondo Emprender, MinCiencias, IDPAC |
| `data/mocks/formaciones.json` | 5 formaciones: SENA Virtual, Colombia Aprende, MinTIC, IDPAC, SENA Regional |
| `data/images.js` | Pool de URLs Unsplash por categoría (beca / convocatoria / formacion / evento) |

### Servicios
| Archivo | Función |
|---------|---------|
| `services/feedService.js` | Mezcla scraped + mock, normaliza schema, pagina, filtra por categoría |
| `services/chatbotService.js` | Integración Gemini 2.0 Flash Lite + fallback inteligente por keywords |

**Schema normalizado de cada item:**
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "category": "beca | convocatoria | formacion | evento",
  "source": "string",
  "sourceUrl": "string",
  "date": "YYYY-MM-DD",
  "closingDate": "YYYY-MM-DD | null",
  "image": "url (Unsplash)",
  "tags": ["string"],
  "scraped": true | false
}
```

### API REST — Endpoints listos
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/health` | Estado del servidor |
| GET | `/api/feed` | Feed paginado. Params: `?page=1&limit=10&category=beca` |
| GET | `/api/feed/:id` | Item individual por ID |
| POST | `/api/chat` | Chatbot Gemini. Body: `{ message, history? }` |
| POST | `/api/scrape/run` | Lanza scraping de ciudadbolivar. Body: `{ maxEvents? }` |
| GET | `/api/scrape/status` | Estado del último scrape |
| GET | `/api/scrape/items` | Items scrapeados en memoria |
| GET | `/api/pipeline` | Schema del flujo N8N-like |

### Flujo de datos (N8N-like) — `flow/pipeline.json`
```
[ciudadbolivar]──→ ─────────────────────────────┐
[SENA mock]     ──→ [Normalizer] → [Image       │
[MinEducación]  ──→              →  Resolver] → [Feed Store] → /api/feed → Frontend
[ICETEX mock]   ──→                             │
[MinTIC mock]   ──→ ─────────────────────────────┘
                                                      ↓
                                             [Chatbot Gemini]
                                             POST /api/chat
```

### Estado del Chatbot Gemini
- ✅ Key válida y autenticada
- ✅ Modelo `gemini-2.0-flash-lite` configurado
- ⚠️ Cuota free tier agotada — responde con fallback por keywords
- 🔧 Fix: habilitar billing en Google Cloud Console (o esperar reset diario)

---

## FRONTEND — ❌ PENDIENTE

### Stack definido
- React + Vite
- Tailwind CSS
- GSAP (animaciones scroll)

### Pantallas / componentes a construir
| Componente | Descripción | Prioridad |
|------------|-------------|-----------|
| `Feed` | Scroll vertical tipo Instagram, tarjetas de oportunidades | Alta |
| `Card` | Tarjeta individual: imagen, categoría, título, fuente, fecha, botón fuente | Alta |
| `ChatBot` | Widget flotante de chat con Gemini, historial de conversación | Alta |
| `FilterBar` | Filtro por categoría (Becas / Convocatorias / Formaciones / Eventos) | Media |
| `Pipeline View` | Visualización del flujo N8N-like (nodos y conexiones) | Media |
| `ItemDetail` | Vista detalle de una oportunidad (modal o página) | Media |
| `ScrapeStatus` | Indicador de último scrape y botón de actualizar | Baja |

### Comportamientos clave a implementar
- Scroll infinito (carga paginada desde `/api/feed`)
- Animación de entrada de cards con GSAP (stagger)
- Chatbot: al mencionar una oportunidad, muestra card relacionada
- Click en "Ver fuente" → abre `sourceUrl` en nueva pestaña
- Scroll snap o free scroll (pendiente decisión visual del usuario)

---

## PENDIENTE TÉCNICO

| Ítem | Estado | Prioridad |
|------|--------|-----------|
| Frontend completo | ❌ No iniciado | Alta |
| Gemini cuota/billing | ⚠️ Cuota agotada | Alta |
| Scraper SENA (Sofia Plus) | ❌ Mock | Media |
| Scraper MinEducación | ❌ Mock | Media |
| Scraper ICETEX | ❌ Mock | Media |
| Scraper MinTIC | ❌ Mock | Media |
| Base de datos real (PostgreSQL/SQLite) | ❌ En memoria | Baja |
| Cron automático de scraping (cada 6h) | ❌ Solo manual | Baja |
| Auth / usuarios | ❌ No planeado para MVP | Baja |

---

## Cómo correr el backend

```bash
cd backend
npm install      # solo primera vez
npm run dev      # nodemon con hot reload
# o
npm start        # producción
```

Servidor en: `http://localhost:3001`
