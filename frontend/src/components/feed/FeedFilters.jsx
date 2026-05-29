import { CATEGORIES } from '../../lib/constants';

export default function FeedFilters({ active, onChange }) {
  return (
    <div className="fixed top-[72px] inset-x-0 z-40 px-4 py-3 bg-gradient-to-b from-black/90 to-transparent">
      <div className="flex gap-2 overflow-x-auto scrollbar-none max-w-lg mx-auto">
        {CATEGORIES.map((cat) => {
          const isActive = active === cat.id;
          return (
            <button key={cat.label} type="button" onClick={() => onChange(cat.id)}
              className={`shrink-0 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                isActive ? 'bg-white text-black shadow-lg' : 'bg-white/10 backdrop-blur-md text-white/80 hover:bg-white/20'
              }`}>
              <span>{cat.emoji}</span>
              {cat.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
