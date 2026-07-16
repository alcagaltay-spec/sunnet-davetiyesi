import { useEffect } from "react";
import "./OpeningExperience.css";

const INTRO_DURATION = 8000;
const flyingFlowers = Array.from({ length: 8 });

export default function OpeningExperience({ onComplete }) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, INTRO_DURATION);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <section className="leaf-intro" aria-label="Uçuşan yapraklarla davetiye açılışı">
      <div className="leaf-intro-bg" />
      <div className="leaf-intro-light" />
      <div className="leaf-intro-shade" />

      <div className="season-message">
        <span className="season-eyebrow">Aşkımız</span>
        <strong>Çiçek Açtı</strong>
        <span className="invitation-line">
          Şimdi bu mutluluğa<br />siz de davetlisiniz.
        </span>
      </div>

      <div className="flying-flowers" aria-hidden="true">
        {flyingFlowers.map((_, index) => (
          <i
            style={{
              "--flower-start-y": `${4 + ((index * 37) % 86)}vh`,
              "--flower-end-y": `${12 + ((index * 53) % 78)}vh`,
              "--flower-delay": `${0.65 + index * 0.72}s`,
              "--flower-duration": `${5.2 + (index % 3) * 0.75}s`,
              "--flower-size": `${16 + (index % 3) * 4}px`,
              "--flower-turn": `${180 + index * 65}deg`,
            }}
            key={index}
          />
        ))}
      </div>

      <div className="leaf-intro-exit" />
    </section>
  );
}
