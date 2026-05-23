'use client';
import { useEffect, useRef } from 'react';
import Image from 'next/image';

const points = [
  { icon: '🏋', text: '22,000 sq ft of premium training floor — power racks, Olympic platforms, turf lanes, and cardio decks.' },
  { icon: '🧬', text: 'InBody composition scanning, VO2 max testing, and bi-weekly benchmark sessions included.' },
  { icon: '🍃', text: 'In-house nutrition bar, post-session recovery protocols, and cryotherapy pods.' },
  { icon: '📱', text: 'Forge app with your programme, progress tracking, coach messaging, and booking — always in your pocket.' },
];

export default function Experience() {
  const sectionRef = useRef(null);
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        el.querySelectorAll('.reveal').forEach((node, i) => {
          setTimeout(() => {
            node.style.opacity    = '1';
            node.style.transform  = 'translateY(0)';
          }, i * 120);
        });
      }
    }, { threshold: 0.15 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section className="section experience" id="experience" ref={sectionRef}>
      <div className="experience-inner">
        {/* Visuals */}
        <div className="exp-visual reveal" style={{ opacity:0, transform:'translateX(-30px)', transition:'all 0.9s cubic-bezier(0.16,1,0.3,1)' }}>
          <Image
            src="https://picsum.photos/seed/gymA/640/800"
            alt="Forge gym interior"
            fill
            style={{ objectFit:'cover', filter:'contrast(1.1) saturate(0.75)' }}
            unoptimized
          />
          <div className="exp-img-overlay">
            <Image
              src="https://picsum.photos/seed/gymB/400/400"
              alt="Training session"
              fill
              style={{ objectFit:'cover', filter:'contrast(1.1) saturate(0.7)' }}
              unoptimized
            />
          </div>
          <div className="exp-accent-line"/>
          {/* Floating stat badge */}
          <div style={{
            position:'absolute', top:'24px', right:'-16px',
            background:'var(--rust)', padding:'18px 22px',
            clipPath:'polygon(8px 0%,100% 0%,calc(100% - 8px) 100%,0% 100%)',
          }}>
            <div style={{ fontFamily:'Oswald,sans-serif', fontSize:'2rem', fontWeight:700, color:'#F0F8FA', lineHeight:1 }}>4.9</div>
            <div style={{ fontSize:'0.55rem', letterSpacing:'0.2em', textTransform:'uppercase', color:'rgba(240,248,250,0.7)', marginTop:'4px' }}>Google Rating</div>
          </div>
        </div>

        {/* Text */}
        <div className="exp-text">
          <div className="section-tag reveal" style={{ opacity:0, transform:'translateY(20px)', transition:'all 0.8s cubic-bezier(0.16,1,0.3,1)' }}>
            03 — The Experience
          </div>
          <h2 className="exp-heading reveal" style={{ opacity:0, transform:'translateY(24px)', transition:'all 0.9s cubic-bezier(0.16,1,0.3,1) 0.1s' }}>
            This isn't<br/>a gym.<br/><span className="teal">It's a forge.</span>
          </h2>
          <p className="exp-body reveal" style={{ opacity:0, transform:'translateY(20px)', transition:'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.15s' }}>
            Everything in this building was designed with one question: does it make you better? From the angle of our power racks to the ambient temperature on the training floor — every detail is intentional.
          </p>

          <ul className="exp-list">
            {points.map((p, i) => (
              <li key={i} className="reveal" style={{ opacity:0, transform:'translateY(16px)', transition:`all 0.7s cubic-bezier(0.16,1,0.3,1) ${0.2 + i * 0.08}s` }}>
                <div className="icon">{p.icon}</div>
                <span>{p.text}</span>
              </li>
            ))}
          </ul>

          <div className="reveal" style={{ opacity:0, transform:'translateY(16px)', transition:'all 0.7s cubic-bezier(0.16,1,0.3,1) 0.55s' }}>
            <a href="#join" className="btn-primary"><span>Book a Tour</span></a>
          </div>
        </div>
      </div>
    </section>
  );
}
