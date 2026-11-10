import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

const letters = (t) => [...t].map((c, i) => <span key={i} className="il">{c === ' ' ? '\u00a0' : c}</span>);
const hidden = () => ({ opacity: 0, y: 70, rotateX: -80, rotateY: 35, filter: 'blur(10px)', transformPerspective: 800 });
const shown = (stagger) => ({ opacity: 1, y: 0, rotateX: 0, rotateY: 0, filter: 'blur(0px)', duration: 0.9, stagger, ease: 'power3.out' });

// Black screen -> atmospheric glow -> SHYAM HARI tumbles in -> morphs to PORTFOLIO -> hands off to the hero.
export default function Intro({ onForm, onDone }) {
  const root = useRef(), a = useRef(), b = useRef(), tl = useRef();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const A = a.current.children, B = b.current.children;
      tl.current = gsap.timeline({ onComplete: onDone })
        .fromTo('.intro-glow', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 1.1, ease: 'power2.out' })
        .fromTo(A, hidden(), shown(0.07), 0.35)
        .to(A, { opacity: 0, y: -40, filter: 'blur(8px)', duration: 0.5, stagger: 0.03, ease: 'power2.in' }, '+=0.35')
        .fromTo(B, hidden(), shown(0.06), '-=0.1')
        .call(onForm, null, '+=0.1')
        .to(root.current, { opacity: 0, duration: 0.9, ease: 'power2.inOut' }, '+=0.35');
    }, root);
    return () => ctx.revert();
  }, []);

  const skip = () => tl.current && tl.current.timeScale(6);

  return (
    <div className="intro" ref={root} onClick={skip} role="presentation">
      <div className="intro-glow" />
      <div className="intro-word metal" ref={a} aria-hidden="true">{letters('SHYAM')}</div>
      <div className="intro-word metal" ref={b} aria-hidden="true">{letters('PORTFOLIO')}</div>
      <button className="intro-skip" onClick={skip}>Skip intro</button>
    </div>
  );
}
