'use client';

export default function Join() {
  const R1 = 280, R2 = 200, R3 = 140;
  const mkNodes = (r, count, color) =>
    Array.from({ length: count }).map((_, i) => {
      const a = (i / count) * Math.PI * 2;
      return { cx: r + r * Math.cos(a), cy: r + r * Math.sin(a), color };
    });

  return (
    <section className="section join" id="join">
      <div className="join-glow"/>

      {/* Outer ring */}
      <div className="join-ring" style={{ width: R1*2, height: R1*2 }}>
        <svg width={R1*2} height={R1*2} style={{ animation:'orbitSpin 25s linear infinite', display:'block' }}>
          <circle cx={R1} cy={R1} r={R1-2} fill="none" stroke="rgba(15,164,175,0.1)" strokeWidth="1"/>
          <circle cx={R1} cy={R1} r={R1-2} fill="none" stroke="rgba(15,164,175,0.2)" strokeWidth="0.5" strokeDasharray="14 20" strokeLinecap="round"/>
          {mkNodes(R1, 6, '#0FA4AF').map((n,i) => (
            <g key={i}><circle cx={n.cx} cy={n.cy} r="4" fill={n.color} opacity="0.7"/><circle cx={n.cx} cy={n.cy} r="9" fill="none" stroke={n.color} strokeWidth="0.5" opacity="0.3"/></g>
          ))}
        </svg>
      </div>

      {/* Mid ring */}
      <div className="join-ring" style={{ width: R2*2, height: R2*2 }}>
        <svg width={R2*2} height={R2*2} style={{ animation:'orbitSpinR 18s linear infinite', display:'block' }}>
          <circle cx={R2} cy={R2} r={R2-2} fill="none" stroke="rgba(150,71,52,0.12)" strokeWidth="1"/>
          <circle cx={R2} cy={R2} r={R2-2} fill="none" stroke="rgba(150,71,52,0.25)" strokeWidth="0.6" strokeDasharray="5 12" strokeLinecap="round"/>
          {mkNodes(R2, 4, '#964734').map((n,i) => (
            <circle key={i} cx={n.cx} cy={n.cy} r="3" fill={n.color} opacity="0.6"/>
          ))}
        </svg>
      </div>

      {/* Inner ring */}
      <div className="join-ring" style={{ width: R3*2, height: R3*2 }}>
        <svg width={R3*2} height={R3*2} style={{ animation:'orbitSpin 12s linear infinite', display:'block' }}>
          <circle cx={R3} cy={R3} r={R3-2} fill="none" stroke="rgba(175,221,229,0.07)" strokeWidth="1"/>
          {mkNodes(R3, 3, '#AFDDE5').map((n,i) => (
            <circle key={i} cx={n.cx} cy={n.cy} r="2" fill={n.color} opacity="0.4"/>
          ))}
        </svg>
      </div>

      <div className="join-content">
        <span className="join-tag">06 — Begin</span>
        <h2 className="join-title">
          Start Your
          <span className="teal">Forge</span>
        </h2>
        <p className="join-sub">
          First session is free. No contracts. No excuses.
        </p>
        <div className="join-options">
          <a href="tel:+442071234567" className="btn-primary"><span>Book Free Trial</span></a>
          <a href="mailto:hello@forgegym.co.uk" className="btn-ghost">Contact Us</a>
        </div>

        <div className="join-details">
          {[
            { label:'Location',    value:'12 Bermondsey St, London SE1 3UQ' },
            { label:'Open Hours',  value:'Mon – Fri  5:30am – 11:00pm' },
            { label:'Weekend',     value:'Sat – Sun  7:00am – 9:00pm' },
            { label:'Trial Session', value:'100% Free · No Card Required' },
          ].map(d => (
            <div key={d.label} className="join-detail">
              <div className="label">{d.label}</div>
              <div className="value">{d.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
