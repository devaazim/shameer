import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DIALOGUES, NEGOTIATION_REPLIES } from '../data/dialogues.js';
import { useReveal } from '../hooks/useReveal.js';

const REACTIONS = ['shake', 'bounce', 'zoom', 'wobble', 'jolt', 'spin'];
const MOVES = {
  nod: { label: 'Nod politely', icon: '🙂', heal: [6, 10], say: ['“Yes Ippa.”', '“Sheriyaa Ippa.”', '*nods with great sincerity*'] },
  book: { label: 'Open the book', icon: '📖', heal: [6, 10], say: ['*opens the book*', '*finds the right page… almost*'] },
  phone: { label: 'Hide the phone', icon: '📵', heal: [6, 10], say: ['*phone vanishes*', '*phone is now “charging”*'] },
};
// Dialogues where a specific move works best (+22 patience).
const BEST = { book: 'book', 'looking-book': 'book', 'phone-paripadi': 'phone', 'phone-order': 'phone', charge: 'phone' };

const rand = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

/* ── Optional sound — OFF by default; the AudioContext is only created after the player turns sound on ── */
function useBeeps() {
  const ctxRef = useRef(null);
  const enable = useCallback(() => {
    try {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      if (!ctxRef.current) ctxRef.current = new AC();
      ctxRef.current.resume?.();
      return true;
    } catch {
      return false;
    }
  }, []);
  const beep = useCallback((freq, dur = 0.12, type = 'triangle', gain = 0.05) => {
    const ctx = ctxRef.current;
    if (!ctx) return;
    try {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.value = freq;
      g.gain.setValueAtTime(gain, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      o.connect(g).connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + dur + 0.02);
    } catch {
      /* ignore audio errors */
    }
  }, []);
  useEffect(() => () => ctxRef.current?.close?.(), []);
  return { enable, beep };
}

