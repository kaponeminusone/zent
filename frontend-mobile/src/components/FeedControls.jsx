import { CATEGORIES, SEARCH_FILTERS } from '../lib/constants';
import {
  IconBook,
  IconCalendar,
  IconGraduation,
  IconGrid,
  IconMegaphone,
  IconSearch,
} from './icons';

const categoryIcons = {
  Todo: IconGrid,
  Becas: IconGraduation,
  Convocatorias: IconMegaphone,
  Formación: IconBook,
  Eventos: IconCalendar,
};

export function FeedControls({
  category,
  setCategory,
  search,
  setSearch,
  filter,
  setFilter,
}) {
  return (
    <div className="shrink-0 bg-white shadow-[0_0.5px_0_rgba(0,0,0,0.08)]">
      <div className="mx-3 mt-1.5 flex h-9 items-center gap-2 rounded-full border border-line px-3">
        <IconSearch size={13} />
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Buscar oportunidades..."
          className="min-w-0 flex-1 bg-transparent text-[12px] font-medium outline-none placeholder:text-muted"
        />
      </div>

      <div className="mobile-scroll flex gap-4 px-3 py-2">
        {CATEGORIES.map((item) => {
          const active = category === item.id;
          const Icon = categoryIcons[item.label] || IconGrid;
          return (
            <button
              key={item.label}
              type="button"
              onClick={() => setCategory(item.id)}
              className="min-w-[52px] shrink-0 text-center"
            >
              <span className={`mx-auto flex justify-center ${active ? 'text-black' : 'text-muted'}`}>
                <Icon active={active} />
              </span>
              <span className={`mt-1 block text-[10px] font-semibold ${active ? 'text-black' : 'text-muted'}`}>
                {item.short}
              </span>
              <span className={`mx-auto mt-1 block h-0.5 w-8 rounded-full ${active ? 'bg-black' : 'bg-transparent'}`} />
            </button>
          );
        })}
      </div>

      <div className="mobile-scroll flex gap-1.5 px-3 pb-2">
        {SEARCH_FILTERS.map((item) => {
          const active = filter === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${
                active ? 'border-black bg-black text-white' : 'border-line bg-white text-muted'
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
