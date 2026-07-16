import "./Hero.css";

const bg = (file) => `${import.meta.env.BASE_URL}images/backgrounds/${file}`;

export default function Hero({ onOpenInvitation }) {
  const goToStory = () => {
    onOpenInvitation?.();
    document.getElementById("story")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section
      id="hero"
      className="premium-hero"
      style={{ backgroundImage: `url(${bg("hero.webp")})` }}
    >
      <div className="hero-bg-motion" />
      <div className="hero-overlay" />
      <div className="hero-moon-glow" />

      <div className="hero-content">
        <span className="hero-mark">✦</span>

        <h1>
          <span>Ahmet</span>
          <strong>&</strong>
          <span>Elif</span>
        </h1>

        <div className="hero-line" />

        <div className="hero-details">
          <p className="hero-date">12 Haziran 2027</p>

          <p className="hero-text">
            Birlikte yeni bir hikâyeye başlıyoruz.
          </p>
        </div>

        <button className="hero-button" onClick={goToStory}>
          Davetiyeyi Aç
        </button>
      </div>

    </section>
  );
}
