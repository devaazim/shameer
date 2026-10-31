import { THOUGHT_PHOTO, MARRIAGE_PHOTO } from '../data/site.js';
import { useReveal } from '../hooks/useReveal.js';

/**
 * EXACTLY TWO photo frames, joined by a string that draws itself.
 *
 *   Frame 1 → "thinking" photo   → set THOUGHT_PHOTO   in  src/data/site.js
 *   Frame 2 → "marriage" photo   → set MARRIAGE_PHOTO  in  src/data/site.js
 *
 * They are blank on purpose until you add your own images. They are NOT filled
 * from the timeline or gallery.
 */
function Frame({ src, label, alt, delay }) {
  const ref = useReveal();
  return (
    <figure ref={ref} className="frame reveal" style={{ '--d': `${delay}ms` }}>
      <div className="frame-box">
        {src ? <img src={src} alt={alt} loading="lazy" decoding="async" /> : <span className="frame-corners" aria-hidden="true" />}
      </div>
      <figcaption className="frame-label">{label}</figcaption>
    </figure>
  );
}

export default function ThoughtToMarriage() {
  const ref = useReveal();
  return (
    <section id="thought" className="sec thought-sec" aria-labelledby="th-h">
      <div className="sec-head">
        <p className="eyebrow">FROM A THOUGHT…</p>
        <h2 id="th-h" className="sec-title">TO A LIFETIME.</h2>
      </div>

      <div className="thought" ref={ref}>
        {/* ── PHOTO 1: "thinking" photo. Add the image path in src/data/site.js (THOUGHT_PHOTO) ── */}
        <Frame src={THOUGHT_PHOTO} label="Thought" alt="Shameer thinking" delay={0} />

        <div className="string" aria-hidden="true">
          {/* Desktop: horizontal thread */}
          <svg className="string-h" viewBox="0 0 200 100">
            <path className="thread" pathLength="1" d="M0 50 C 40 8, 70 92, 100 50 S 160 8, 200 50" />
            <circle className="knot k1" cx="2" cy="50" r="3" />
            <circle className="knot k2" cx="198" cy="50" r="3" />
          </svg>
          {/* Mobile: vertical thread */}
          <svg className="string-v" viewBox="0 0 100 200">
            <path className="thread" pathLength="1" d="M50 0 C 8 40, 92 70, 50 100 S 8 160, 50 200" />
            <circle className="knot k1" cx="50" cy="2" r="3" />
            <circle className="knot k2" cx="50" cy="198" r="3" />
          </svg>
        </div>

        {/* ── PHOTO 2: marriage photo. Add the image path in src/data/site.js (MARRIAGE_PHOTO) ── */}
        <Frame src={MARRIAGE_PHOTO} label="Marriage" alt="Shameer's marriage" delay={650} />
      </div>
    </section>
  );
}
