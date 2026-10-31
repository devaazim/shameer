import { useState } from 'react';
import { AWARDS } from '../data/awards.js';
import { useReveal } from '../hooks/useReveal.js';

function Emblem({ kind }) {
  const common = { viewBox: '0 0 64 64', fill: 'none', stroke: 'currentColor', strokeWidth: 2.2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  if (kind === 'trophy')
    return (
      <svg {...common}>
        <path d="M20 10h24v14a12 12 0 0 1-24 0z" />
        <path d="M20 14h-8c0 9 4 14 10 15M44 14h8c0 9-4 14-10 15" />
        <path d="M32 36v10M22 54h20M26 46h12v8H26z" />
      </svg>
    );
  if (kind === 'stamp')
    return (
      <svg {...common}>
        <circle cx="32" cy="32" r="22" />
        <circle cx="32" cy="32" r="17" strokeDasharray="2 4" />
        <text x="32" y="38" textAnchor="middle" fontSize="18" fontFamily="Anton, Impact, sans-serif" fill="currentColor" stroke="none">100</text>
      </svg>
    );
  if (kind === 'porotta')
    return (
      <svg {...common}>
        <circle cx="32" cy="32" r="23" />
        <path d="M32 9c13 0 23 10 23 23M32 55C19 55 9 45 9 32" />
        <path d="M32 17a15 15 0 0 1 15 15M32 47a15 15 0 0 1-15-15" />
        <path d="M32 25a7 7 0 0 1 7 7M32 39a7 7 0 0 1-7-7" />
      </svg>
    );
  if (kind === 'coin')
    return (
      <svg {...common}>
        <circle cx="32" cy="32" r="22" />
        <circle cx="32" cy="32" r="16" />
        <path d="M22 32h20M36 26l6 6-6 6" />
      </svg>
    );
  return (
    <svg {...common}>
      <path d="M32 6l7 6h9v9l6 7-6 7v9h-9l-7 6-7-6h-9v-9l-6-7 6-7v-9h9z" />
      <path d="M26 26a6 6 0 1 1 8 5.6c-1.4.6-2 1.6-2 3v1" />
      <circle cx="32" cy="43" r="1.4" fill="currentColor" />
    </svg>
  );
}

function AwardCard({ award, index }) {
  const ref = useReveal();
  const [flipped, setFlipped] = useState(false);
  return (
    <li ref={ref} className="award-wrap reveal" style={{ '--d': `${index * 90}ms` }}>
      <button
        type="button"
        className={`award ${flipped ? 'is-flipped' : ''}`}
        aria-pressed={flipped}
        onClick={() => setFlipped((f) => !f)}
      >
        <span className="award-face award-front">
          <span className="award-no">№ {String(index + 1).padStart(2, '0')}</span>
          <span className="award-emblem"><Emblem kind={award.icon} /></span>
          <span className="award-title">{award.title}</span>
          <span className="award-hint">Tap to reveal the citation</span>
        </span>
        <span className="award-face award-back">
          <span className="award-no">THE CITATION</span>
          <span className="award-title sm">{award.title}</span>
          <span className="award-desc">{award.description}</span>
          <span className="award-hint">Tap to flip back</span>
        </span>
      </button>
    </li>
  );
}

export default function ShameerAwards() {
  return (
    <section id="awards" className="sec awards-sec" aria-labelledby="aw-h">
      <div className="sec-head">
        <p className="eyebrow">A CEREMONY OF ENTIRELY UNOFFICIAL HONOURS</p>
        <h2 id="aw-h" className="sec-title">THE SHAMEER AWARDS™</h2>
      </div>
      <ul className="awards">
        {AWARDS.map((a, i) => (
          <AwardCard key={a.id} award={a} index={i} />
        ))}
      </ul>
    </section>
  );
}
