'use client';
import { useEffect, useRef } from 'react';

export default function Footer() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    let W = cv.offsetWidth, H = cv.offsetHeight;
    cv.width = W; cv.height = H;
    const pts = Array.from({ length: 50 }, () => ({
      x: Math.random()*W, y: Math.random()*H,
      vx:(Math.random()-0.5)*0.25, vy:(Math.random()-0.5)*0.2,
      r:Math.random()*1.1+0.3,
      c: Math.random() > 0.5 ? '15,164,175' : '150,71,52',
      a:Math.random()*0.45+0.1,
    }));
    let id;
    const draw = () => {
      ctx.clearRect(0,0,W,H);
      pts.forEach(p => {
        p.x+=p.vx; p.y+=p.vy;
        if(p.x<0)p.x=W; if(p.x>W)p.x=0;
        if(p.y<0)p.y=H; if(p.y>H)p.y=0;
        ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=`rgba(${p.c},${p.a})`; ctx.fill();
      });
      id=requestAnimationFrame(draw);
    };
    draw();
    const onResize=()=>{ W=cv.offsetWidth; H=cv.offsetHeight; cv.width=W; cv.height=H; };
    window.addEventListener('resize',onResize);
    return ()=>{ cancelAnimationFrame(id); window.removeEventListener('resize',onResize); };
  }, []);

  const year = new Date().getFullYear();
  return (
    <footer className="footer" id="contact" style={{ position:'relative' }}>
      <canvas ref={canvasRef} style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none', opacity:0.6 }}/>
      <div style={{ position:'relative', zIndex:1 }}>
        <div className="footer-top">
          <div>
            <div className="footer-logo">FOR<span>GE</span></div>
            <p className="footer-desc">London's premier performance gym. Where ordinary people become extraordinary athletes.</p>
            <div className="footer-social">
              {[['IG','https://instagram.com'],['FB','https://facebook.com'],['TT','https://tiktok.com'],['YT','https://youtube.com']].map(([l,h])=>(
                <a key={l} href={h} target="_blank" rel="noopener noreferrer" className="social-link">{l}</a>
              ))}
            </div>
          </div>
          <div className="footer-col">
            <div className="col-title">Programs</div>
            <ul>
              {['Strength & Power','HIIT Conditioning','Athletic Performance','Personal Training','Online Coaching','Corporate Wellness'].map(s=>(
                <li key={s}><a href="#programs">{s}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <div className="col-title">Forge</div>
            <ul>
              {['Our Story','The Team','Facilities','Nutrition Bar','Recovery Suite','Press & Media'].map(s=>(
                <li key={s}><a href="#philosophy">{s}</a></li>
              ))}
            </ul>
          </div>
          <div className="footer-col">
            <div className="col-title">Visit</div>
            <p className="address">12 Bermondsey Street<br/>London Bridge<br/>London, SE1 3UQ<br/>United Kingdom</p>
            <div style={{ marginTop:'18px', display:'flex', flexDirection:'column', gap:'8px' }}>
              <a href="tel:+442071234567" style={{ fontSize:'0.78rem', color:'var(--muted)', transition:'color 0.3s' }}>+44 (0)20 7123 4567</a>
              <a href="mailto:hello@forgegym.co.uk" style={{ fontSize:'0.78rem', color:'var(--muted)', transition:'color 0.3s' }}>hello@forgegym.co.uk</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div className="footer-copy">© {year} Forge Performance Ltd. All rights reserved. Company No. 11234567. Registered in England & Wales.</div>
          <div className="footer-legal">
            <a href="#">Privacy Policy</a>
            <a href="#">Terms of Service</a>
            <a href="#">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
