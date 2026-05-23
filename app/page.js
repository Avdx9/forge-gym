'use client';
import { useState, useEffect } from 'react';
import Preloader    from '@/components/Preloader';
import Navigation  from '@/components/Navigation';
import Hero        from '@/components/Hero';
import Marquee     from '@/components/Marquee';
import Philosophy  from '@/components/Philosophy';
import Programs    from '@/components/Programs';
import Stats       from '@/components/Stats';
import Experience  from '@/components/Experience';
import Trainers    from '@/components/Trainers';
import Testimonials from '@/components/Testimonials';
import Join        from '@/components/Join';
import Footer      from '@/components/Footer';

export default function Home() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!loaded) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      import('lenis').then(({ default: Lenis }) => {
        const lenis = new Lenis({ duration: 1.4, easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
        const raf = time => { lenis.raf(time); requestAnimationFrame(raf); };
        requestAnimationFrame(raf);
        return () => lenis.destroy();
      }).catch(() => {});
    }
  }, [loaded]);

  return (
    <>
      {!loaded && <Preloader onComplete={() => setLoaded(true)} />}
      <div style={{ opacity: loaded ? 1 : 0, transition: 'opacity 1s cubic-bezier(0.16,1,0.3,1)' }}>
        <Navigation />
        <main>
          <Hero />
          <Marquee />
          <Philosophy />
          <Programs />
          <Stats />
          <Experience />
          <Trainers />
          <Testimonials />
          <Join />
        </main>
        <Footer />
      </div>
    </>
  );
}