export default function KidsVsIppa() {
  const ref = useReveal();
  const { enable, beep } = useBeeps();
  const [sound, setSound] = useState(false);
  const [status, setStatus] = useState('idle'); // idle | playing | over
  const [current, setCurrent] = useState(null);
  const [patience, setPatience] = useState(100);
  const [survived, setSurvived] = useState(0);
  const [best, setBest] = useState(0);
  const [reaction, setReaction] = useState({ name: '', n: 0 });
  const [used, setUsed] = useState(false);
  const [reply, setReply] = useState('');
  const [nego, setNego] = useState(null); // null | { choice, text }
  const deck = useRef([]);
  const lastId = useRef(null);
  const turn = useRef(0);

  const ids = useMemo(() => DIALOGUES.map((d) => d.id), []);

  const nextFromDeck = () => {
    if (!deck.current.length) {
      let fresh = shuffle(ids);
      if (fresh[fresh.length - 1] === lastId.current) fresh = [fresh[0], ...fresh.slice(1)].reverse();
      deck.current = fresh;
    }
    const id = deck.current.pop();
    lastId.current = id;
    return DIALOGUES.find((d) => d.id === id);
  };

  const playSound = (kind) => {
    if (!sound) return;
    if (kind === 'say') beep(300, 0.14, 'sawtooth', 0.035);
    if (kind === 'heal') {
      beep(520, 0.09);
      setTimeout(() => beep(780, 0.12), 90);
    }
    if (kind === 'over') {
      beep(220, 0.25, 'square', 0.04);
      setTimeout(() => beep(150, 0.4, 'square', 0.04), 220);
    }
  };

  const next = () => {
    if (status === 'over') return;
    const d = nextFromDeck();
    turn.current += 1;
    setCurrent(d);
    setUsed(false);
    setReply('');
    setNego(null);
    setReaction({ name: REACTIONS[turn.current % REACTIONS.length], n: turn.current });
    if (status === 'idle') setStatus('playing');
    playSound('say');
    const hp = Math.max(0, patience - d.damage);
    setPatience(hp);
    if (hp <= 0) {
      setStatus('over');
      setBest((b) => Math.max(b, survived));
      setTimeout(() => playSound('over'), 200);
    } else {
      setSurvived((s) => (turn.current > 1 ? s + 1 : s));
    }
  };

  const defend = (key) => {
    if (used || status !== 'playing' || !current) return;
    const m = MOVES[key];
    const bonus = BEST[current.id] === key;
    const amount = bonus ? 22 : rand(...m.heal);
    setPatience((p) => Math.min(100, p + amount));
    setUsed(true);
    setReply(`${pick(m.say)}${bonus ? ' Perfect counter! +' + amount : ' +' + amount}`);
    playSound('heal');
  };

  const negotiate = (choice) => {
    if (nego) return;
    setNego({ choice, text: pick(NEGOTIATION_REPLIES[choice]) });
    setPatience((p) => Math.min(100, p + 8));
    playSound('heal');
  };

  const restart = () => {
    deck.current = [];
    lastId.current = null;
    turn.current = 0;
    setStatus('idle');
    setCurrent(null);
    setPatience(100);
    setSurvived(0);
    setUsed(false);
    setReply('');
    setNego(null);
    setReaction({ name: '', n: 0 });
  };

  const toggleSound = () => {
    if (!sound) {
      if (!enable()) return;
      setSound(true);
      setTimeout(() => beep(660, 0.1), 30);
    } else {
      setSound(false);
    }
  };

  const mood = !current ? 'calm' : current.damage >= 15 ? 'angry' : current.damage >= 11 ? 'stern' : 'calm';
  const hpClass = patience > 60 ? 'ok' : patience > 30 ? 'mid' : 'low';

  return (
    <section id="kids-vs-ippa" className="sec funny kvi" aria-labelledby="kvi-h">
      <div className="kvi-wrap" ref={ref}>
        <div className="sec-head reveal">
          <p className="eyebrow">THE MINI-GAME · HOW LONG CAN YOU SURVIVE IPPA?</p>
          <h3 id="kvi-h" className="sec-title">KIDS VS IPPA</h3>
        </div>

        <div className="game reveal" style={{ '--d': '120ms' }}>
          <div className="game-top">
            <div className="hud">
              <span className="label">PATIENCE</span>
              <div className={`meter-track hp ${hpClass}`} role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={patience} aria-label="Your patience">
                <span className="meter-fill" style={{ transform: `scaleX(${patience / 100})` }} />
              </div>
              <b>{patience}</b>
            </div>
            <div className="hud-right">
              <span className="chip">Survived <b>{survived}</b></span>
              <span className="chip">Best <b>{best}</b></span>
              <button type="button" className="chip chip-btn" onClick={toggleSound} aria-pressed={sound} aria-label={sound ? 'Mute sound effects' : 'Unmute sound effects'}>
                {sound ? '🔊 Sound on' : '🔇 Muted'}
              </button>
            </div>
          </div>

          <div className="arena">
            <div className="ippa-col">
              <div key={reaction.n} className={`ippa react-${reaction.name}`} data-mood={mood} aria-hidden="true">
                <div className="ippa-hair" />
                <div className="ippa-head">
                  <span className="brow l" /><span className="brow r" />
                  <span className="glass l"><i /></span><span className="glass r"><i /></span>
                  <span className="bridge" />
                  <span className="mouth" />
                </div>
                <div className="ippa-body"><span className="shirt" /><span className="tie" /></div>
              </div>
              <span className="ippa-name">IPPA</span>
            </div>

            <div className="bubble-col">
              <div key={current ? `${current.id}-${turn.current}` : 'idle'} className="bubble pop" role="status" aria-live="polite">
                {status === 'idle' && <p className="bubble-text soft">Ippa is waiting… press <b>NEXT DIALOGUE</b> to begin.</p>}
                {status !== 'idle' && current && <p className="bubble-text">{current.text}</p>}
              </div>
              {reply && <p className="reply">{reply}</p>}
              {status === 'over' && (
                <p className="over">
                  <b>IPPA WINS THIS ROUND.</b> You survived {survived} dialogue{survived === 1 ? '' : 's'}.
                </p>
              )}
            </div>
          </div>

          {current?.special === 'laptop' && status !== 'over' && (
            <div className="nego" aria-label="Reward negotiation">
              <p className="nego-title">REWARD NEGOTIATION · choose wisely</p>
              <div className="nego-row">
                <button type="button" className={`device ${nego?.choice === 'computer' ? 'chosen' : ''}`} onClick={() => negotiate('computer')} disabled={!!nego}>
                  <span className="dev-computer" aria-hidden="true"><i /><b /></span>
                  <span>COMPUTER</span>
                </button>
                <span className="vs" aria-hidden="true">VS</span>
                <button type="button" className={`device ${nego?.choice === 'laptop' ? 'chosen' : ''}`} onClick={() => negotiate('laptop')} disabled={!!nego}>
                  <span className="dev-laptop" aria-hidden="true"><i /><b /></span>
                  <span>LAPTOP</span>
                </button>
              </div>
              {nego && <p key={nego.choice} className="nego-reply pop">Ippa: {nego.text} <b>(+8 patience for negotiating)</b></p>}
            </div>
          )}

          <div className="moves" role="group" aria-label="Your responses">
            {Object.entries(MOVES).map(([key, m]) => (
              <button key={key} type="button" className="btn btn-ghost move" onClick={() => defend(key)} disabled={used || status !== 'playing'}>
                <span aria-hidden="true">{m.icon}</span> {m.label}
              </button>
            ))}
          </div>

          <div className="game-actions">
            <button type="button" className="btn btn-gold" onClick={next} disabled={status === 'over'}>
              NEXT DIALOGUE
            </button>
            <button type="button" className="btn btn-ghost" onClick={restart}>
              {status === 'over' ? 'TRY AGAIN ↻' : 'RESTART ↻'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
