'use client';
import { useEffect, useRef, useState } from 'react';

function useCount(target, dur, active) {
  const [v, setV] = useState(0);
  useEffect(() => {
    if (!active) return;
    let c = 0;
    const step = target / (dur / 14);
    const id = setInterval(() => {
      c = Math.min(c + step, target);
      setV(Math.floor(c));
      if (c >= target) clearInterval(id);
    }, 14);
    return () => clearInterval(id);
  }, [target, dur, active]);
  return v;
}

const data = [
  { value: 1400, suffix: '+', label: 'Active Members',    sub: 'and growing every month' },
  { value: 18,   suffix: '+', label: 'Expert Coaches',    sub: 'certified & competition-proven' },
  { value: 98,   suffix: '%', label: 'Retention Rate',    sub: 'members who stay beyond 6 months' },
  { value: 7,    suffix: '',  label: 'Years of Excellence', sub: 'London\'s premier performance gym' },
];

export default function Stats() {
  const ref = useRef(null);
  const [active, setActive] = useState(false);
  const blockRefs = useRef([]);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setActive(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    const obs2 = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.2 });
    blockRefs.current.forEach(el => { if (el) obs2.observe(el); });
    return () => { obs.disconnect(); obs2.disconnect(); };
  }, []);

  const counts = data.map((d, i) => useCount(d.value, 1800 + i * 200, active));

  return (
    <section className="section stats" ref={ref}>
      <div className="stats-grid">
        {data.map((d, i) => (
          <div key={d.label} className="stat-block" ref={el => blockRefs.current[i] = el}>
            <div className="stat-num">
              {counts[i].toLocaleString()}
              <span className="plus">{d.suffix}</span>
            </div>
            <div className="stat-label">{d.label}</div>
            <div className="stat-sub">{d.sub}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
