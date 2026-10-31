import { useEffect, useRef } from 'react';
import {
  PORTRAIT_SRC,
  PORTRAIT_ALT,
  PORTRAIT_ASPECT,
  ABOUT_HEADING,
  ABOUT_PARAGRAPH,
} from '../data/site.js';
import Timecode from './Timecode.jsx';
import { clamp, easeInOut, lerp, prefersReducedMotion } from '../utils/scroll.js';

/**
 * HERO + ABOUT share ONE sticky stage and ONE portrait element.
 *
 * A small scroll triggers ONE smooth, timed animation (progress p goes 0 → 1 by itself):
 *   p 0.00        hero: huge SHAMEER KT type behind the portrait
 *   p 0.06 → 0.86 the same portrait element translates + scales to the LEFT
 *   p 0.00 → 0.40 the big type fades / drifts away (gone before the About copy shows)
 *   p 0.62 → 0.92 the About copy slides in on the RIGHT
 * Only transform + opacity are touched, so it stays smooth on phones.
 */
export default function HeroAbout({ replayKey, ready, onScrollDown }) {
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const portraitRef = useRef(null);
  const titleRef = useRef(null);
  const titleSizerRef = useRef(null);
  const aboutRef = useRef(null);
  const hintRef = useRef(null);
  const spotRef = useRef(null);

  useEffect(() => {
    const track = trackRef.current;
    const stage = stageRef.current;
    const portrait = portraitRef.current;
    const title = titleRef.current;
    const sizer = titleSizerRef.current;
    const about = aboutRef.current;
    const hint = hintRef.current;
    const spot = spotRef.current;
    const reduce = prefersReducedMotion();

    let vw = 0;
    let vh = 0;
    let g = null; // geometry
    let raf = 0;

    const layout = () => {
      vw = window.innerWidth;
      vh = stage.clientHeight || window.innerHeight;
      const mobile = vw < 760;
      const A = PORTRAIT_ASPECT;

      // 1) Fit the giant type to the screen width (works with any fallback font).
      sizer.style.fontSize = '100px';
      const ratio = Math.max(1, sizer.getBoundingClientRect().width) / 100;
      const fs = mobile ? (vw * 0.94) / ratio : Math.min((vw * 0.94) / ratio, vh * 0.46);
      sizer.style.fontSize = `${fs}px`;
      const th = sizer.getBoundingClientRect().height;

      // 2) Portrait start (hero) and end (about) boxes.
      let h0, w0, left0, top0, h1, w1, left1, top1;
      if (!mobile) {
        h0 = Math.min(vh * 0.9, (vw * 0.8) / A);
        w0 = h0 * A;
        left0 = vw * 0.5 - 0.52 * w0;
        top0 = vh - h0 + vh * 0.012;
        h1 = Math.min(vh * 0.76, (vw * 0.43) / A);
        w1 = h1 * A;
        left1 = vw * 0.045;
        top1 = (vh - h1) / 2 + vh * 0.035;
      } else {
        w0 = vw * 1.38;
        h0 = w0 / A;
        if (h0 > vh * 0.7) {
          h0 = vh * 0.7;
          w0 = h0 * A;
        }
        left0 = vw * 0.5 - 0.52 * w0;
        top0 = vh - h0 + 4;
        h1 = Math.min(vh * 0.34, (vw * 0.84) / A);
        w1 = h1 * A;
        left1 = (vw - w1) / 2;
        top1 = 62;
      }
      // Title position: desktop = vertically centred like the poster; phone = the lettering
      // crosses BEHIND the face (head overlaps the middle letters, exactly like the reference).
      const titleTop = mobile ? top0 + h0 * 0.2 : vh * 0.43 - th / 2;
      title.style.top = `${titleTop}px`;
      portrait.style.width = `${w0}px`;
      portrait.style.height = `${h0}px`;

      // 3) About copy box.
      if (mobile) {
        about.style.top = `${top1 + h1 + 4}px`;
        about.style.maxHeight = `${vh - (top1 + h1 + 4) - 20}px`;
      } else {
        about.style.top = '';
        about.style.maxHeight = '';
      }
      spot.style.setProperty('--sx', `${((left1 + w1 * 0.5) / vw) * 100}%`);
      spot.style.setProperty('--sy', `${((top1 + h1 * 0.5) / vh) * 100}%`);

      g = { left0, top0, left1, top1, scale: h1 / h0 };
      update();
    };

    // ── Trigger-based transition ───────────────────────────────────────────
    // Instead of tying the animation to the scrollbar (which feels jumpy), a small scroll
    // (> TRIGGER px) starts the WHOLE hero → About animation, which then plays by itself on a
    // smooth timer. Scrolling back to the very top plays it in reverse.
    const TRIGGER = 18; // px of scroll that starts the animation
    const RELEASE = 4; // px — back near the top reverses it
    const DURATION = 1500; // ms for the full flight
    let lin = 0; // 0 = hero pose … 1 = About pose
    let target = 0;
    let last = 0;

    const render = (p) => {
      if (!g) return;
      const t = easeInOut(clamp((p - 0.04) / 0.86));

      portrait.style.transform = `translate3d(${lerp(g.left0, g.left1, t)}px, ${lerp(g.top0, g.top1, t)}px, 0) scale(${lerp(1, g.scale, t)})`;

      const tf = clamp(p / 0.45);
      title.style.opacity = String(1 - tf);
      title.style.visibility = tf >= 1 ? 'hidden' : 'visible';
      title.style.transform = `translate3d(-50%, ${-p * 80}px, 0) scale(${1 + p * 0.3})`;

      hint.style.opacity = String(1 - clamp(p / 0.12));
      const q = clamp((p - 0.55) / 0.35);
      about.style.opacity = String(q);
      about.style.transform = `translate3d(${(1 - q) * 48}px, 0, 0)`;
      about.style.pointerEvents = q > 0.6 ? 'auto' : 'none';
      spot.style.opacity = String(q);
      stage.dataset.phase = p < 0.02 ? 'hero' : p > 0.98 ? 'about' : 'move';
    };

    const step = (now) => {
      raf = 0;
      const dt = Math.min(48, now - last || 16);
      last = now;
      const d = dt / DURATION;
      lin = target > lin ? Math.min(target, lin + d) : Math.max(target, lin - d);
      render(lin);
      if (lin !== target) raf = requestAnimationFrame(step);
    };

    const update = () => {
      render(lin);
    };

    const onScroll = () => {
      const y = window.scrollY;
      const next = y > TRIGGER ? 1 : y < RELEASE ? 0 : target;
      if (next === target) return;
      target = next;
      if (reduce) {
        lin = target;
        render(lin);
      } else if (!raf) {
        last = performance.now();
        raf = requestAnimationFrame(step);
      }
    };

    // Subtle pointer parallax while in the hero pose (skipped for reduced motion / touch).
    const onPointer = (e) => {
      if (reduce || e.pointerType === 'touch' || stage.dataset.phase !== 'hero') return;
      stage.style.setProperty('--mx', String((e.clientX / vw - 0.5) * 2));
      stage.style.setProperty('--my', String((e.clientY / vh - 0.5) * 2));
    };

    target = window.scrollY > TRIGGER ? 1 : 0;
    lin = target;
    layout();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', layout);
    stage.addEventListener('pointermove', onPointer);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(layout);

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', layout);
      stage.removeEventListener('pointermove', onPointer);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section id="home" ref={trackRef} className="hero-track" aria-label="Introduction and About Shameer KT">
      <div className={`hero-stage ${ready ? 'is-ready' : ''}`} ref={stageRef} data-phase="hero">
        <div className="hero-vignette" aria-hidden="true" />
        <div className="hero-spot" ref={spotRef} aria-hidden="true" />

        {/* Oversized typography — sits BEHIND the portrait and fades away on scroll */}
        <div className="hero-title" ref={titleRef}>
          <div className="hero-title-inner hero-enter" key={`t${replayKey}`}>
            <h1 ref={titleSizerRef} className="hero-title-text">
              <span>SHAMEER</span> <span>KT</span>
            </h1>
          </div>
        </div>

        {/* THE shared portrait — one element that travels from hero to About */}
        <div className="hero-portrait" ref={portraitRef}>
          <div className="hero-portrait-inner hero-enter hero-enter-late" key={`p${replayKey}`}>
            <img
              src={PORTRAIT_SRC}
              alt={PORTRAIT_ALT}
              width="962"
              height="902"
              decoding="async"
              fetchPriority="high"
              draggable="false"
            />
          </div>
        </div>

        {/* About copy (RIGHT side) */}
        <div className="about-copy" ref={aboutRef}>
          <p className="eyebrow">ABOUT</p>
          <h2 className="about-title">{ABOUT_HEADING}</h2>
          <span className="gold-rule" aria-hidden="true" />
          <p className="about-text">{ABOUT_PARAGRAPH}</p>
        </div>

        <div className="cam-hud" aria-hidden="true">
          <span className="hud-corner c-tl" />
          <span className="hud-corner c-tr" />
          <span className="hud-corner c-bl" />
          <span className="hud-corner c-br" />
          <p className="hud-rec"><i /> REC</p>
          <p className="hud-tc"><Timecode /></p>
        </div>
        <p className="hero-meta hero-meta-l">SCENE 01 — THE OPENING</p>
        <p className="hero-meta hero-meta-r">24 FPS · SHAMEER KT</p>

        <button type="button" className="scroll-hint" ref={hintRef} onClick={onScrollDown} aria-label="Scroll down to About">
          <span>SCROLL</span>
          <i aria-hidden="true" />
        </button>
      </div>

      {/* Invisible anchor placed where the transition completes — the "About" nav target */}
      <div id="about" className="about-anchor" aria-hidden="true" />
    </section>
  );
}
