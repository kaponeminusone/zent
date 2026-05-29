// Unsplash photo IDs confiables por categoría (formato: https://images.unsplash.com/photo-{id})
const IMAGE_POOLS = {
  beca: [
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80',
    'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?w=800&q=80',
    'https://images.unsplash.com/photo-1548544149-4ab8f5c2cd7e?w=800&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80',
  ],
  convocatoria: [
    'https://images.unsplash.com/photo-1529390079861-591de354faf5?w=800&q=80',
    'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?w=800&q=80',
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
    'https://images.unsplash.com/photo-1506784365847-bbad939e9335?w=800&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
  ],
  formacion: [
    'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
    'https://images.unsplash.com/photo-1560523159-6b681a1e1852?w=800&q=80',
    'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80',
    'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80',
  ],
  evento: [
    'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&q=80',
    'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80',
    'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80',
    'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&q=80',
  ],
};

const counters = { beca: 0, convocatoria: 0, formacion: 0, evento: 0 };

function getImageByCategory(category) {
  const cat = IMAGE_POOLS[category] ? category : 'evento';
  const pool = IMAGE_POOLS[cat];
  const img = pool[counters[cat] % pool.length];
  counters[cat]++;
  return img;
}

module.exports = { getImageByCategory, IMAGE_POOLS };
