import { useEffect, useRef } from 'react';
import ImageFrame from './ImageFrame.jsx';

export default function Lightbox({ items, index, onClose, onNav, label }) {
  const item = items[index];
  const dialogRef = useRef(null);
  const closeRef = useRef(null);
  const touchX = useRef(null);

  useEffect(() => {
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') onNav(1);
      else if (e.key === 'ArrowLeft') onNav(-1);
      else if (e.key === 'Tab') {
        // keep focus inside the dialog
        const f = dialogRef.current?.querySelectorAll('button');
        if (!f || !f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onNav]);

  return (
    <div
      className="lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${label} photo viewer`}
      ref={dialogRef}
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchX.current == null) return;
        const dx = e.changedTouches[0].clientX - touchX.current;
        touchX.current = null;
        if (Math.abs(dx) > 50) onNav(dx < 0 ? 1 : -1);
      }}
    >
      <button ref={closeRef} type="button" className="lb-btn lb-close" onClick={onClose} aria-label="Close viewer">
        ✕
      </button>
      <button type="button" className="lb-btn lb-prev" onClick={() => onNav(-1)} aria-label="Previous photo">
        ‹
      </button>
      <figure className="lb-fig">
        <div className="lb-media">
          <ImageFrame item={item} eager />
        </div>
        <figcaption className="lb-cap">
          <b>{item.title}</b>
          {item.caption && <span>{item.caption}</span>}
          <em>
            {index + 1} / {items.length}
          </em>
        </figcaption>
      </figure>
      <button type="button" className="lb-btn lb-next" onClick={() => onNav(1)} aria-label="Next photo">
        ›
      </button>
    </div>
  );
}
