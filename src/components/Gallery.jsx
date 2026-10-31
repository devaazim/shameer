import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { GALLERY_CATEGORIES, getCategory, getCategoryItems } from '../data/gallery.js';
import ImageFrame from './ImageFrame.jsx';
import Lightbox from './Lightbox.jsx';

/** `category` and `pulse` are controlled by App so timeline cards can select a tab. */
export default function Gallery({ category, onCategoryChange, pulse }) {
  const [lightbox, setLightbox] = useState(-1);
  const items = useMemo(() => getCategoryItems(category), [category]);
  const cat = getCategory(category);
  const tabRefs = useRef({});
  const returnFocus = useRef(null);

  // Close the lightbox whenever the category changes.
  useEffect(() => setLightbox(-1), [category]);

  const onTabKey = (e, idx) => {
    const last = GALLERY_CATEGORIES.length - 1;
    let next = null;
    if (e.key === 'ArrowRight') next = idx === last ? 0 : idx + 1;
    if (e.key === 'ArrowLeft') next = idx === 0 ? last : idx - 1;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = last;
    if (next === null) return;
    e.preventDefault();
    const id = GALLERY_CATEGORIES[next].id;
    onCategoryChange(id);
    tabRefs.current[id]?.focus();
  };

  const open = (i, el) => {
    returnFocus.current = el;
    setLightbox(i);
  };
  const close = useCallback(() => {
    setLightbox(-1);
    returnFocus.current?.focus?.();
  }, []);
  const nav = useCallback(
    (dir) => setLightbox((i) => (i < 0 ? i : (i + dir + items.length) % items.length)),
    [items.length],
  );

  return (
    <section id="gallery" className="sec gallery-sec" aria-labelledby="gal-h">
      <div className="sec-head">
        <p className="eyebrow">THE ARCHIVE</p>
        <h2 id="gal-h" className="sec-title">GALLERY</h2>
      </div>

      <div className="gal-tabs" role="tablist" aria-label="Gallery categories" key={`p${pulse}`}>
        {GALLERY_CATEGORIES.map((c, idx) => (
          <button
            key={c.id}
            ref={(el) => {
              tabRefs.current[c.id] = el;
            }}
            type="button"
            role="tab"
            id={`tab-${c.id}`}
            aria-selected={category === c.id}
            aria-controls="gal-panel"
            tabIndex={category === c.id ? 0 : -1}
            className={`gal-tab ${category === c.id ? 'is-active' : ''} ${pulse && category === c.id ? 'is-pulse' : ''}`}
            onClick={() => onCategoryChange(c.id)}
            onKeyDown={(e) => onTabKey(e, idx)}
          >
            {c.label}
          </button>
        ))}
      </div>

      <p className="gal-status" aria-live="polite">
        Showing <b>{cat.label}</b> · {cat.images.length ? `${items.length} photo${items.length > 1 ? 's' : ''}` : 'placeholders — add your photos in src/data/gallery.js'}
      </p>

      <div id="gal-panel" role="tabpanel" aria-labelledby={`tab-${category}`} className="gal-grid" key={category}>
        {items.map((item, i) => (
          <button
            key={item.key}
            type="button"
            className="gal-item"
            style={{ '--i': i }}
            onClick={(e) => open(i, e.currentTarget)}
            aria-label={`Open ${item.title} in larger view`}
          >
            <ImageFrame item={item} />
            <span className="gal-zoom" aria-hidden="true">⤢</span>
          </button>
        ))}
      </div>

      {lightbox >= 0 && (
        <Lightbox items={items} index={lightbox} onClose={close} onNav={nav} label={cat.label} />
      )}
    </section>
  );
}
