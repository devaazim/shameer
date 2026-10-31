import { createElement, useEffect, useRef, useState } from 'react';

/* One shared IntersectionObserver for every scroll-reveal on the page.
   Elements get a data-in attribute (React never overwrites it). */
let io = null;
const callbacks = new WeakMap();

function getObserver() {
  if (io || typeof IntersectionObserver === 'undefined') return io;
  io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.setAttribute('data-in', '');
        io.unobserve(entry.target);
        const cb = callbacks.get(entry.target);
        if (cb) cb();
      });
    },
    { threshold: 0.18, rootMargin: '0px 0px -6% 0px' },
  );
  return io;
}

/** Attach to an element's ref; adds [data-in] once it scrolls into view. */
export function useReveal(onIn) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const obs = getObserver();
    if (!obs) {
      el.setAttribute('data-in', '');
      return undefined;
    }
    if (onIn) callbacks.set(el, onIn);
    obs.observe(el);
    return () => {
      obs.unobserve(el);
      callbacks.delete(el);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return ref;
}

/** Wrapper component for simple fade-up reveals. */
export function Reveal({ as: Tag = 'div', delay = 0, className = '', children, style, ...rest }) {
  const ref = useReveal();
  return createElement(
    Tag,
    {
      ref,
      className: `reveal ${className}`,
      style: { '--d': `${delay}ms`, ...style },
      ...rest,
    },
    children,
  );
}

/** Live "is this element on screen?" flag (toggles both ways). */
export function useInView(threshold = 0.2) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const obs = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return [ref, visible];
}
