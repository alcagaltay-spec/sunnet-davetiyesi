import "./Story.css";

const bg = (file) => `${import.meta.env.BASE_URL}images/backgrounds/${file}`;

const milestones = [
  {
    year: "2020",
    icon: "☻",
    title: ["Dünyaya", "Merhaba"],
    ornament: "✧",
    text: "Ailem için en büyük mutluluk oldum.",
  },
  {
    year: "2023",
    icon: "♧",
    title: ["İlk Adımlarım"],
    ornament: "♢",
    text: "Her gün yeni bir şey öğrendim, sevgiyle büyüdüm.",
  },
  {
    year: "2026",
    icon: "♛",
    title: ["Bugün En Güzel Günüm"],
    ornament: "✦",
    text: "Bugün en özel günümde sizlerle birlikte olmaktan mutluyum.",
  },
];

export default function Story() {
  const goToGallery = () => {
    document.getElementById("gallery")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <section
      id="story"
      className="story-scene"
      style={{ backgroundImage: `url(${bg("story.webp")})` }}
    >
      <div className="story-bg-motion" />
      <div className="story-overlay" />

      <div className="story-content">
        <p className="story-eyebrow">Yolculuğum</p>
        <div className="story-flourish"><span /><i>❖</i><span /></div>

        <h2>İlk Büyük Adım</h2>

        <div className="story-flourish story-flourish-short"><span /><i>❖</i><span /></div>
        <p className="story-intro">
          Sevgiyle büyüdüm, dualarla güçlendim.<br />
          Şimdi bu anlamlı günümü sizlerle paylaşmanın mutluluğunu yaşıyorum.
        </p>

        <div className="story-timeline">
          {milestones.map((milestone) => (
            <article className="story-card" key={milestone.year}>
              <div className="story-card-icon" aria-hidden="true">{milestone.icon}</div>
              <div className="story-card-body">
                <span className="story-year">• {milestone.year} •</span>
                <h3>
                  {milestone.title.map((line) => (
                    <span key={line}>{line}</span>
                  ))}
                </h3>
                <div className="story-card-divider" aria-hidden="true"><i>{milestone.ornament}</i></div>
                <p>{milestone.text}</p>
              </div>
            </article>
          ))}
        </div>

        <button type="button" className="story-next" onClick={goToGallery}>
          <span className="story-next-line" aria-hidden="true" />
          <strong>Bu Güzel Günü Birlikte Kutlayalım</strong>
        </button>
      </div>
    </section>
  );
}
