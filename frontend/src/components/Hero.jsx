export default function Hero({ profile, onNavigate }) {
  return (
    <section id="inicio" className="hero">
      <p className="eyebrow">Portafolio — 2026</p>

      <div className="hero__photo-wrap">
        <img
          className="hero__photo"
          src={profile.photo}
          alt={`Foto de ${profile.name}`}
        />
      </div>

      <h1 className="hero__name">
        Valentina <em>Valda</em>
      </h1>

      <p className="hero__role">{profile.title}</p>

      <p className="hero__lead">
        Construyo aplicaciones web completas: desde interfaces atractivas hasta
        APIs robustas y bases de datos.
      </p>

      <div className="hero__actions">
        <button
          type="button"
          className="btn btn--solid"
          onClick={() => onNavigate("proyectos")}
        >
          Ver proyectos
        </button>
        <button
          type="button"
          className="btn btn--line"
          onClick={() => onNavigate("contacto")}
        >
          Contáctame
        </button>
      </div>
    </section>
  );
}
