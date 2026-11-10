import { useEffect, useRef } from 'react';
import { about, interests, stats, services, projects, skills, journey, virtual, profile } from './data.js';

const Arrow = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true"><path d="M3 9l6-6M4 3h5v5" fill="none" stroke="currentColor" strokeWidth="1.2" /></svg>
);

export function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.rv');
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { els.forEach((e) => e.classList.add('in')); return; }
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.12 });
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, []);
}

export function About() {
  return (
    <section id="about" className="sec about">
      <div className="about-img rv"><img src="/about.png" alt="Halftone portrait of Shyam Hari" loading="lazy" width="620" height="827" /></div>
      <div className="about-body">
        <h2 className="h2 rv">About</h2>
        {about.map((t, i) => <p key={i} className="lead rv">{t}</p>)}
        <ul className="chips rv" aria-label="Interests">{interests.map((i) => <li key={i}>{i}</li>)}</ul>
        <dl className="stats rv">{stats.map(([n, l]) => <div key={l}><dt>{n}</dt><dd>{l}</dd></div>)}</dl>
        <div className="svc rv">
          <h3 className="h3">What I do</h3>
          {services.map(([t, d]) => <div key={t} className="svc-row"><h4>{t}</h4><p>{d}</p></div>)}
        </div>
      </div>
    </section>
  );
}

export function Experience() {
  return (
    <section id="experience" className="sec">
      <h2 className="h2 rv">Experience</h2>
      <ol className="tl">
        {journey.map((j) => (
          <li key={j.title} className="rv">
            <h3>{j.title}</h3>
            <p className="place">{j.place}</p>
            <p>{j.note}</p>
            {j.steps && <p className="steps">{j.steps.join('  /  ')}</p>}
          </li>
        ))}
      </ol>
      <p className="fine rv">{virtual}</p>
    </section>
  );
}

export function Projects() {
  const glow = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
  };
  return (
    <section id="projects" className="sec">
      <h2 className="h2 rv">Projects</h2>
      <div className="grid">
        {projects.map((p, i) => (
          <article key={p.name} className={`proj rv ${i < 3 ? 'feat' : ''}`} data-mark={p.mark} onPointerMove={glow}>
            <div className="proj-main">
              <h3>{p.name}</h3>
              <p>{p.desc}</p>
              <ul className="tags" aria-label="Technologies">{p.tags.map((t) => <li key={t}>{t}</li>)}</ul>
              {p.github && <a className="plink" href={p.github} target="_blank" rel="noopener noreferrer">GitHub <Arrow /></a>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function Skills() {
  return (
    <section id="skills" className="sec">
      <h2 className="h2 rv">Skills</h2>
      <div className="skills">
        {skills.map(([g, items]) => (
          <div key={g} className="skill-row rv">
            <h3>{g}</h3>
            <ul>{items.map((i) => <li key={i}>{i}</li>)}</ul>
          </div>
        ))}
      </div>
    </section>
  );
}

function Dust() {
  const c = useRef();
  useEffect(() => {
    const cv = c.current, x = cv.getContext('2d');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const n = innerWidth < 768 ? 40 : 90;
    let w = 0, h = 0, raf = 0, on = false;
    const P = Array.from({ length: n }, () => ({ x: Math.random(), y: Math.random(), r: Math.random() * 1.2 + 0.3, v: Math.random() * 0.00006 + 0.00002, a: Math.random() * 0.5 + 0.15 }));
    const size = () => { const d = Math.min(devicePixelRatio || 1, 1.5); w = cv.clientWidth; h = cv.clientHeight; cv.width = w * d; cv.height = h * d; x.setTransform(d, 0, 0, d, 0, 0); frame(); };
    const frame = () => {
      x.clearRect(0, 0, w, h);
      for (const p of P) { x.globalAlpha = p.a; x.fillStyle = '#b9c6e8'; x.beginPath(); x.arc(p.x * w, p.y * h, p.r, 0, 6.283); x.fill(); }
    };
    const loop = () => { if (!on) return; for (const p of P) { p.y -= p.v * 16; if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); } } frame(); raf = requestAnimationFrame(loop); };
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting && !reduced) { if (!on) { on = true; loop(); } } else { on = false; cancelAnimationFrame(raf); } });
    io.observe(cv); const ro = new ResizeObserver(size); ro.observe(cv);
    return () => { on = false; cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, []);
  return <canvas ref={c} className="dust" aria-hidden="true" />;
}

export function Contact() {
  return (
    <section id="contact" className="sec contact">
      <Dust />
      <h2 className="big metal rv">LET&rsquo;S BUILD SOMETHING INTELLIGENT.</h2>
      <div className="contact-row rv">
        <div className="contact-links">
          <a href={`mailto:${profile.email}`}>{profile.email}</a>
          <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn <Arrow /></a>
          <a href={profile.github} target="_blank" rel="noopener noreferrer">GitHub <Arrow /></a>
        </div>
        <div className="hero-actions">
          <a className="btn" href={`mailto:${profile.email}`}>Send an email</a>
          <a className="btn ghost" href={profile.resume} download="Shyam_Hari_Resume.pdf">Download resume</a>
        </div>
      </div>
    </section>
  );
}

export const Footer = () => (
  <footer className="foot"><span>SHYAM HARI</span><span>&copy; {new Date().getFullYear()}</span></footer>
);
