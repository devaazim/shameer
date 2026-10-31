import { useCallback, useEffect, useRef, useState } from 'react';
import { HIGHLIGHT_LINKS, SECTION_MAP, SHOW_GUESTBOOK } from './data/site.js';
import useActiveSection from './hooks/useActiveSection.js';
import { Reveal } from './hooks/useReveal.js';
import { scrollToId, scrollToTop } from './utils/scroll.js';
import { useToast } from './components/Toast.jsx';
import Loader from './components/Loader.jsx';
import Nav from './components/Nav.jsx';
import HeroAbout from './components/HeroAbout.jsx';
import LifeTimeline from './components/LifeTimeline.jsx';
import ThoughtToMarriage from './components/ThoughtToMarriage.jsx';
import Gallery from './components/Gallery.jsx';
import PorottaHallOfFame from './components/PorottaHallOfFame.jsx';
import ShameerFinance from './components/ShameerFinance.jsx';
import FullMarksDepartment from './components/FullMarksDepartment.jsx';
import WorkMachine from './components/WorkMachine.jsx';
import KidsVsIppa from './components/KidsVsIppa.jsx';
import ShameerOS from './components/ShameerOS.jsx';
import ShameerAwards from './components/ShameerAwards.jsx';
import AskShameerAI from './components/AskShameerAI.jsx';
import Guestbook from './components/Guestbook.jsx';
import Ending from './components/Ending.jsx';
import Footer from './components/Footer.jsx';
import CursorFX from './components/CursorFX.jsx';
import Marquee from './components/Marquee.jsx';

const SECRET_WORD = 'porotta';

export default function App() {
  const toast = useToast();
  const [introDone, setIntroDone] = useState(false);
  const [galleryCat, setGalleryCat] = useState('family');
  const [pulse, setPulse] = useState(0);
  const [replayKey, setReplayKey] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const progressRef = useRef(null);
  const active = useActiveSection(SECTION_MAP);

  // Start every visit at the top; lock scrolling only while the intro plays.
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('is-loading', !introDone);
    return () => document.documentElement.classList.remove('is-loading');
  }, [introDone]);

  // Top progress bar + back-to-top visibility (one rAF-throttled scroll listener).
  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const y = window.scrollY;
      if (progressRef.current) progressRef.current.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
      setShowTop(y > window.innerHeight * 1.2);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const go = useCallback((id) => (id === 'home' ? scrollToTop() : scrollToId(id)), []);

  // Timeline mini card → select the gallery tab, then scroll to the gallery.
  const openGallery = useCallback((cat) => {
    setGalleryCat(cat);
    setPulse((p) => p + 1);
    scrollToId('gallery');
  }, []);

  const restart = useCallback(() => {
    scrollToTop();
    setReplayKey((k) => k + 1); // replays only the short hero entrance, not the long intro
  }, []);

  // Easter egg #4 — type "porotta" anywhere (outside inputs). Touch: tap the footer wordmark 5×.
  const unlock = useCallback(
    () => toast('Achievement unlocked: Porotta Whisperer. You found the secret word.', { icon: '🏆', duration: 5200 }),
    [toast],
  );
  useEffect(() => {
    let buf = '';
    const onKey = (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey || e.key.length !== 1) return;
      const t = e.target;
      if (t && (t.tagName === 'INPUT' || t.tagName === 'TEXTAREA' || t.tagName === 'SELECT' || t.isContentEditable)) return;
      buf = (buf + e.key.toLowerCase()).slice(-SECRET_WORD.length);
      if (buf === SECRET_WORD) {
        buf = '';
        unlock();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [unlock]);

  return (
    <>
      <div className="grain" aria-hidden="true" />
      <CursorFX />
      {!introDone && <Loader onDone={() => setIntroDone(true)} />}
      <div className="progress-top" ref={progressRef} aria-hidden="true" />
      <Nav active={active} onNavigate={go} />

      <main>
        <HeroAbout replayKey={replayKey} ready={introDone} onScrollDown={() => go('about')} />
        <Marquee />
        <div className="chapter chapter-paper">
        <LifeTimeline onOpenGallery={openGallery} />
        <ThoughtToMarriage />
        <Gallery category={galleryCat} onCategoryChange={setGalleryCat} pulse={pulse} />
        </div>
        <div className="chapter chapter-leaf">
        <section id="highlights" className="highlights" aria-labelledby="hl-h">
          <div className="sec hl-head">
            <Reveal>
              <p className="eyebrow">SPECIAL FEATURES</p>
              <h2 id="hl-h" className="sec-title">THE UNOFFICIAL FILES.</h2>
              <p className="sub">Six affectionate, entirely fictional dashboards. Everything is clickable.</p>
            </Reveal>
            <nav className="hl-chips" aria-label="Highlights shortcuts">
              {HIGHLIGHT_LINKS.map((l) => (
                <button key={l.id} type="button" className="chip chip-btn" onClick={() => go(l.id)}>
                  {l.label}
                </button>
              ))}
            </nav>
          </div>
          <PorottaHallOfFame />
          <ShameerFinance />
          <FullMarksDepartment />
          <WorkMachine />
          <KidsVsIppa />
          <ShameerOS />
        </section>
        </div>
        <Marquee text="THE END IS ONLY THE CREDITS" tone="paper" />
        <div className="chapter chapter-ink">
        <ShameerAwards />
        <AskShameerAI />
        {SHOW_GUESTBOOK && <Guestbook />}
        <Ending onRestart={restart} />
        </div>
      </main>

      <Footer onSecret={unlock} />

      <button type="button" className={`to-top ${showTop ? 'show' : ''}`} onClick={scrollToTop} aria-label="Back to top" tabIndex={showTop ? 0 : -1}>
        ↑
      </button>
    </>
  );
}
