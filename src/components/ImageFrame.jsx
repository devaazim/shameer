import { useState } from 'react';

/** Real image (lazy) or a tasteful CSS placeholder. Never shows a broken-image icon. */
export default function ImageFrame({ item, className = '', eager = false, showLabel = true }) {
  const [failed, setFailed] = useState(false);
  const style = { '--h': item.hue };
  if (item.placeholder || failed || !item.src) {
    return (
      <div className={`ph ${className}`} style={style} role="img" aria-label={item.alt || item.title}>
        <span className="ph-icon" aria-hidden="true" />
        {showLabel && <span className="ph-label">{item.title}</span>}
        {showLabel && <span className="ph-sub">{failed ? 'Image not found — check the path' : item.caption || 'Add photo'}</span>}
      </div>
    );
  }
  return (
    <img
      className={`img-real ${className}`}
      src={item.src}
      alt={item.alt || item.title}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}
