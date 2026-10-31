import { useEffect, useRef, useState } from 'react';
import { useReveal, useInView } from '../hooks/useReveal.js';
import { WORK_TASKS } from '../data/stats.js';
import { prefersReducedMotion } from '../utils/scroll.js';
import { useToast } from './Toast.jsx';

const R = 66;
const C = 2 * Math.PI * R;
const makeTask = (n) => ({ id: n, text: WORK_TASKS[n % WORK_TASKS.length], done: false });

export default function WorkMachine() {
  const revealRef = useReveal();
  const [viewRef, inView] = useInView(0.25);
  const toast = useToast();
  const [prod, setProd] = useState(127);
  const [stamp, setStamp] = useState(0);
  const [tasks, setTasks] = useState(() => [0, 1, 2, 3, 4].map((n) => ({ ...makeTask(n), done: n < 2 })));
  const counter = useRef(5);
  const stampTimer = useRef(0);

  // Lightweight task simulation — runs ONLY while the section is on screen.
  useEffect(() => {
    if (!inView || prefersReducedMotion()) return undefined;
    const id = setInterval(() => {
      setTasks((prev) => {
        const next = prev.map((t) => ({ ...t }));
        const idx = next.findIndex((t) => !t.done);
        if (idx >= 0) next[idx].done = true;
        if (next.filter((t) => t.done).length > 2) {
          next.shift();
          next.push(makeTask(counter.current++));
        }
        return next;
      });
    }, 1300);
    return () => clearInterval(id);
  }, [inView]);

  useEffect(() => () => clearTimeout(stampTimer.current), []);

  const breakRequest = () => {
    setProd((p) => Math.min(160, p + 3));
    setStamp((s) => s + 1);
    toast('Break rejected by Shameer OS.', { icon: '⛔' });
  };

  const base = Math.min(prod, 100);
  const extra = Math.max(0, prod - 100);

  return (
    <section id="work-machine" className="sec funny work" aria-labelledby="wm-h">
      <div className="wm" ref={revealRef}>
        <div className="sec-head reveal">
          <p className="eyebrow">PRODUCTIVITY CELL · FICTIONAL</p>
          <h3 id="wm-h" className="sec-title">THE NEVER-ENDING WORK MACHINE</h3>
        </div>

        <div className="wm-grid reveal" style={{ '--d': '120ms' }} ref={viewRef}>
          <div className="wm-panel gauge-panel">
            <div className="gauge">
              <svg viewBox="0 0 160 160" aria-hidden="true">
                <circle className="g-track" cx="80" cy="80" r={R} />
                <circle className="g-base" cx="80" cy="80" r={R} strokeDasharray={C} strokeDashoffset={C * (1 - base / 100)} transform="rotate(-90 80 80)" />
                <circle className="g-extra" cx="80" cy="80" r={R - 11} strokeDasharray={2 * Math.PI * (R - 11)} strokeDashoffset={2 * Math.PI * (R - 11) * (1 - Math.min(extra, 100) / 100)} transform="rotate(-90 80 80)" />
              </svg>
              <div className="gauge-text">
                <b>{prod}%</b>
                <span>PRODUCTIVITY</span>
              </div>
            </div>
            <p className="wm-line"><span className="dot live" aria-hidden="true" /> Productivity: {prod}%</p>
            <p className="wm-line"><span className="dot red" aria-hidden="true" /> Rest mode unavailable.</p>
            <p className="wm-line"><span className="dot amber" aria-hidden="true" /> Break status: Pending approval.</p>
          </div>

          <div className="wm-panel tasks-panel">
            <span className="label">LIVE TASK QUEUE</span>
            <ul className="tasks">
              {tasks.map((t) => (
                <li key={t.id} className={t.done ? 'done' : ''}>
                  <span className="check" aria-hidden="true">{t.done ? '✓' : ''}</span>
                  <span>{t.text}</span>
                  <em>{t.done ? 'Done · next one started' : 'In progress'}</em>
                </li>
              ))}
            </ul>

            <div className="over-bar" aria-hidden="true">
              <span className="over-fill" style={{ width: `${Math.min(prod, 160) / 1.6}%` }} />
              <i style={{ left: `${100 / 1.6}%` }} />
            </div>

            <div className="break-row">
              <button type="button" className="btn btn-ghost" onClick={breakRequest}>
                TAKE A BREAK
              </button>
              {stamp > 0 && (
                <span key={stamp} className="reject-stamp" aria-hidden="true">
                  REJECTED
                </span>
              )}
            </div>
            <p className="sr-only" role="status">{stamp > 0 ? 'Break rejected by Shameer OS.' : ''}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
