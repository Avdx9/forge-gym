'use client';
import { useEffect, useState } from 'react';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  return (
    <>
      <nav className={`nav${scrolled ? ' scrolled' : ''}`}>
        <div className="nav-logo">FOR<span>GE</span></div>
        <ul className="nav-links">
          {['Programs','Philosophy','Experience','Trainers','Join'].map(l => (
            <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
          ))}
        </ul>
        <a href="#join" className="nav-cta">Start Now</a>
        <div className="nav-burger" onClick={() => setOpen(!open)} aria-label="Menu">
          <span style={{ transform: open ? 'rotate(45deg) translateY(6px)' : 'none' }} />
          <span style={{ opacity: open ? 0 : 1 }} />
          <span style={{ transform: open ? 'rotate(-45deg) translateY(-6px)' : 'none' }} />
        </div>
      </nav>

      {open && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,17,19,0.97)',
          zIndex: 99, display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '36px',
        }}>
          {['Programs','Philosophy','Experience','Trainers','Join'].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setOpen(false)}
              style={{
                fontFamily: 'Oswald, sans-serif', fontSize: '3.5rem',
                fontWeight: 700, color: '#F0F8FA', letterSpacing: '0.1em',
                textTransform: 'uppercase', transition: 'color 0.2s',
              }}>
              {l}
            </a>
          ))}
          <a href="#join" onClick={() => setOpen(false)} style={{
            marginTop: '12px', fontFamily: 'Oswald, sans-serif',
            fontSize: '0.8rem', letterSpacing: '0.25em', textTransform: 'uppercase',
            color: '#001a1c', background: '#0FA4AF', padding: '14px 44px',
            clipPath: 'polygon(10px 0%, 100% 0%, calc(100% - 10px) 100%, 0% 100%)',
          }}>Start Now</a>
        </div>
      )}
    </>
  );
}
