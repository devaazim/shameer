import { useEffect, useState } from 'react';
import { NAV_ITEMS } from '../data/site.js';

export default function Nav({ active, onNavigate, onBrandTap }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (id) => {
    setOpen(false);
    onNavigate(id);
  };

  return (
    <header className="nav">
      <button
        type="button"
        className="nav-brand"
        onClick={() => {
          onBrandTap?.();
          go('home');
        }}
        aria-label="SHAMEER KT — back to home"
      >
        SHAMEER <b>KT</b>
      </button>

      <nav className={`nav-links ${open ? 'is-open' : ''}`} aria-label="Main">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-link ${active === item.id ? 'is-active' : ''}`}
            aria-current={active === item.id ? 'true' : undefined}
            onClick={() => go(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <button
        type="button"
        className={`nav-burger ${open ? 'is-open' : ''}`}
        aria-label={open ? 'Close menu' : 'Open menu'}
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span />
        <span />
      </button>
    </header>
  );
}
