'use client';
import dynamic from 'next/dynamic';
const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false });

export default function Hero() {
  return (
    <>
      <div className="hero-canvas-wrap"><HeroCanvas /></div>
      <section className="hero" id="hero">
        {/* Radial vignette */}
        <div style={{
          position:'absolute', inset:0, zIndex:1, pointerEvents:'none',
          background:'radial-gradient(ellipse 75% 75% at 50% 50%, transparent 20%, rgba(0,17,19,0.55) 100%)',
        }}/>
        {/* Bottom fade */}
        <div style={{
          position:'absolute', bottom:0, left:0, right:0,
          height:'260px', zIndex:1, pointerEvents:'none',
          background:'linear-gradient(to top, #001119, transparent)',
        }}/>

        <div className="hero-content">
          <div className="hero-tag">
            <div className="hero-tag-line"/>
            <span className="hero-tag-text">London · Elite Performance · Est. 2018</span>
            <div className="hero-tag-line"/>
          </div>

          <h1 className="hero-title">
            Forge
            <span className="accent">Your</span>
            <span className="outline">Limits</span>
          </h1>

          <p className="hero-sub">Where potential becomes power</p>

          <div className="hero-actions">
            <a href="#join" className="btn-primary"><span>Start Training</span></a>
            <a href="#programs" className="btn-ghost">View Programs</a>
          </div>
        </div>

        <div className="hero-scroll">
          <div className="hero-scroll-line"/>
          <span className="hero-scroll-txt">Scroll</span>
        </div>
      </section>
    </>
  );
}
