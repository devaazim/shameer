import { useEffect, useRef, useState } from 'react';
import { OS_STATS } from '../data/stats.js';
import { useReveal } from '../hooks/useReveal.js';
import { useToast } from './Toast.jsx';

export default function ShameerOS() {
  const ref = useReveal();
  const toast = useToast();
  const [notes, setNotes] = useState([]);
  const [selected, setSelected] = useState(null);
  const idRef = useRef(0);
  const timers = useRef(new Map());

  useEffect(() => {
    const map = timers.current;
    return () => map.forEach(clearTimeout);
  }, []);

  const dismiss = (id) => {
    clearTimeout(timers.current.get(id));
    timers.current.delete(id);
    setNotes((n) => n.filter((x) => x.id !== id));
  };

  const notify = (title, body) => {
    const id = ++idRef.current;
    setNotes((n) => [...n.slice(-2), { id, title, body }]); // restrained: max 3 windows
    timers.current.set(id, setTimeout(() => dismiss(id), 6500));
  };

  const open = (stat) => {
    setSelected(stat.id);
    notify(stat.label, stat.notification);
    // Easter egg #3 — poke the loan recovery metric.
    if (stat.egg) toast(stat.egg, { icon: '🔍' });
  };

  return (
    <section id="shameer-os" className="sec funny os-sec" aria-labelledby="os-h">
      <div className="os-wrap" ref={ref}>
        <div className="sec-head reveal">
          <p className="eyebrow">THE SECRET OPERATING SYSTEM</p>
          <h3 id="os-h" className="sec-title">SHAMEER OS™</h3>
          <p className="sub">Human Operating System · Version 1979.0</p>
        </div>

        <div className="os reveal" style={{ '--d': '120ms' }}>
          <div className="os-bar">
            <span className="os-dots" aria-hidden="true"><i /><i /><i /></span>
            <span className="os-title">shameer_os — system monitor</span>
            <span className="os-badge">UNOFFICIAL · JOKE STATS</span>
          </div>

          <div className="os-body">
            <div className="os-modules">
              {OS_STATS.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  className={`os-module ${selected === s.id ? 'is-selected' : ''}`}
                  onClick={() => open(s)}
                  aria-label={`${s.label} ${s.value} percent. Tap for notification.`}
                  style={{ '--i': i }}
                >
                  <span className="os-row">
                    <span className="os-name">{s.label}</span>
                    <b className={s.value > 100 ? 'os-over' : ''}>{s.value}%</b>
                  </span>
                  <span className="os-track">
                    <span className={`os-fill ${s.value > 100 ? 'os-over' : ''}`} style={{ '--v': s.value }} />
                    <i className="os-mark" aria-hidden="true" />
                  </span>
                  <span className="os-note">{s.note}</span>
                </button>
              ))}
              <button type="button" className="btn btn-ghost os-update" onClick={() => notify('System', 'System update required: Learn to relax.')}>
                CHECK FOR UPDATES
              </button>
            </div>

            <div className="os-tray" aria-live="polite" aria-label="Notifications">
              <span className="label">NOTIFICATIONS</span>
              {notes.length === 0 && <p className="os-empty">All quiet. Tap a module.</p>}
              {notes.map((n) => (
                <div key={n.id} className="os-note-win">
                  <div className="os-note-bar">
                    <span>{n.title}</span>
                    <button type="button" onClick={() => dismiss(n.id)} aria-label="Dismiss notification">✕</button>
                  </div>
                  <p>{n.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
