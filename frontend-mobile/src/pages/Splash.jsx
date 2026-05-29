import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { StatusBar } from '../components/layout';

export default function Splash() {
  const rootRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        defaults: { ease: 'power3.out' },
        onComplete: () => navigate('/feed', { replace: true }),
      });

      tl.from('.loader-z', { autoAlpha: 0, scale: 0.35, rotate: -10, duration: 0.42 })
        .from('.loader-word', { autoAlpha: 0, y: 10, duration: 0.28 }, '-=0.12')
        .to('.loader-z', { scale: 1.1, rotate: 0, duration: 0.24, ease: 'back.out(2)' })
        .to('.loader-z', { scale: 18, opacity: 0, duration: 0.55, ease: 'power3.in' }, '+=0.28')
        .to('.loader-word', { opacity: 0, y: -8, duration: 0.2 }, '<')
        .to('.loader-screen', { backgroundColor: '#ffffff', duration: 0.25 }, '<0.15');
    }, rootRef);

    return () => ctx.revert();
  }, [navigate]);

  return (
    <div ref={rootRef} className="loader-screen relative flex h-full flex-col overflow-hidden bg-black text-white">
      <StatusBar dark />
      <div className="relative flex min-h-0 flex-1 items-center justify-center">
        <div className="loader-z font-logo relative text-[92px] leading-none tracking-[-0.08em]">Z</div>
      </div>
      <p className="loader-word pb-8 text-center text-[10px] font-semibold uppercase tracking-[0.35em] text-white/60">
        Zent
      </p>
    </div>
  );
}
