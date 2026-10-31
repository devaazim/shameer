import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '../utils/scroll.js';

/** Running film timecode (HH:MM:SS:FF at 24 fps) — purely decorative. Updates ~12×/s, no React re-renders. */
export default function Timecode() {
  const ref = useRef(null);
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const t0 = performance.now();
    const pad = (n) => String(n).padStart(2, '0');
    const id = setInterval(() => {
      const s = (performance.now() - t0) / 1000;
      const ff = Math.floor((s % 1) * 24);
      if (ref.current) ref.current.textContent = `${pad(Math.floor(s / 3600))}:${pad(Math.floor(s / 60) % 60)}:${pad(Math.floor(s) % 60)}:${pad(ff)}`;
    }, 83);
    return () => clearInterval(id);
  }, []);
  return <span ref={ref}>00:00:00:00</span>;
}
