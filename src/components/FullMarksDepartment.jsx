import { useEffect, useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal.js';
import { prefersReducedMotion, easeOut } from '../utils/scroll.js';
import { useToast } from './Toast.jsx';

const SUBJECTS = ['Mathematics', 'Science', 'English', 'Malayalam'];

export default function FullMarksDepartment() {
  const toast = useToast();
  const [pct, setPct] = useState(0);
  const [got99, setGot99] = useState(false);
  const [note, setNote] = useState(0);
  const [ring, setRing] = useState(0);
  const raf = useRef(0);

  // "Expectations loading…" — animates 0 → 100 once when the section scrolls into view.
  const ref = useReveal(() => {
    if (prefersReducedMotion()) return setPct(100);
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 3000);
      setPct(Math.round(easeOut(t) * 100));
      if (t < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return undefined;
  });
  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const click99 = () => {
    cancelAnimationFrame(raf.current);
    setGot99(true);
    setPct(99);
    setNote((n) => n + 1);
  };

  // Easter egg #2 — poke the 100/100 target.
  const pokeTarget = () => {
    setRing((r) => r + 1);
    toast('Still not satisfied — Ippa.', { icon: '😐' });
  };

  return (
    <section id="full-marks" className="sec funny fullmarks" aria-labelledby="fm-h">
      <div className="fm" ref={ref}>
        <div className="sec-head reveal">
          <p className="eyebrow">EXAMINATION CELL</p>
          <h3 id="fm-h" className="sec-title">THE FULL-MARKS DEPARTMENT</h3>
        </div>

        <div className="fm-grid reveal" style={{ '--d': '120ms' }}>
          <div className="fm-panel result">
            <span className="label">EXAM RESULT PANEL</span>
            <button type="button" className="target" onClick={pokeTarget} aria-label="Target score: 100 out of 100. Tap me.">
              <span key={ring} className={ring ? 'target-ring pulse' : 'target-ring'} />
              <b>100<small>/100</small></b>
              <span className="target-cap">TARGET</span>
            </button>

            <div className="progress">
              <div className="meter-row">
                <span>Your father’s expectations are loading…</span>
                <b>{pct}%</b>
              </div>
              <div className="meter-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Expectations loading">
                <span className={`meter-fill ${got99 ? 'red-fill' : 'gold-fill'}`} style={{ transform: `scaleX(${pct / 100})` }} />
              </div>
              {got99 && <p className="missing">▲ 99/100 — the missing <b>1</b> has been noted.</p>}
            </div>

            <p className="warning" role="alert">
              <span aria-hidden="true">⚠</span> FULL MARKS OR FAMILY MEETING.
            </p>
          </div>

          <div className="fm-panel card">
            <span className="label">REPORT CARD · FICTIONAL</span>
            <table className="report">
              <thead>
                <tr><th scope="col">Subject</th><th scope="col">Expected</th><th scope="col">Obtained</th></tr>
              </thead>
              <tbody>
                {SUBJECTS.map((s, i) => (
                  <tr key={s}>
                    <th scope="row">{s}</th>
                    <td>100</td>
                    <td className={got99 && i === 0 ? 'bad' : ''}>{got99 && i === 0 ? '99 ⚠' : got99 ? '100' : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button type="button" className="btn btn-gold" onClick={click99}>
              I GOT 99 MARKS!
            </button>

            <div className="notif-slot" aria-live="polite">
              {note > 0 && (
                <p key={note} className="notif slide-in">
                  <span aria-hidden="true">🔔</span> Interesting. Where did the other ONE go?
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
