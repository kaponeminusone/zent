import { CATEGORY_STYLES, categoryLabel, formatDate } from '../../lib/constants';

export default function FeedCard({ item, isActive }) {
  const style = CATEGORY_STYLES[item.category] || CATEGORY_STYLES.evento;

  return (
    <article
      className={`feed-card relative w-full shrink-0 overflow-hidden bg-black ${isActive ? 'ring-2 ring-violet-500/50 ring-inset' : ''}`}
      style={{ height: '100%', minHeight: '100%' }}
      data-id={item.id}
    >
      <img src={item.image} alt="" className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/20" />

      {/* Side actions */}
      <div className="absolute right-4 bottom-36 flex flex-col gap-5 items-center z-10">
        <button type="button" className="flex flex-col items-center gap-1 text-white/90 hover:scale-110 transition-transform">
          <span className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-lg">♡</span>
        </button>
        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer"
          className="flex flex-col items-center gap-1 text-white/90 hover:scale-110 transition-transform">
          <span className="w-11 h-11 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-lg">↗</span>
          <span className="text-[10px] font-medium">Fuente</span>
        </a>
        {item.scraped && <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-lg shadow-emerald-400/50" title="En vivo" />}
      </div>

      {/* Content overlay */}
      <div className="absolute bottom-0 inset-x-0 p-5 pb-28 z-10 max-w-2xl">
        <div className="flex items-center gap-2 mb-3">
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider ${style.bg} ${style.text} ${style.border}`}>
            {categoryLabel(item.category)}
          </span>
          {item.scraped && <span className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider">En vivo</span>}
        </div>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
            {item.source.charAt(0)}
          </div>
          <span className="text-sm font-semibold text-white">{item.source}</span>
          <span className="text-zinc-500 text-xs">· {formatDate(item.date)}</span>
        </div>

        <h2 className="font-display font-bold text-xl sm:text-2xl leading-tight mb-2 text-white">{item.title}</h2>
        <p className="text-sm text-zinc-300 leading-relaxed line-clamp-3 mb-3">{item.description}</p>

        {item.closingDate && (
          <p className="text-xs text-amber-300/90 mb-3">Cierre: {formatDate(item.closingDate)}</p>
        )}

        <div className="flex flex-wrap gap-1.5 mb-4">
          {item.tags?.slice(0, 4).map((tag) => (
            <span key={tag} className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] text-zinc-400">#{tag}</span>
          ))}
        </div>

        <a href={item.sourceUrl} target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-white text-black px-5 py-2.5 text-sm font-semibold hover:bg-zinc-100 transition-colors">
          Ver en fuente oficial
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      </div>
    </article>
  );
}
