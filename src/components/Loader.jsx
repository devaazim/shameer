import { useCallback, useEffect, useRef, useState } from 'react';
import { easeOut, prefersReducedMotion } from '../utils/scroll.js';

const STEPS = [
  [0, 'Loading personality modules'],
  [28, 'Calibrating porotta reserves'],
  [52, 'Raising full-marks expectations'],
  [76, 'Locking rest mode'],
  [94, 'Ready'],
];

/** Cinematic intro. Always skippable (button, Enter or Escape). */
export default function Loader({ onDone }) {
  const [pct, setPct] = useState(0);
  const [leaving, setLeaving] = useState(false);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    setLeaving(true);
    setTimeout(onDone, prefersReducedMotion() ? 0 : 520);
  }, [onDone]);

  useEffect(() => {
    const duration = prefersReducedMotion() ? 500 : 2400;
    const start = performance.now();
    let raf = 0;
    const tick = (now) => {
      // rAF timestamps can be a hair earlier than `start` → clamp to 0..1 (a negative value crashed the page)
      const t = Math.min(1, Math.max(0, (now - start) / duration));
      setPct(Math.floor(easeOut(t) * 100));
      if (t < 1) raf = requestAnimationFrame(tick);
      else finish();
    };
    raf = requestAnimationFrame(tick);
    const onKey = (e) => {
      if (e.key === 'Escape' || e.key === 'Enter') finish();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
    };
  }, [finish]);

  const status = ([...STEPS].reverse().find(([at]) => pct >= at) || STEPS[0])[1];

  return (
    <div className={`loader ${leaving ? 'is-leaving' : ''}`} role="dialog" aria-label="Loading Shameer KT experience">
      <div className="loader-inner">
        <p className="loader-title">
          INITIALIZING SHAMEER OS<span className="loader-dots" aria-hidden="true">…</span>
        </p>
        <div
          className="loader-bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
          aria-label="Loading"
        >
          <span style={{ transform: `scaleX(${pct / 100})` }} />
        </div>
        <p className="loader-meta">
          <span>{status}</span>
          <span>{String(pct).padStart(3, '0')}%</span>
        </p>
      </div>
      <button type="button" className="loader-skip" onClick={finish}>
        SKIP INTRO
      </button>
    </div>
  );
}
