/** Scrolling title band between chapters (pure CSS motion; stops for reduced-motion). */
export default function Marquee({ text = 'SHAMEER KT', tone = 'chilli' }) {
  const group = Array.from({ length: 6 }, (_, i) => (
    <span key={i} className="marquee-item">
      {text}
      <i aria-hidden="true">✦</i>
    </span>
  ));
  return (
    <div className={`marquee marquee-${tone}`} aria-hidden="true">
      <div className="marquee-track">
        <div className="marquee-group">{group}</div>
        <div className="marquee-group">{group}</div>
      </div>
    </div>
  );
}
