import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

// En este proyecto standalone Link apunta al frontend en :5173
const Link = ({ to, children, className, ...props }) => (
  <a href={`http://localhost:5173${to}`} className={className} {...props}>{children}</a>
);

// ─── Datos ───────────────────────────────────────────────────────────────────
const TEAM = ['Integrante 1', 'Integrante 2', 'Integrante 3', 'Integrante 4'];

const STATS = [
  { value: '14–28', label: 'años elegibles' },
  { value: '+200',  label: 'oportunidades dispersas' },
  { value: '0',     label: 'plataformas que las unan' },
];

const CATEGORIES = [
  { emoji: '🎓', name: 'Becas',         color: '#a78bfa' },
  { emoji: '📢', name: 'Convocatorias', color: '#38bdf8' },
  { emoji: '📚', name: 'Formaciones',   color: '#34d399' },
  { emoji: '🎉', name: 'Eventos',       color: '#f472b6' },
];

const SOURCES = ['ICETEX', 'SENA', 'MinTIC', 'MinEducación', 'MinCiencias', 'IDARTES', 'Colfuturo'];

const TOTAL = 4;

// ─── Hook de scroll controlado ───────────────────────────────────────────────
function useControlledScroll(innerRef) {
  const current    = useRef(0);
  const animating  = useRef(false);
  const [index, setIndex] = useState(0);
  const touchY     = useRef(0);

  const goTo = useCallback((next) => {
    if (animating.current) return;
    const clamped = Math.max(0, Math.min(TOTAL - 1, next));
    if (clamped === current.current) return;

    animating.current = true;
    current.current   = clamped;
    setIndex(clamped);

    gsap.to(innerRef.current, {
      y: -clamped * window.innerHeight,
      duration: 0.85,
      ease: 'power2.inOut',
      onComplete: () => { animating.current = false; },
    });
  }, [innerRef]);

  const next = useCallback(() => goTo(current.current + 1), [goTo]);
  const prev = useCallback(() => goTo(current.current - 1), [goTo]);

  // Wheel
  useEffect(() => {
    const onWheel = (e) => {
      e.preventDefault();
      if (e.deltaY > 0) next(); else prev();
    };
    window.addEventListener('wheel', onWheel, { passive: false });
    return () => window.removeEventListener('wheel', onWheel);
  }, [next, prev]);

  // Teclado
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'PageDown') next();
      if (e.key === 'ArrowUp'   || e.key === 'PageUp')   prev();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  // Touch
  useEffect(() => {
    const onStart = (e) => { touchY.current = e.touches[0].clientY; };
    const onEnd   = (e) => {
      const delta = touchY.current - e.changedTouches[0].clientY;
      if (Math.abs(delta) > 40) { if (delta > 0) next(); else prev(); }
    };
    window.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchend',   onEnd,   { passive: true });
    return () => {
      window.removeEventListener('touchstart', onStart);
      window.removeEventListener('touchend',   onEnd);
    };
  }, [next, prev]);

  return { index, goTo, next, prev };
}

// ─── Dots de navegación ───────────────────────────────────────────────────────
function NavDots({ index, goTo }) {
  return (
    <div className="fixed right-5 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-3">
      {Array.from({ length: TOTAL }).map((_, i) => (
        <button
          key={i}
          onClick={() => goTo(i)}
          aria-label={`Sección ${i + 1}`}
          className="w-2 h-2 rounded-full transition-all duration-300"
          style={{
            background: i === index ? 'rgba(167,139,250,0.9)' : 'rgba(255,255,255,0.2)',
            transform:  i === index ? 'scale(1.4)' : 'scale(1)',
          }}
        />
      ))}
    </div>
  );
}

