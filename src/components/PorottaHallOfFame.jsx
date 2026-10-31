import { useEffect, useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal.js';
import { useToast } from './Toast.jsx';

const LAYERS = 7;

function level(orders) {
  const pct = Math.min(100, 62 + orders * 6);
  const label = pct >= 100 ? 'FINAL FORM' : pct >= 80 ? 'SUSPICIOUSLY SATISFIED' : 'WARMING UP';
  return { pct, label };
}

export default function PorottaHallOfFame() {
  const ref = useReveal();
  const toast = useToast();
  const [orders, setOrders] = useState(0);
  const [taps, setTaps] = useState(0);
  const [burst, setBurst] = useState(false);
  const [flying, setFlying] = useState([]);
  const [confirm, setConfirm] = useState('');
  const [confirmKey, setConfirmKey] = useState(0);
  const timers = useRef([]);
  const idRef = useRef(0);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  const order = () => {
    setOrders((o) => o + 2);
    const ids = [++idRef.current, ++idRef.current];
    setFlying((f) => [...f, ...ids]);
    later(() => setFlying((f) => f.filter((x) => !ids.includes(x))), 1000);
    setConfirm('Order confirmed. Shameer has entered his final form.');
    setConfirmKey((k) => k + 1);
  };

  // Easter egg #1 — tap the porotta 5× for a layered celebration.
  const tapPorotta = () => {
    const n = taps + 1;
    setTaps(n);
    if (n % 5 === 0) {
      setBurst(true);
      toast('Hidden layer unlocked: MAXIMUM FLAKINESS.', { icon: '🥇' });
      later(() => setBurst(false), 1500);
    }
  };

  const { pct, label } = level(orders);

  return (
    <section id="porotta" className="sec funny porotta" aria-labelledby="po-h">
      <div className="funny-grid" ref={ref}>
        <div className="porotta-stage reveal">
          <button
            type="button"
            className={`porotta-art ${burst ? 'is-burst' : ''}`}
            onClick={tapPorotta}
            aria-label="Porotta illustration — tap it a few times"
          >
            {Array.from({ length: LAYERS }, (_, i) => (
              <span key={i} className="pl" style={{ '--i': i }} />
            ))}
            <span className="porotta-shine" aria-hidden="true" />
          </button>
          <div className="plate" aria-hidden="true">
            {flying.map((id) => (
              <span key={id} className="fly-porotta" style={{ '--o': id % 2 ? '-18px' : '18px' }} />
            ))}
          </div>
          <p className="tap-hint" aria-hidden="true">
            {taps % 5 === 0 && taps > 0 ? 'Flakiness maxed ✦' : `psst… tap the porotta${taps ? ` (${taps % 5}/5)` : ''}`}
          </p>
        </div>

        <div className="funny-copy">
          <p className="eyebrow">TASTE · TRADITION · LAYERS</p>
          <h3 className="sec-title">THE POROTTA HALL OF FAME</h3>
          <p className="joke">
            <span className="strike">Michelin stars?</span> No thanks. <span className="gold">Porotta layers?</span> YES.
          </p>
          <p className="sub">Kerala porotta: Shameer’s favourite food, treated here with the ceremony of a luxury product.</p>

          <div className="meter" role="meter" aria-valuemin={0} aria-valuemax={100} aria-valuenow={pct} aria-label="Porotta appreciation">
            <div className="meter-row">
              <span>POROTTA APPRECIATION</span>
              <b>{label}</b>
            </div>
            <div className="meter-track">
              <span className="meter-fill gold-fill" style={{ transform: `scaleX(${pct / 100})` }} />
            </div>
          </div>

          <div className="order-row">
            <button type="button" className="btn btn-gold" onClick={order}>
              ORDER HIM 2 POROTTAS
            </button>
            <div className="counter" aria-live="polite">
              <span key={orders} className="counter-n bump">{orders}</span>
              <span className="counter-l">porottas ordered</span>
            </div>
          </div>
          <p key={confirmKey} className={`confirm ${confirm ? 'show' : ''}`} role="status">
            {confirm || ' '}
          </p>
        </div>
      </div>
    </section>
  );
}
