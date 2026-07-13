import { useEffect, useRef } from "react";
import "./OpeningExperience.css";

const INTRO_DURATION = 7000;
const particles = Array.from({ length: 18 });

const openingAsset = (file) =>
  `${import.meta.env.BASE_URL}images/opening/${file}`;

export default function OpeningExperience({ onComplete }) {
  const introRef = useRef(null);
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
    <section
      ref={introRef}
      className="cinematic-ring-intro"
      aria-label="Alyansların sinematik açılışı"
    >
      <audio
        ref={audioRef}
        src={`${import.meta.env.BASE_URL}music/ring-intro-7s.wav`}
        preload="auto"
      />
      <div className="intro-ambient" />
      <div className="intro-orbit intro-orbit-one" />
      <div className="intro-orbit intro-orbit-two" />

      <div className="ring-stage">
        <div className="ring-halo" />

        <div className="ring-frame ring-frame-one">
          <img src={openingAsset("ring-1.png")} alt="Altın alyans" />
        </div>

        <div className="ring-frame ring-frame-two">
          <img src={openingAsset("ring-2.png")} alt="Altın alyans" />
        </div>

        <div className="gold-flare" />
        <div className="light-sweep" />
      </div>

      <div className="gold-dust" aria-hidden="true">
        {particles.map((_, index) => (
          <i key={index} style={{ "--particle": index }} />
        ))}
      </div>

      <div className="intro-vignette" />
      <div className="intro-letterbox intro-letterbox-top" />
      <div className="intro-letterbox intro-letterbox-bottom" />
      <div className="intro-exit-flash" />
    </section>
  );
}
