'use client';
import { useEffect, useState } from 'react';

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    let val = 0;
    const tick = () => {
      val = Math.min(val + Math.random() * 3 + 0.5, 100);
      setProgress(Math.floor(val));
      if (val < 100) {
        setTimeout(tick, 18 + Math.random() * 25);
      } else {
        setTimeout(() => {
          setExiting(true);
          setTimeout(onComplete, 900);
        }, 400);
      }
    };
    setTimeout(tick, 200);
  }, [onComplete]);

  return (
    <div className={`preloader${exiting ? ' exit' : ''}`}>
      <div className="preloader-wordmark">
        FORGE<span>.</span>
      </div>
      <div className="preloader-bar-wrap">
        <div className="preloader-bar" style={{ width: `${progress}%` }} />
      </div>
      <div className="preloader-pct">{progress}% — Initialising</div>
    </div>
  );
}
