'use client';
import { useEffect, useRef } from 'react';

const pillars = [
  { num:'01', name:'Discipline', desc:'Every rep, every session, every sacrifice — discipline is the foundation that outlasts motivation.' },
  { num:'02', name:'Intensity',  desc:'We train at the edge of what is possible. Not comfortable. Not manageable. Possible.' },
  { num:'03', name:'Evolution',  desc:'Your body rewrites itself in the gym. Every week you leave stronger than you entered.' },
];

export default function Philosophy() {
  const pillarsRef = useRef([]);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.style.opacity = '1'; });
    }, { threshold: 0.2 });
    pillarsRef.current.forEach(el => { if (el) { el.style.opacity = '0'; el.style.transition = 'opacity 0.9s ease'; obs.observe(el); }});
    return () => obs.disconnect();
  }, []);

  return (
    <section className="section philosophy" id="philosophy">
      <div className="philosophy-hero">
        <div className="philosophy-bg-text" aria-hidden="true">FORGE</div>
        <div className="philosophy-content">
          <div className="section-tag">02 — Our Philosophy</div>
          <blockquote className="philosophy-quote">
            Built in<br/>
            <strong>darkness.</strong><br/>
            Revealed<br/>in fire.
          </blockquote>
          <p className="philosophy-body">
            Forge was built on a single belief: that every human body contains an athlete waiting to be unlocked. Not through shortcuts or trends — but through relentless, structured, science-backed training delivered by coaches who have walked the path themselves.
          </p>
          <p className="philosophy-body">
            We don't offer a gym. We offer a transformation system. When you walk through our doors, you enter a covenant with your potential.
          </p>
          <div style={{ marginTop: '36px' }}>
            <a href="#join" className="btn-primary"><span>Join the Movement</span></a>
          </div>

          <div className="philosophy-pillars">
            {pillars.map((p, i) => (
              <div className="pillar" key={p.num} ref={el => pillarsRef.current[i] = el}>
                <div className="pillar-num">{p.num}</div>
                <div className="pillar-name">{p.name}</div>
                <p className="pillar-desc">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
