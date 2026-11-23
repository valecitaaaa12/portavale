const tabs = [
  { id: "inicio", label: "Inicio" },
  { id: "sobre-mi", label: "Sobre mí" },
  { id: "skills", label: "Skills" },
  { id: "proyectos", label: "Proyectos" },
  { id: "contacto", label: "Contacto" }
];

export default function Navbar({ active, onSelect }) {
  return (
    <header className="navbar">
      <button
        type="button"
        className="navbar__brand"
        onClick={() => onSelect("inicio")}
      >
        Valentina <em>Valda</em>
      </button>

      <nav className="navbar__tabs" role="tablist" aria-label="Secciones del portafolio">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={active === tab.id}
            className={active === tab.id ? "is-active" : ""}
            onClick={() => onSelect(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </nav>
    </header>
  );
}