// ─── HERO ─────────────────────────────────────────────────────────────────────
function HeroSection({ isActive, onNext }) {
  const secRef  = useRef(null);
  const played  = useRef(false);

  useEffect(() => {
    if (!isActive || played.current) return;
    played.current = true;

    const dirs = [
      { x: -220, y: -100, rotate: -25 },
      { x:  -80, y: -200, rotate:  18 },
      { x:   80, y:  200, rotate: -18 },
      { x:  220, y: -100, rotate:  25 },
    ];
    secRef.current.querySelectorAll('.hero-letter').forEach((el, i) => {
      gsap.from(el, { ...dirs[i], opacity: 0, duration: 1.1, ease: 'back.out(1.5)', delay: 0.1 + i * 0.1 });
    });
    gsap.from('.hero-line',  { scaleX: 0,    duration: 0.9,  ease: 'power3.out',  delay: 0.6, transformOrigin: 'left' });
    gsap.from('.hero-sub',   { opacity: 0, y: 28, duration: 0.7,  ease: 'power2.out',  delay: 0.7 });
    gsap.from('.hero-name',  { opacity: 0, y: 20, stagger: 0.09, duration: 0.5, ease: 'power2.out', delay: 0.9 });
    gsap.from('.hero-arrow', { opacity: 0, y: -10, duration: 0.6, delay: 1.4 });
    gsap.to('.hero-arrow',   { y: 10, duration: 0.9, ease: 'sine.inOut', repeat: -1, yoyo: true, delay: 1.9 });
    gsap.to('.hero-glow',    { scale: 1.2, opacity: 0.5, duration: 3.5, ease: 'sine.inOut', repeat: -1, yoyo: true });
  }, [isActive]);

  return (
    <section ref={secRef} className="landing-section">
      <div className="hero-glow glow-violet w-[700px] h-[700px] -top-40 left-1/2 -translate-x-1/2" />
      <div className="glow-cyan   w-[300px] h-[300px] bottom-10 right-10 opacity-40" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-5xl mx-auto">
        <div className="flex gap-3 sm:gap-6 mb-8 select-none" aria-label="ZENT">
          {'ZENT'.split('').map((ch, i) => (
            <span key={i} className="hero-letter font-display font-extrabold leading-none grad-text"
              style={{ fontSize: 'clamp(5rem, 18vw, 11rem)', display: 'inline-block' }}>
              {ch}
            </span>
          ))}
        </div>

        <div className="hero-line w-full max-w-sm h-px bg-gradient-to-r from-transparent via-white/20 to-transparent mb-6" />
        <p className="hero-sub text-sm sm:text-base text-white/40 tracking-[0.3em] uppercase mb-14 font-light">
          Oportunidades que te encuentran
        </p>

        <div className="flex flex-wrap justify-center gap-x-8 gap-y-1">
          {TEAM.map((name, i) => (
            <span key={i} className="hero-name text-xs text-white/25 tracking-[0.2em] uppercase">{name}</span>
          ))}
        </div>
      </div>

      <button
        onClick={onNext}
        className="hero-arrow absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 opacity-30 hover:opacity-60 transition-opacity cursor-pointer"
        aria-label="Siguiente sección"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5}>
          <path d="M12 5v14M5 12l7 7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </section>
  );
}

