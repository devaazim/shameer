import { useEffect, useRef, useState } from 'react';
import { TERMINAL_COMMANDS } from '../data/stats.js';
import { prefersReducedMotion } from '../utils/scroll.js';
import { useReveal } from '../hooks/useReveal.js';

const GREETING = 'Ask Shameer AI™ v1979.0 — a simulated assistant. No real AI, no network, no system access. Type “help”.';
const FALLBACK = (cmd) => `Command not recognised: “${cmd}”. Try: ${Object.keys(TERMINAL_COMMANDS).join(', ')}`;
const MAX_ENTRIES = 30;

/** Pure lookup in a fixed table — nothing typed here is ever executed. */
function respond(raw) {
  const cmd = raw.trim().toLowerCase().replace(/[\s-]+/g, '_').slice(0, 40);
  if (Object.prototype.hasOwnProperty.call(TERMINAL_COMMANDS, cmd)) return TERMINAL_COMMANDS[cmd];
  if (cmd === 'help') return `Available commands: ${Object.keys(TERMINAL_COMMANDS).join(', ')}, clear`;
  return FALLBACK(raw.trim().slice(0, 40));
}

export default function AskShameerAI() {
  const ref = useReveal();
  const [entries, setEntries] = useState([]); // { id, cmd, out }
  const [typed, setTyped] = useState(0);
  const [value, setValue] = useState('');
  const bodyRef = useRef(null);
  const idRef = useRef(0);

  // Typewriter for the latest response only.
  const last = entries[entries.length - 1];
  useEffect(() => {
    if (!last) return undefined;
    if (prefersReducedMotion()) {
      setTyped(last.out.length);
      return undefined;
    }
    if (typed >= last.out.length) return undefined;
    const t = setTimeout(() => setTyped((n) => n + 2), 16);
    return () => clearTimeout(t);
  }, [last, typed]);

  // Keep the newest line in view — scrolls only the terminal box, never the page.
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [entries, typed]);

  const run = (raw) => {
    const text = raw.trim();
    if (!text) return;
    if (/^(clear|reset)$/i.test(text)) {
      setEntries([]);
      setTyped(0);
      return;
    }
    const out = respond(text);
    setEntries((prev) => [...prev, { id: ++idRef.current, cmd: text.slice(0, 40), out }].slice(-MAX_ENTRIES));
    setTyped(0);
  };

  const submit = (e) => {
    e.preventDefault();
    run(value);
    setValue('');
  };

  return (
    <section id="terminal" className="sec term-sec" aria-labelledby="term-h">
      <div className="term-wrap" ref={ref}>
        <div className="sec-head reveal">
          <p className="eyebrow">OPTIONAL · COMPLETELY SIMULATED</p>
          <h2 id="term-h" className="sec-title">ASK SHAMEER AI™</h2>
        </div>

        <div className="term reveal" style={{ '--d': '120ms' }}>
          <div className="term-bar">
            <span className="os-dots" aria-hidden="true"><i /><i /><i /></span>
            <span>ask-shameer-ai — simulated terminal</span>
          </div>
          <div className="term-body" ref={bodyRef} role="log" aria-live="polite" tabIndex={0} aria-label="Terminal output">
            <p className="t-dim">{GREETING}</p>
            {entries.map((en, i) => (
              <div key={en.id} className="t-entry">
                <p className="t-cmd"><span aria-hidden="true">›</span> {en.cmd}</p>
                <p className="t-out">{i === entries.length - 1 ? en.out.slice(0, typed) : en.out}</p>
              </div>
            ))}
          </div>

          <div className="term-chips" role="group" aria-label="Suggested commands">
            {Object.keys(TERMINAL_COMMANDS).map((c) => (
              <button key={c} type="button" className="chip chip-btn" onClick={() => run(c)}>
                {c}
              </button>
            ))}
            <button type="button" className="chip chip-btn" onClick={() => run('help')}>help</button>
            <button type="button" className="chip chip-btn dim" onClick={() => run('clear')}>clear / reset</button>
          </div>

          <form className="term-form" onSubmit={submit}>
            <label htmlFor="term-input" className="t-prompt">shameer@ai:~$</label>
            <input
              id="term-input"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              maxLength={40}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              placeholder="type a command…"
            />
            <button type="submit" className="btn btn-gold sm">RUN</button>
          </form>
        </div>
      </div>
    </section>
  );
}
