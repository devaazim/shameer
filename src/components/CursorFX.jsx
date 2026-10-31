import { useEffect } from 'react';
import { prefersReducedMotion } from '../utils/scroll.js';

/**
 * Cursor & mouse effects (desktop mice only; everything is skipped for reduced-motion):
 *  • gold dot + trailing ring that grows over clickable things and says "VIEW" over photos
 *  • magnetic buttons (they lean toward the pointer)
 *  • 3D tilt on gallery photos, OS modules and finance metrics
 *  • a soft spotlight that follows the pointer across the hero
 *  • sparkle trail in the hero
 *  • a gold spark burst on every click / tap (also works on touch)
 * Only transform/opacity are animated; elements are created on demand and removed afterwards.
 * To switch the whole thing off, remove <CursorFX /> in App.jsx.
 */
const CLICKABLE = 'a, button, [role="tab"], [role="button"], summary, label, select, .gal-item';
const MAGNETIC = '.btn, .chip-btn, .nav-brand, .to-top, .device, .loader-skip';
const TILT = '.gal-item, .os-module, button.metric';

export default function CursorFX() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined;
    const fine = window.matchMedia('(pointer: fine)').matches;
    const root = document.documentElement;

    // ── tap / click spark burst (all pointer types) ───────────────────────
    const burst = (x, y) => {
      for (let i = 0; i < 9; i += 1) {
        const s = document.createElement('i');
        s.className = 'fx-spark';
        s.style.left = `${x}px`;
        s.style.top = `${y}px`;
        document.body.appendChild(s);
        const a = (Math.PI * 2 * i) / 9 + Math.random() * 0.5;
        const d = 26 + Math.random() * 30;
        const anim = s.animate(
          [
            { transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
            { transform: `translate(calc(-50% + ${Math.cos(a) * d}px), calc(-50% + ${Math.sin(a) * d}px)) scale(0)`, opacity: 0 },
          ],
          { duration: 560 + Math.random() * 200, easing: 'cubic-bezier(.2,.7,.3,1)' },
        );
        anim.onfinish = () => s.remove();
      }
    };
    const onDown = (e) => burst(e.clientX, e.clientY);
    window.addEventListener('pointerdown', onDown, { passive: true });

    if (!fine) return () => window.removeEventListener('pointerdown', onDown);

    // ── custom cursor ─────────────────────────────────────────────────────
    root.classList.add('fx-on');
    const dot = document.createElement('div');
    dot.className = 'fx-dot';
    const ring = document.createElement('div');
    ring.className = 'fx-ring';
    const label = document.createElement('span');
    ring.appendChild(label);
    document.body.append(ring, dot);

    let tx = -100;
    let ty = -100;
    let rx = -100;
    let ry = -100;
    let raf = 0;
    let magnet = null;
    let tilt = null;
    let lastTrail = 0;
    let shown = false;

    const loop = () => {
      rx += (tx - rx) * 0.18;
      ry += (ty - ry) * 0.18;
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
      raf = Math.abs(tx - rx) + Math.abs(ty - ry) > 0.3 ? requestAnimationFrame(loop) : 0;
    };

    const setMagnet = (el) => {
      if (magnet && magnet !== el) magnet.style.translate = '';
      magnet = el;
    };
    const setTilt = (el) => {
      if (tilt && tilt !== el) tilt.style.transform = '';
      tilt = el;
    };

    const trail = (x, y) => {
      const s = document.createElement('i');
      s.className = 'fx-trail';
      s.style.left = `${x}px`;
      s.style.top = `${y}px`;
      document.body.appendChild(s);
      const a = s.animate(
        [
          { transform: 'translate(-50%,-50%) scale(1)', opacity: 0.85 },
          { transform: `translate(-50%, calc(-50% + ${14 + Math.random() * 16}px)) scale(0)`, opacity: 0 },
        ],
        { duration: 700, easing: 'ease-out' },
      );
      a.onfinish = () => s.remove();
    };

    const onMove = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      dot.style.transform = `translate3d(${tx}px, ${ty}px, 0) translate(-50%, -50%)`;
      if (!shown) {
        shown = true;
        rx = tx;
        ry = ty;
        root.classList.add('fx-live');
      }
      if (!raf) raf = requestAnimationFrame(loop);

      const t = e.target instanceof Element ? e.target : null;
      const clickable = t && t.closest(CLICKABLE);
      ring.classList.toggle('is-hot', !!clickable);
      label.textContent = t && t.closest('.gal-item') ? 'VIEW' : '';
      ring.classList.toggle('has-label', !!(t && t.closest('.gal-item')));

      // magnetic pull
      const m = t && t.closest(MAGNETIC);
      setMagnet(m);
      if (m && !m.disabled) {
        const r = m.getBoundingClientRect();
        const dx = (tx - (r.left + r.width / 2)) / r.width;
        const dy = (ty - (r.top + r.height / 2)) / r.height;
        m.style.translate = `${dx * 10}px ${dy * 8}px`;
      }

      // 3D tilt
      const tl = t && t.closest(TILT);
      setTilt(tl);
      if (tl) {
        const r = tl.getBoundingClientRect();
        const px = (tx - r.left) / r.width - 0.5;
        const py = (ty - r.top) / r.height - 0.5;
        tl.style.transform = `perspective(800px) rotateX(${(-py * 9).toFixed(2)}deg) rotateY(${(px * 11).toFixed(2)}deg) translateY(-3px)`;
        tl.style.setProperty('--gx', `${(px + 0.5) * 100}%`);
        tl.style.setProperty('--gy', `${(py + 0.5) * 100}%`);
      }

      // hero spotlight + sparkle trail
      const stage = t && t.closest('.hero-stage');
      if (stage && stage.dataset.phase === 'hero') {
        const r = stage.getBoundingClientRect();
        stage.style.setProperty('--cx', `${tx - r.left}px`);
        stage.style.setProperty('--cy', `${ty - r.top}px`);
        const now = performance.now();
        if (now - lastTrail > 55) {
          lastTrail = now;
          trail(tx + (Math.random() - 0.5) * 8, ty + (Math.random() - 0.5) * 8);
        }
      }
    };
    const onLeave = () => {
      setMagnet(null);
      setTilt(null);
      root.classList.remove('fx-live');
      shown = false;
    };
    const onPress = () => ring.classList.add('is-down');
    const onRelease = () => ring.classList.remove('is-down');

    window.addEventListener('pointermove', onMove, { passive: true });
    document.addEventListener('pointerleave', onLeave);
    window.addEventListener('pointerdown', onPress, { passive: true });
    window.addEventListener('pointerup', onRelease, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', onDown);
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerleave', onLeave);
      window.removeEventListener('pointerdown', onPress);
      window.removeEventListener('pointerup', onRelease);
      if (raf) cancelAnimationFrame(raf);
      setMagnet(null);
      setTilt(null);
      root.classList.remove('fx-on', 'fx-live');
      dot.remove();
      ring.remove();
    };
  }, []);

  return null;
}