// ─── PROBLEMA ─────────────────────────────────────────────────────────────────
function ProblemSection({ isActive }) {
  const secRef = useRef(null);
  const played = useRef(false);

  useEffect(() => {
    if (!isActive || played.current) return;
    played.current = true;

    const el = secRef.current;
    gsap.from(el.querySelectorAll('.prob-eyebrow'), { opacity: 0, y: 20, duration: 0.5 });
    gsap.from(el.querySelectorAll('.prob-line'),    { opacity: 0, y: 50, stagger: 0.15, duration: 0.8, ease: 'power3.out', delay: 0.1 });
    gsap.from(el.querySelectorAll('.prob-stat'),    { opacity: 0, y: 40, scale: 0.85, stagger: 0.15, duration: 0.7, ease: 'back.out(1.3)', delay: 0.3 });
    gsap.from(el.querySelectorAll('.prob-quote'),   { opacity: 0, x: -30, duration: 0.7, ease: 'power2.out', delay: 0.6 });
  }, [isActive]);

  return (
    <section ref={secRef} className="landing-section">
      <div className="glow-pink   w-[500px] h-[500px] bottom-0 right-0  opacity-50" />
      <div className="glow-violet w-[350px] h-[350px] top-10  left-0   opacity-25" />

      <div className="relative z-10 w-full max-w-4xl mx-auto px-6 sm:px-10">
        <p className="prob-eyebrow text-xs uppercase tracking-[0.3em] text-white/30 mb-5">El problema</p>
        <h2 className="font-display font-extrabold leading-[1.05] mb-12"
            style={{ fontSize: 'clamp(2.5rem, 7vw, 5rem)' }}>
          <span className="prob-line block">La información</span>
          <span className="prob-line block grad-text-warm">existe.</span>
          <span className="prob-line block text-white/50">Los jóvenes, no llegan.</span>
        </h2>

        <div className="grid grid-cols-3 gap-4 sm:gap-8 mb-12">
          {STATS.map((s, i) => (
            <div key={i} className="prob-stat text-center">
              <p className="font-display font-extrabold grad-text mb-1"
                 style={{ fontSize: 'clamp(1.6rem, 5vw, 3.5rem)' }}>{s.value}</p>
              <p className="text-[10px] sm:text-xs text-white/30 uppercase tracking-widest">{s.label}</p>
            </div>
          ))}
        </div>

        <blockquote className="prob-quote border-l-2 border-white/10 pl-5 max-w-2xl">
          <p className="text-sm sm:text-base text-white/35 italic leading-relaxed">
            "Los espacios están en todos los centros… pero cada vez menos jóvenes se presentan. No porque no existan, sino porque no hay acceso a esa información."
          </p>
        </blockquote>
      </div>
    </section>
  );
}

// ─── SOLUCIÓN ─────────────────────────────────────────────────────────────────
function SolutionSection({ isActive }) {
  const secRef = useRef(null);
  const played = useRef(false);

  useEffect(() => {
    if (!isActive || played.current) return;
    played.current = true;

    const el = secRef.current;
    gsap.from(el.querySelectorAll('.sol-eyebrow'), { opacity: 0, y: 20, duration: 0.5 });
    gsap.from(el.querySelectorAll('.sol-line'),    { opacity: 0, x: -50, stagger: 0.15, duration: 0.8, ease: 'power3.out', delay: 0.1 });
    gsap.from(el.querySelectorAll('.sol-cat'),     { opacity: 0, x: -30, stagger: 0.1,  duration: 0.5, delay: 0.4 });
    const phone = el.querySelector('.sol-phone');
    gsap.fromTo(phone,
      { opacity: 0, y: 60, scale: 0.88, filter: 'blur(8px)' },
      { opacity: 1, y: 0,  scale: 1,    filter: 'blur(0px)', duration: 1.1, ease: 'power3.out', delay: 0.2,
        onComplete: () => {
          gsap.to(phone, { y: -10, duration: 2.8, ease: 'sine.inOut', repeat: -1, yoyo: true });
        },
      }
    );
  }, [isActive]);

  return (
    <section ref={secRef} className="landing-section">
      <div className="glow-violet w-[500px] h-[500px] top-0    left-1/4 opacity-35" />
      <div className="glow-cyan   w-[400px] h-[400px] bottom-0 right-10 opacity-25" />

      <div className="relative z-10 w-full max-w-5xl mx-auto px-6 sm:px-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
        <div className="flex-1 min-w-0">
          <p className="sol-eyebrow text-xs uppercase tracking-[0.3em] text-white/30 mb-5">La solución</p>
          <h2 className="font-display font-extrabold leading-[1.05] mb-10"
              style={{ fontSize: 'clamp(2.4rem, 6.5vw, 4.8rem)' }}>
            <span className="sol-line block">Un scroll.</span>
            <span className="sol-line block grad-text">Todo lo que</span>
            <span className="sol-line block">necesitas.</span>
          </h2>
          <div className="space-y-4">
            {CATEGORIES.map((cat, i) => (
              <div key={i} className="sol-cat flex items-center gap-3">
                <span className="text-xl">{cat.emoji}</span>
                <span className="text-sm sm:text-base font-semibold" style={{ color: cat.color }}>{cat.name}</span>
                <span className="text-white/20 text-xs">· fuentes oficiales</span>
              </div>
            ))}
          </div>
        </div>

        {/* Screenshot — ya incluye el teléfono */}
        <img
          src="/aplicacion.png"
          alt="Zent app"
          className="sol-phone shrink-0 max-h-[75vh] w-auto object-contain drop-shadow-2xl"
          draggable={false}
        />
      </div>
    </section>
  );
}

