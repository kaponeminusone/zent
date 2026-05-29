import { categoryLabel, formatDate } from '../lib/constants';
import { IconExternal, IconPin } from './icons';

export function FeedCard({ item }) {
  return (
    <article className="feed-card border-b border-line bg-white py-3">
      <div className="relative h-[196px] overflow-hidden rounded-xl bg-soft">
        <img src={item.image} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-black/5" />

        <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2.5 py-0.5 text-[10px] font-semibold">
          {categoryLabel(item.category)}
        </span>
      </div>

      <div className="pt-2">
        <div className="flex items-start justify-between gap-2">
          <h2 className="line-clamp-2 text-[13px] font-semibold leading-snug">{item.title}</h2>
          <span className="shrink-0 text-[10px] font-bold text-muted">{item.source?.slice(0, 4)}</span>
        </div>

        <p className="mt-1 flex items-center gap-1 text-[10px] text-black/70">
          <IconPin size={10} />
          <span className="truncate">{item.source}</span>
        </p>

        <p className="mt-1.5 line-clamp-2 text-[11px] leading-[16px] text-black/65">{item.description}</p>

        <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1 text-[10px]">
          <span>
            <strong className="underline">{formatDate(item.date)}</strong>
            <span className="text-muted"> · publicado</span>
          </span>
          {item.closingDate && (
            <span className="text-muted">
              Cierre <strong className="text-black underline">{formatDate(item.closingDate)}</strong>
            </span>
          )}
        </div>

        {item.tags?.length > 0 && (
          <p className="mt-1 truncate text-[10px] text-muted">{item.tags.slice(0, 3).join(' · ')}</p>
        )}

        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold underline"
        >
          Fuente oficial <IconExternal size={10} />
        </a>
      </div>
    </article>
  );
}
