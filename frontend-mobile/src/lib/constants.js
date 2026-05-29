export const PLATFORM_NAME = 'Zent';

export const PITCH =
  'Zent convierte becas, convocatorias, formaciones y eventos oficiales en un feed visual, rápido y consultable con un chatbot.';

export const SHORT_DESCRIPTION =
  'Oportunidades educativas de fuentes oficiales, presentadas como una app social móvil.';

export const HERO_IMAGE =
  'https://www.figma.com/api/mcp/asset/d8a96b67-e9fa-4b34-a0d1-124a55a7fe94';

export const CATEGORIES = [
  { id: null, label: 'Todo', short: 'Todo' },
  { id: 'beca', label: 'Becas', short: 'Becas' },
  { id: 'convocatoria', label: 'Convocatorias', short: 'Conv.' },
  { id: 'formacion', label: 'Formación', short: 'Form.' },
  { id: 'evento', label: 'Eventos', short: 'Eventos' },
];

export const SEARCH_FILTERS = [
  { id: 'all', label: 'Todos' },
  { id: 'live', label: 'En vivo' },
  { id: 'closing', label: 'Cierra pronto' },
  { id: 'official', label: 'Oficiales' },
];

export function categoryLabel(category) {
  const labels = {
    beca: 'Beca',
    convocatoria: 'Convocatoria',
    formacion: 'Formación',
    evento: 'Evento',
  };
  return labels[category] || 'Oportunidad';
}

export function formatDate(value) {
  if (!value) return 'Sin fecha';
  return new Date(`${value}T12:00:00`).toLocaleDateString('es-CO', {
    day: 'numeric',
    month: 'short',
  });
}

export function isClosingSoon(value, days = 45) {
  if (!value) return false;
  const close = new Date(`${value}T12:00:00`);
  const diff = (close.getTime() - Date.now()) / (1000 * 60 * 60 * 24);
  return diff >= 0 && diff <= days;
}
