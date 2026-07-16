import { useEffect, useRef } from "react";
import "./OpeningExperience.css";

const INTRO_DURATION = 8000;

export default function OpeningExperience({ onComplete }) {
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    audio?.play().catch(() => {});
    const timer = window.setTimeout(onComplete, INTRO_DURATION);

    return () => {
      window.clearTimeout(timer);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, [onComplete]);

  const base = import.meta.env.BASE_URL;

  return (
    <section className="marble-intro" aria-label="Sinematik düğün davetiyesi açılışı">
      <audio
        ref={audioRef}
        src={`${base}music/luxury-marble-intro-8s.wav`}
        preload="auto"
      />

      <div className="marble-corridor" />
      <div className="marble-shade" />
      <div className="gold-architecture" aria-hidden="true">
        <i /><i /><i /><i />
      </div>
      <div className="gold-dust" aria-hidden="true" />

      <div className="ring-stage" aria-hidden="true">
        <div className="ring-halo" />
        <img className="opening-ring ring-left" src={`${base}images/opening/ring-1.png`} alt="" />
        <img className="opening-ring ring-right" src={`${base}images/opening/ring-2.png`} alt="" />
        <div className="ring-flare" />
      </div>

      <div className="opening-monogram">
        <p>Bir ömür boyu</p>
        <div className="opening-rule"><i /></div>
        <h1><span>Bu Gece,</span><span>Sonsuzluğun İlk Gecesi</span></h1>
        <time dateTime="2027-06-12">12 · 06 · 2027</time>
      </div>

      <div className="door-light" aria-hidden="true" />
      <div className="marble-vignette" aria-hidden="true" />
      <div className="marble-exit" aria-hidden="true" />
    </section>
  );
}
