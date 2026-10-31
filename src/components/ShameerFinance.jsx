import { useEffect, useRef, useState } from 'react';
import { useReveal } from '../hooks/useReveal.js';
import { FINANCE_METRICS } from '../data/stats.js';
import { useToast } from './Toast.jsx';

const COINS = 12;

export default function ShameerFinance() {
  const ref = useReveal();
  const toast = useToast();
  const [coins, setCoins] = useState(COINS);
  const [flyN, setFlyN] = useState(0);
  const [approved, setApproved] = useState(0); // key to replay the stamp
  const [message, setMessage] = useState('');
  const [shake, setShake] = useState('');
  const timers = useRef([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

  const requestLoan = () => {
    if (flyN) return;
    const k = Math.min(4, coins);
    setFlyN(k);
    setApproved((a) => a + 1);
    setMessage('Application approved. Repayment? We’ll discuss in 2045.');
    later(() => {
      setCoins((c) => {
        const left = c - k;
        if (left <= 0) {
          later(() => {
            setCoins(COINS);
            setMessage('Wallet empty. Optimism restored — balance refilled.');
          }, 1500);
        }
        return left;
      });
      setFlyN(0);
    }, 750);
  };

  const poke = (m) => {
    if (!m.egg) return;
    toast('Case currently under investigation.', { icon: '🔍' });
    setShake(m.id);
    later(() => setShake(''), 600);
  };

  const pct = Math.round((coins / COINS) * 100);

  return (
    <section id="finance" className="sec funny finance" aria-labelledby="fin-h">
      <div className="fin" ref={ref}>
        <div className="fin-head reveal">
          <div>
            <p className="eyebrow">A FINTECH EXPERIENCE · PURELY FICTIONAL</p>
            <h3 id="fin-h" className="sec-title">SHAMEER FINANCE™</h3>
          </div>
          <span className="badge" title="Humorous fiction — not a real financial account">FICTION · FOR LAUGHS ONLY</span>
        </div>

        <div className="fin-board reveal" style={{ '--d': '120ms' }}>
          <div className="wallet">
            <div className="wallet-top">
              <span className="label">WALLET HEALTH</span>
              <b className="wallet-pct">{pct}%</b>
            </div>
            <div className="wallet-coins" aria-hidden="true">
              {Array.from({ length: COINS }, (_, i) => (
                <span key={i} className={`coin ${i >= coins ? 'gone' : ''} ${i >= coins - flyN && i < coins ? 'fly' : ''}`} style={{ '--i': i }} />
              ))}
            </div>
            <div className="meter-track slim">
              <span className="meter-fill gold-fill" style={{ transform: `scaleX(${pct / 100})` }} />
            </div>
            <p className="wallet-note">Balance: <b>░░░░░░ (classified)</b></p>
          </div>

          <div className="fin-metrics">
            {FINANCE_METRICS.map((m) => {
              const Tag = m.egg ? 'button' : 'div';
              return (
                <Tag
                  key={m.id}
                  type={m.egg ? 'button' : undefined}
                  className={`metric tone-${m.tone} ${shake === m.id ? 'shake' : ''}`}
                  onClick={m.egg ? () => poke(m) : undefined}
                >
                  <span className="label">{m.label}</span>
                  <b className="metric-v">{m.value}</b>
                </Tag>
              );
            })}
          </div>

          <figure className="fin-chart" aria-label="Illustrative chart: money lent rises, money returned stays flat. Fictional.">
            <svg viewBox="0 0 300 120">
              <g className="grid">
                {[30, 60, 90].map((y) => (
                  <line key={y} x1="0" x2="300" y1={y} y2={y} />
                ))}
              </g>
              <path className="line lent" pathLength="1" d="M0 100 C 60 96, 90 70, 140 52 S 240 14, 300 6" />
              <path className="line back" pathLength="1" d="M0 112 C 80 112, 160 111, 220 110 S 270 108, 300 107" />
            </svg>
            <figcaption>
              <span className="lg lg-lent">Lent</span>
              <span className="lg lg-back">Returned</span>
              <em>Illustrative · not real data</em>
            </figcaption>
          </figure>

          <div className="loan">
            <dl>
              <div><dt>Applicant</dt><dd>Anyone, really</dd></div>
              <div><dt>Amount</dt><dd>Please</dd></div>
              <div><dt>Repayment</dt><dd>Soon™</dd></div>
            </dl>
            <button type="button" className="btn btn-gold" onClick={requestLoan} disabled={flyN > 0}>
              REQUEST A LOAN
            </button>
            <p className="loan-msg" role="status">
              {message && <span key={approved} className="stamp-line">{message}</span>}
            </p>
            {approved > 0 && <span key={`s${approved}`} className="stamp" aria-hidden="true">APPROVED</span>}
          </div>
        </div>
      </div>
    </section>
  );
}
