import { useReveal } from '../hooks/useReveal.js';

const QUOTE =
  'Behind every full-marks lecture, porotta craving, and questionable loan decision… there’s only one Shameer KT.';

export default function Ending({ onRestart }) {
  const ref = useReveal();
  const words = QUOTE.split(' ');
  return (
    <section id="ending" className="sec ending" aria-labelledby="end-h">
      <div ref={ref} className="ending-inner reveal-words">
        <p className="eyebrow">THE END · OR IS IT?</p>
        <h2 id="end-h" className="ending-quote">
          <span className="sr-only">{QUOTE}</span>
          <span aria-hidden="true">
            {words.map((w, i) => (
              <span key={i} className="w" style={{ '--i': i }}>
                {w}{' '}
              </span>
            ))}
          </span>
        </h2>
        <button type="button" className="btn btn-gold btn-lg ending-btn" onClick={onRestart}>
          RESTART SHAMEER EXPERIENCE ↻
        </button>
      </div>
    </section>
  );
}
