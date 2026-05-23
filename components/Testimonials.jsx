'use client';
import { useRef, useEffect } from 'react';
import Image from 'next/image';

const reviews = [
  { text:"Six months at Forge and I added 40kg to my deadlift. I've trained at four different gyms in London — nothing comes close to the quality of coaching here.", name:'Daniel Forsythe', meta:'Strength Programme · 14 months', seed:'tface01', stars:5 },
  { text:"I'd tried every class-based gym going. Forge is different. The coaches actually know who you are, where you started, and exactly what you need to do next.", name:'Amara Diallo', meta:'HIIT Conditioning · 8 months', seed:'tface02', stars:5 },
  { text:"Lost 18kg and gained muscle I didn't know existed. The nutrition coaching alone was worth the membership. This place operates on a different level.", name:'Tom Ashworth', meta:'Athletic Performance · 11 months', seed:'tface03', stars:5 },
  { text:"The facilities are immaculate, the programming is intelligent, and the culture is genuinely elite without being intimidating. Best decision I've made this year.", name:'Sophie Chen', meta:'Strength Programme · 6 months', seed:'tface04', stars:5 },
  { text:"I came back from a knee injury stronger than before I got hurt. The rehab-aware coaching at Forge is exceptional. I wouldn't train anywhere else.", name:'Ravi Mehta', meta:'Athletic Performance · 18 months', seed:'tface05', stars:5 },
];

export default function Testimonials() {
  const trackRef = useRef(null);
  const dragging = useRef(false);
  const startX = useRef(0);
  const scrollL = useRef(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    const down = e => { dragging.current=true; startX.current=(e.pageX||e.touches[0].pageX)-el.offsetLeft; scrollL.current=el.scrollLeft; el.style.cursor='grabbing'; };
    const up   = () => { dragging.current=false; el.style.cursor='grab'; };
    const move = e => { if(!dragging.current) return; e.preventDefault(); const x=(e.pageX||e.touches[0].pageX)-el.offsetLeft; el.scrollLeft=scrollL.current-(x-startX.current); };
    el.addEventListener('mousedown',down); el.addEventListener('touchstart',down,{passive:true});
    el.addEventListener('mouseup',up); el.addEventListener('touchend',up);
    el.addEventListener('mousemove',move); el.addEventListener('touchmove',move,{passive:false});
    window.addEventListener('mouseup',up);
    return () => { el.removeEventListener('mousedown',down); el.removeEventListener('touchstart',down); el.removeEventListener('mouseup',up); el.removeEventListener('touchend',up); el.removeEventListener('mousemove',move); el.removeEventListener('touchmove',move); window.removeEventListener('mouseup',up); };
  }, []);

  return (
    <section className="section testimonials" id="testimonials">
      <div className="section-tag">05 — Results</div>
      <h2 className="section-title">
        Real People.<br/>
        <span className="rust">Real Gains.</span>
      </h2>
      <div ref={trackRef} className="testimonials-track">
        {reviews.map((r, i) => (
          <div key={i} className="testimonial-card">
            <div className="testimonial-stars">{'★'.repeat(r.stars)}</div>
            <p className="testimonial-text">"{r.text}"</p>
            <div className="testimonial-author">
              <div className="testimonial-avatar">
                <Image src={`https://picsum.photos/seed/${r.seed}/88/88`} alt={r.name} width={44} height={44} unoptimized/>
              </div>
              <div>
                <div className="testimonial-name">{r.name}</div>
                <div className="testimonial-meta">{r.meta}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
