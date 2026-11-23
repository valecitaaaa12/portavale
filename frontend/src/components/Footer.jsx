export default function Footer({ profile }) {
  return (
    <footer className="footer">
      <p>
        © {new Date().getFullYear()} {profile.fullName}
      </p>
      <div className="footer__links">
        <a href={`mailto:${profile.email}`}>Email</a>
        <a
          href={`https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp
        </a>
        <a href={profile.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
      </div>
    </footer>
  );
}
