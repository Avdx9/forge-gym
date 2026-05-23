'use client';
import { useEffect, useRef } from 'react';

const programs = [
  {
    num: '01', icon: '⚡',
    name: 'Strength\n& Power',
    desc: 'Progressive overload, compound movement mastery, and periodisation science. Built for those who want to move serious weight and build undeniable strength.',
    features: ['5-day structured split', 'Powerlifting & Olympic lifting', '1-on-1 form coaching', 'Monthly strength assessments'],
    price: '89', per: 'mo',
    img: 'gym01',
  },
  {
    num: '02', icon: '🔥',
    name: 'HIIT\nConditioning',
    desc: 'High-intensity interval training meets functional fitness. Burn fat, build cardiovascular power, and move like an athlete in 45-minute sessions that leave nothing behind.',
    features: ['Daily group sessions', 'Heart-rate zone tracking', 'Nutrition protocol', 'Recovery sessions included'],
    price: '75', per: 'mo',
    img: 'gym02',
  },
  {
    num: '03', icon: '🎯',
    name: 'Athletic\nPerformance',
    desc: 'Speed, agility, power output, and sport-specific conditioning. Whether you compete or simply want to move like you do, this programme rewires your athleticism.',
    features: ['Speed & agility drills', 'Sport-specific protocols', 'Video movement analysis', 'Bi-weekly benchmarks'],
    price: '119', per: 'mo',
    img: 'gym03',
  },
];

export default function Programs() {
  const cardRefs = useRef([]);
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.15 });
    cardRefs.current.forEach(el => { if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, []);

  return (
    <section className="section programs" id="programs">
      <div className="section-tag">01 — Programs</div>
      <h2 className="section-title">
        Choose Your<br/>
        <span className="teal">Path</span>
      </h2>

      <div className="programs-grid">
        {programs.map((p, i) => (
          <div key={p.num} className="program-card" ref={el => cardRefs.current[i] = el}>
            <div className="program-card-bg"
              style={{ backgroundImage: `url(https://picsum.photos/seed/${p.img}/600/800)` }}/>
            <div className="program-card-inner">
              <div className="program-num">{p.num}</div>
              <div className="program-icon">{p.icon}</div>
              <h3 className="program-name" style={{ whiteSpace: 'pre-line' }}>{p.name}</h3>
              <p className="program-desc">{p.desc}</p>
              <ul className="program-features">
                {p.features.map(f => <li key={f}>{f}</li>)}
              </ul>
              <div className="program-footer">
                <div className="program-price">
                  <sup>£</sup>{p.price}
                  <span className="per">/{p.per}</span>
                </div>
                <div className="program-arrow">→</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ textAlign:'center', marginTop:'52px' }}>
        <a href="#join" className="btn-primary"><span>Book a Free Trial Session</span></a>
      </div>
    </section>
  );
}
