'use client';

import { RefObject, useEffect } from 'react';

export function useParallaxMotion(target: RefObject<HTMLElement>, intensity = 1) {
  useEffect(() => {
    const el = target.current;
    if (!el) return;

    let raf: number | null = null;
    let cx = 0;
    let cy = 0;
    let tx = 0;
    let ty = 0;

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - (r.left + r.width / 2)) / r.width;
      const y = (e.clientY - (r.top + r.height / 2)) / r.height;
      tx = x * 1.5 * intensity;
      ty = y * 1.5 * intensity;
    };

    const animate = () => {
      cx = lerp(cx, tx, 0.08);
      cy = lerp(cy, ty, 0.08);
      el.style.setProperty('--pizza-dx', `${cx}`);
      el.style.setProperty('--royal-dy', `${cy}`);
      raf = requestAnimationFrame(animate);
    };

    animate();
    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', onMove);
    };
  }, [target, intensity]);
}



