import { useRef } from 'react';

export default function Footer({ onSecret }) {
  const taps = useRef({ n: 0, t: 0 });
  // Touch-friendly easter egg: tap the wordmark 5× within 3 seconds.
  const tap = () => {
    const now = Date.now();
    const s = taps.current;
    s.n = now - s.t > 3000 ? 1 : s.n + 1;
    s.t = now;
    if (s.n >= 5) {
      s.n = 0;
      onSecret?.();
    }
  };
  return (
    <footer className="footer">
      <button type="button" className="footer-mark" onClick={tap} aria-label="SHAMEER KT">
        SHAMEER KT
      </button>
      <p>© {new Date().getFullYear()} Shameer KT · A family tribute. Every joke here is fictional, affectionate and unofficial.</p>
    </footer>
  );
}
