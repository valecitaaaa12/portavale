export default function About({ profile }) {
  return (
    <section id="sobre-mi" className="section">
      <header className="section__head">
        <span className="section__num">01</span>
        <h2 className="section__title">Sobre mí</h2>
      </header>

      <div className="about">
        <p className="about__text">{profile.about}</p>

        <ul className="about__facts">
          <li>
            <span className="about__label">Nombre</span>
            <span>{profile.fullName}</span>
          </li>
          <li>
            <span className="about__label">Ubicación</span>
            <span>{profile.location}</span>
          </li>
          <li>
            <span className="about__label">Email</span>
            <a href={`mailto:${profile.email}`}>{profile.email}</a>
          </li>
          <li>
            <span className="about__label">WhatsApp</span>
            <a
              href={`https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noreferrer"
            >
              {profile.whatsapp}
            </a>
          </li>
          <li>
            <span className="about__label">GitHub</span>
            <a href={profile.github} target="_blank" rel="noreferrer">
              {profile.githubUser}
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
