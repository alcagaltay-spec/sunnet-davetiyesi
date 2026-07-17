import { useEffect } from "react";
import "./OpeningExperience.css";

const INTRO_DURATION = 8000;
const stars = Array.from({ length: 34 });
const introText = "En Özel Anıma Hoş Geldiniz";

export default function OpeningExperience({ onComplete }) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, INTRO_DURATION);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <section className="prince-intro" aria-label="Ahmet Aras'ın sünnet davetiyesi açılışı">
      <div className="prince-intro-bg" />
      <div className="prince-intro-glow" />
      <div className="prince-light-beam" aria-hidden="true" />
      <div className="prince-portrait-wrap" aria-hidden="true">
        <img
          className="prince-portrait"
          src={`${import.meta.env.BASE_URL}images/opening/ahmet-aras-prince.png`}
          alt=""
        />
      </div>
      <div className="prince-intro-vignette" />
      <div className="prince-gold-frame" aria-hidden="true"><i /><i /><i /><i /></div>

      <div className="intro-stars" aria-hidden="true">
        {stars.map((_, index) => (
          <i
            key={index}
            style={{
              "--x": `${6 + ((index * 37) % 88)}%`,
              "--y": `${4 + ((index * 53) % 88)}%`,
              "--delay": `${(index % 9) * 0.31}s`,
              "--size": `${2 + (index % 3)}px`,
            }}
          />
        ))}
      </div>

      <div className="prince-message">
        <div className="prince-crest" aria-hidden="true">♛</div>
        <span className="prince-name">Ahmet Aras</span>
        <div className="prince-rule" aria-hidden="true"><span /><i>✦</i><span /></div>
        <span className="prince-line" aria-label={introText}>
          {Array.from(introText).map((letter, index) => (
            <i
              key={`${letter}-${index}`}
              aria-hidden="true"
              style={{ "--letter-index": index }}
            >
              {letter === " " ? "\u00A0" : letter}
            </i>
          ))}
        </span>
      </div>

      <div className="prince-intro-exit" />
    </section>
  );
}
