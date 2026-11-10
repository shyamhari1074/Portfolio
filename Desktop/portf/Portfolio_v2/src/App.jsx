import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import Intro from './Intro.jsx';
const Hero = lazy(() => import('./Hero.jsx')); // keeps Three.js out of the first paint
import Nav from './Nav.jsx';
import { About, Experience, Projects, Skills, Contact, Footer, useReveal } from './Sections.jsx';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
let seen = false;
try { seen = sessionStorage.getItem('intro') === '1'; } catch { /* storage unavailable */ }
const skipIntro = reduced || seen;

export default function App() {
  const ctl = useRef({ t0: skipIntro ? -1e9 : null }); // t0: when the portrait starts forming
  const [done, setDone] = useState(skipIntro);
  const glow = useRef();
  useReveal();

  useEffect(() => { document.documentElement.classList.toggle('lock', !done); }, [done]);

  useEffect(() => {
    if (reduced || !matchMedia('(pointer: fine)').matches) return;
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    const tick = () => { x += (tx - x) * 0.12; y += (ty - y) * 0.12; glow.current.style.transform = `translate(${x}px,${y}px)`; raf = Math.abs(tx - x) + Math.abs(ty - y) > 0.5 ? requestAnimationFrame(tick) : 0; };
    const mv = (e) => { tx = e.clientX; ty = e.clientY; glow.current.style.opacity = 1; if (!raf) raf = requestAnimationFrame(tick); };
    window.addEventListener('pointermove', mv, { passive: true });
    return () => { window.removeEventListener('pointermove', mv); cancelAnimationFrame(raf); };
  }, []);

  const form = () => { ctl.current.t0 = performance.now(); };
  const finish = () => { try { sessionStorage.setItem('intro', '1'); } catch { /* ignore */ } setDone(true); };

  return (
    <>
      {!done && <Intro onForm={form} onDone={finish} />}
      <div className="glow" ref={glow} aria-hidden="true" />
      <Nav show={done} />
      <main>
        <Suspense fallback={<section id="home" className="hero" />}><Hero ctl={ctl} reduced={reduced} /></Suspense>
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