// ─── IMPACTO ──────────────────────────────────────────────────────────────────
function ImpactSection({ isActive }) {
  const secRef = useRef(null);
  const played = useRef(false);

  useEffect(() => {
    if (!isActive || played.current) return;
    played.current = true;

    const el = secRef.current;
    gsap.from(el.querySelectorAll('.imp-line'),   { opacity: 0, scale: 0.75, stagger: 0.2,  duration: 0.9, ease: 'back.out(1.3)' });
    gsap.from(el.querySelectorAll('.imp-source'), { opacity: 0, y: 15,       stagger: 0.07, duration: 0.4, delay: 0.4 });
    gsap.from(el.querySelectorAll('.imp-cta'),    { opacity: 0, y: 30,                       duration: 0.6, ease: 'power2.out', delay: 0.6 });
    gsap.to(el.querySelector('.imp-glow'),        { scale: 1.3, opacity: 0.55, duration: 4, ease: 'sine.inOut', repeat: -1, yoyo: true });
  }, [isActive]);

  return (
    <section ref={secRef} className="landing-section">
      <div className="imp-glow glow-violet w-[700px] h-[700px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-35" />
      <div className="glow-cyan w-[300px] h-[300px] top-10    right-10 opacity-15" />
      <div className="glow-pink w-[250px] h-[250px] bottom-10 left-10  opacity-15" />

      <div className="relative z-10 flex flex-col items-center text-center px-6 w-full max-w-3xl mx-auto">
        <h2 className="font-display font-extrabold leading-[1.0] mb-12"
            style={{ fontSize: 'clamp(3.5rem, 12vw, 7.5rem)' }}>
          <span className="imp-line block">El cambio</span>
          <span className="imp-line block grad-text">es un scroll.</span>
        </h2>

        <div className="flex flex-wrap justify-center gap-x-5 gap-y-2 mb-12">
          {SOURCES.map((s) => (
            <span key={s} className="imp-source text-xs text-white/20 uppercase tracking-[0.2em]">{s}</span>
          ))}
        </div>

        <Link to="/feed"
          className="imp-cta inline-flex items-center gap-3 rounded-full bg-white text-black px-8 py-4 text-sm font-bold hover:bg-zinc-100 active:scale-[0.97] transition-all shadow-2xl shadow-white/10">
          Explorar oportunidades
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
            <path d="M5 12h14M12 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </Link>

        <p className="mt-8 text-[11px] text-white/15 tracking-widest uppercase">
          Fuentes oficiales · No reemplaza las páginas originales
        </p>
      </div>
    </section>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const innerRef = useRef(null);
  const { index, goTo, next } = useControlledScroll(innerRef);

  useEffect(() => {
    document.body.style.background = '#07070a';
    return () => { document.body.style.background = ''; };
  }, []);

  return (
    <div className="landing-root" style={{ overflow: 'hidden' }}>
      {/* Pila de secciones — se desplaza por translateY */}
      <div ref={innerRef} style={{ willChange: 'transform' }}>
        <HeroSection     isActive={index === 0} onNext={next} />
        <ProblemSection  isActive={index === 1} />
        <SolutionSection isActive={index === 2} />
        <ImpactSection   isActive={index === 3} />
      </div>

      <NavDots index={index} goTo={goTo} />
    </div>
  );
}
