import { useEffect, useState } from 'react';
import { nav, profile } from './data.js';

export default function Nav({ show }) {
  const [active, setActive] = useState('home');
  const [open, setOpen] = useState(false);
  const [solid, setSolid] = useState(false);

  useEffect(() => {
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-45% 0px -50% 0px' }
    );
    nav.forEach((n) => { const s = document.getElementById(n.toLowerCase()); s && io.observe(s); });
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true });
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll); };
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('menu-open', open);
    const esc = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, [open]);

  return (
    <header className={`nav ${show ? 'on' : ''} ${solid ? 'solid' : ''}`}>
      <a className="brand" href="#home" onClick={() => setOpen(false)}>SHYAM HARI</a>
      <button className="burger" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(!open)}><span /><span /></button>
      <nav className={`links ${open ? 'open' : ''}`} aria-label="Primary">
        {nav.map((n) => (
          <a key={n} href={`#${n.toLowerCase()}`} className={active === n.toLowerCase() ? 'active' : ''} onClick={() => setOpen(false)}>{n}</a>
        ))}
      </nav>
    </header>
  );
}
