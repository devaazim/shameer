import { useCallback, useEffect, useRef, useState } from 'react';
import { TIMELINE } from '../data/timeline.js';
import { getCategory, getFirstImage } from '../data/gallery.js';
import { clamp, prefersReducedMotion, scrollToId } from '../utils/scroll.js';
import { useReveal } from '../hooks/useReveal.js';
import ImageFrame from './ImageFrame.jsx';

function Milestone({ item, index, onOpenGallery }) {
  const ref = useReveal();
  const year = (item.date.match(/\d{4}/) || [''])[0];
  const cat = item.gallery ? getCategory(item.gallery) : null;
  const first = item.gallery ? getFirstImage(item.gallery) : null;
  return (
    <li ref={ref} id={item.id === 'birth' ? 'birth' : undefined} className="tl-item reveal">
      <span className="tl-dot" aria-hidden="true" />
      <span className="tl-year" aria-hidden="true">{year}</span>
      <div className="tl-card">
        <span className="tl-index">{String(index + 1).padStart(2, '0')}</span>
        <h3 className="tl-title">{item.title}</h3>
        <time className="tl-date">{item.date}</time>
        {cat && (
          <button
            type="button"
            className="tl-mini"
            onClick={() => onOpenGallery(cat.id)}
            aria-label={`Open the ${cat.label} gallery`}
          >
            <ImageFrame item={first} className="tl-mini-img" showLabel={false} />
            <span className="tl-mini-cap">
              <b>{cat.label}</b>
              <em>View in gallery →</em>
            </span>
          </button>
        )}
      </div>
    </li>
  );
}

export default function LifeTimeline({ onOpenGallery }) {
  const wrapRef = useRef(null);
  const [warp, setWarp] = useState(null); // { year } while the time-machine overlay is up
  const timers = useRef([]);

  // Scroll-linked fill of the vertical line.
  useEffect(() => {
    const el = wrapRef.current;
    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const p = clamp((vh * 0.62 - r.top) / r.height);
      el.style.setProperty('--tl', p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const teleport = useCallback(() => {
    if (prefersReducedMotion()) {
      scrollToId('birth', { block: 'center' });
      return;
    }
    // Fun-but-elegant time warp: a year counter races back to 1979, we jump behind it.
    const start = 2022;
    const end = 1979;
    const steps = 22;
    setWarp({ year: start });
    for (let i = 1; i <= steps; i += 1) {
      timers.current.push(
        setTimeout(() => setWarp({ year: Math.round(start - ((start - end) * i) / steps) }), i * 38),
      );
    }
    timers.current.push(setTimeout(() => scrollToId('birth', { instant: true, block: 'center' }), steps * 38 + 40));
    timers.current.push(setTimeout(() => setWarp((w) => (w ? { ...w, leaving: true } : w)), steps * 38 + 260));
    timers.current.push(setTimeout(() => setWarp(null), steps * 38 + 760));
  }, []);

  return (
    <section id="timeline" className="sec timeline-sec" aria-labelledby="tl-h">
      <div className="sec-head">
        <p className="eyebrow">THE SHAMEER TIME MACHINE</p>
        <h2 id="tl-h" className="sec-title">A LIFE, IN SEVEN SCENES.</h2>
        <button type="button" className="btn btn-ghost" onClick={teleport}>
          <span aria-hidden="true">⟲</span> TELEPORT TO 1979
        </button>
      </div>

      <div className="tl" ref={wrapRef}>
        <div className="tl-line" aria-hidden="true">
          <span className="tl-line-fill" />
        </div>
        <ol className="tl-list">
          {TIMELINE.map((item, i) => (
            <Milestone key={item.id} item={item} index={i} onOpenGallery={onOpenGallery} />
          ))}
        </ol>
      </div>

      <div className="tl-foot">
        <button type="button" className="btn btn-ghost" onClick={teleport}>
          <span aria-hidden="true">⟲</span> TELEPORT TO 1979
        </button>
      </div>

      {warp && (
        <div className={`warp ${warp.leaving ? 'is-leaving' : ''}`} aria-hidden="true">
          <div className="warp-rings" />
          <div className="warp-year">{warp.year}</div>
          <div className="warp-cap">TIME MACHINE ENGAGED</div>
        </div>
      )}
    </section>
  );
}
