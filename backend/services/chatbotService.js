const Groq = require('groq-sdk');
const { getFeedSummary } = require('./feedService');

let groqClient = null;

function initGroq() {
  if (!process.env.GROQ_API_KEY) return false;
  try {
    groqClient = new Groq({ apiKey: process.env.GROQ_API_KEY });
    return true;
  } catch (err) {
    console.error('[chatbot] Error inicializando Groq:', err.message);
    return false;
  }
}

function buildSystemPrompt(feedSummary) {
  const lines = feedSummary
    .slice(0, 30)
    .map(
      (item, i) =>
        `${i + 1}. [${item.category.toUpperCase()}] "${item.title}" — Fuente: ${item.source} | Fecha: ${item.date} | URL: ${item.sourceUrl || 'N/A'}`,
    )
    .join('\n');

  return `Eres Zent, asistente virtual de la plataforma Zent que ayuda a jóvenes colombianos a encontrar oportunidades educativas.

Reglas:
- Responde en español, tono amigable y directo.
- Máximo 3 párrafos cortos por respuesta.
- Siempre incluye la URL de la fuente original cuando sea relevante.
- No inventes información. Si no sabes, dilo claramente.
- Redirige siempre al usuario a la fuente oficial para postularse.

Oportunidades disponibles en Zent ahora mismo:
${lines}`;
}

async function chatWithGroq(userMessage, history) {
  const feedSummary = getFeedSummary();
  const systemPrompt = buildSystemPrompt(feedSummary);

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.map((m) => ({ role: m.role === 'model' ? 'assistant' : 'user', content: m.content })),
    { role: 'user', content: userMessage },
  ];

  const completion = await groqClient.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages,
    max_tokens: 500,
    temperature: 0.7,
  });

  return completion.choices[0].message.content;
}

function smartFallback(userMessage, feedSummary) {
  const lower = userMessage.toLowerCase();

  const matches = feedSummary.filter((item) => {
    const text = `${item.title} ${item.category} ${item.source} ${(item.tags || []).join(' ')}`.toLowerCase();
    const words = lower.split(/\s+/).filter((w) => w.length > 3);
    return words.some((w) => text.includes(w));
  });

  if (matches.length > 0) {
    const list = matches
      .slice(0, 3)
      .map((item) => `• **${item.title}** (${item.source}) → ${item.sourceUrl}`)
      .join('\n');
    return `Encontré estas oportunidades relacionadas con tu pregunta:\n\n${list}\n\nPara más detalles, visita los links de las fuentes oficiales.`;
  }

  if (lower.includes('beca')) {
    const becas = feedSummary.filter((i) => i.category === 'beca').slice(0, 3);
    const list = becas.map((i) => `• ${i.title} — ${i.source}`).join('\n');
    return `Tenemos estas becas disponibles en el feed:\n\n${list}\n\nExplóralas en la sección Becas del feed para ver fechas y requisitos.`;
  }

  if (lower.includes('sena') || lower.includes('formaci') || lower.includes('curso') || lower.includes('taller')) {
    const forms = feedSummary.filter((i) => i.category === 'formacion').slice(0, 3);
    const list = forms.map((i) => `• ${i.title} — ${i.source}`).join('\n');
    return `Formaciones disponibles en Zent:\n\n${list}\n\nVe a la sección Formaciones para ver más detalles.`;
  }

  if (lower.includes('convocatoria') || lower.includes('inscripci') || lower.includes('joven')) {
    const convs = feedSummary.filter((i) => i.category === 'convocatoria').slice(0, 3);
    const list = convs.map((i) => `• ${i.title} — ${i.source}`).join('\n');
    return `Convocatorias abiertas en el feed:\n\n${list}\n\nRevisa las fechas de cierre en cada una.`;
  }

  if (lower.includes('evento') || lower.includes('festival') || lower.includes('actividad')) {
    const eventos = feedSummary.filter((i) => i.category === 'evento').slice(0, 3);
    const list = eventos.map((i) => `• ${i.title} — ${i.source}`).join('\n');
    return `Eventos disponibles:\n\n${list}`;
  }

  const total = feedSummary.length;
  const cats = { beca: 0, convocatoria: 0, formacion: 0, evento: 0 };
  feedSummary.forEach((i) => { if (cats[i.category] !== undefined) cats[i.category]++; });

  return `¡Hola! Soy Zent, tu asistente de oportunidades educativas. Actualmente tenemos **${total} oportunidades** en el feed:\n\n• 🎓 Becas: ${cats.beca}\n• 📢 Convocatorias: ${cats.convocatoria}\n• 📚 Formaciones: ${cats.formacion}\n• 🎉 Eventos: ${cats.evento}\n\nPregúntame sobre alguna categoría específica o usa los filtros del feed para explorar.`;
}

async function chat(userMessage, conversationHistory = []) {
  if (!groqClient) initGroq();

  const feedSummary = getFeedSummary();
  const relatedItems = findRelatedItems(userMessage, feedSummary);

  if (groqClient) {
    try {
      const reply = await chatWithGroq(userMessage, conversationHistory);
      return { reply, relatedItems: relatedItems.slice(0, 3), error: null };
    } catch (err) {
      console.error('[chatbot] Groq error:', err.message);
      return {
        reply: smartFallback(userMessage, feedSummary),
        relatedItems: relatedItems.slice(0, 3),
      };
    }
  }

  return {
    reply: smartFallback(userMessage, feedSummary),
    relatedItems: relatedItems.slice(0, 3),
  };
}

function findRelatedItems(userMessage, feedSummary) {
  const lower = userMessage.toLowerCase();
  const keywords = lower.split(/\s+/).filter((w) => w.length > 3);
  return feedSummary.filter((item) => {
    const text = `${item.title} ${item.category} ${item.source}`.toLowerCase();
    return keywords.some((kw) => text.includes(kw));
  });
}

function initGemini() { return initGroq(); }

module.exports = { chat, initGemini, initGroq };
