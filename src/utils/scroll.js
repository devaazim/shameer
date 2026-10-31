export const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const lerp = (a, b, t) => a + (b - a) * t;
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t) => 1 - Math.pow(1 - t, 3);

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** Smoothly scroll to an element id (instant when the visitor prefers reduced motion). */
export function scrollToId(id, { instant = false, block = 'start' } = {}) {
  const el = document.getElementById(id);
  if (!el) return false;
  el.scrollIntoView({
    behavior: instant ? 'instant' : prefersReducedMotion() ? 'auto' : 'smooth',
    block,
  });
  return true;
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
}
