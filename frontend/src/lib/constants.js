export const PITCH =
  'Zent es el feed de oportunidades que los jóvenes sí abren: becas, convocatorias, formaciones y eventos de fuentes oficiales, en un scroll visual como Instagram, con un asistente que te orienta y te lleva a la información original.';

export const SHORT_DESCRIPTION =
  'Plataforma que unifica oportunidades educativas colombianas en un feed dinámico, con imágenes de referencia y chatbot de orientación conectado a las fuentes oficiales.';

export const CATEGORIES = [
  { id: null,           label: 'Todo',          emoji: '✨' },
  { id: 'beca',         label: 'Becas',          emoji: '🎓' },
  { id: 'convocatoria', label: 'Convocatorias',  emoji: '📢' },
  { id: 'formacion',    label: 'Formaciones',    emoji: '📚' },
  { id: 'evento',       label: 'Eventos',        emoji: '🎉' },
];

export const CATEGORY_STYLES = {
  beca:         { bg: 'bg-violet-500/20',  text: 'text-violet-300',  border: 'border-violet-500/40' },
  convocatoria: { bg: 'bg-cyan-500/20',    text: 'text-cyan-300',    border: 'border-cyan-500/40'   },
  formacion:    { bg: 'bg-emerald-500/20', text: 'text-emerald-300', border: 'border-emerald-500/40'},
  evento:       { bg: 'bg-pink-500/20',    text: 'text-pink-300',    border: 'border-pink-500/40'   },
};

export function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr + 'T12:00:00').toLocaleDateString('es-CO', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
}

export function categoryLabel(category) {
  const map = { beca: 'Beca', convocatoria: 'Convocatoria', formacion: 'Formación', evento: 'Evento' };
  return map[category] || category;
}
