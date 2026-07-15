import { useEffect, useRef } from "react";
import "./OpeningExperience.css";

const INTRO_DURATION = 8000;
const snowflakes = Array.from({ length: 34 });
const handwrittenName = (name, startAt) => (
  <span className="handwritten-name" aria-label={name}>
    {Array.from(name).map((letter, index) => (
      <i
        key={`${name}-${index}`}
        aria-hidden="true"
        style={{ "--write-delay": `${startAt + index * 0.2}s` }}
      >
        {letter}
      </i>
    ))}
  </span>
);

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

  return (
    <section className="winter-intro" aria-label="Sinematik kış düğünü açılışı">
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}music/ring-intro-7s.wav`}
        preload="auto"
      />

      <div className="winter-scene" />
      <div className="winter-night" />
      <div className="aurora aurora-one" />
      <div className="aurora aurora-two" />
      <div className="winter-stars" />

      <div className="winter-snow" aria-hidden="true">
        {snowflakes.map((_, index) => (
          <i key={index} style={{ "--flake": index }} />
        ))}
      </div>

      <div className="winter-emblem" aria-hidden="true">
        <span />
        <span />
      </div>

      <div className="frost-card">
        <p className="winter-kicker">Bir Kış Masalı</p>
        <div className="winter-rule"><i /></div>
        <h1 className="written-couple">
          {handwrittenName("Ahmet", 2.05)}
          <em>&amp;</em>
          {handwrittenName("Elif", 3.75)}
        </h1>
        <p className="winter-date">12 · 06 · 2027</p>
      </div>

      <div className="ice-glint" />
      <div className="winter-vignette" />
      <div className="winter-exit" />
    </section>
  );
}
