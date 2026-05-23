'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';

const trainers = [
  { seed:'trainer01', name:'Marcus Reid',   role:'Head of Strength',       tags:['Powerlifting','Olympic Lifting','Rehab'] },
  { seed:'trainer02', name:'Zara Osei',     role:'Performance Coach',      tags:['Athletics','HIIT','Nutrition'] },
  { seed:'trainer03', name:'James Callum',  role:'Conditioning Specialist', tags:['Endurance','Boxing','Mobility'] },
  { seed:'trainer04', name:'Priya Sharma',  role:'Wellness & Recovery',    tags:['Yoga','Cryotherapy','Mindset'] },
];

export default function Trainers() {
  const cardRefs = useRef([]);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.15 });
    cardRefs.current.forEach(el => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <section className="section trainers" id="trainers">
      <div style={{ maxWidth:'1300px' }}>
        <div className="section-tag">04 — The Team</div>
        <h2 className="section-title">
          Coached by<br/>
          <span className="teal">the Best</span>
        </h2>
        <p style={{ fontSize:'0.82rem', color:'var(--muted)', lineHeight:2, maxWidth:'500px', marginTop:'16px' }}>
          Every Forge coach is competition-proven, continually educated, and genuinely invested in your outcome. Not just qualified — exceptional.
        </p>
      </div>

      <div className="trainers-grid">
        {trainers.map((t, i) => (
          <div key={t.seed} className="trainer-card" ref={el => cardRefs.current[i] = el}>
            <Image
              src={`https://picsum.photos/seed/${t.seed}/480/640`}
              alt={t.name}
              fill className="trainer-img" unoptimized
            />
            <div className="trainer-overlay"/>
            <div className="trainer-info">
              <div className="trainer-name">{t.name}</div>
              <div className="trainer-role">{t.role}</div>
              <div className="trainer-tags">
                {t.tags.map(tag => <span key={tag} className="trainer-tag">{tag}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
