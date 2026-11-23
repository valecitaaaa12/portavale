export default function Skills({ skills, note }) {
  return (
    <section id="skills" className="section">
      <header className="section__head">
        <span className="section__num">02</span>
        <h2 className="section__title">Skills</h2>
      </header>

      <div className="skills">
        {Object.entries(skills).map(([category, items], index) => (
          <div className="skills__card" key={category}>
            <span className="skills__index">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h3>{category}</h3>
            <ul>
              {items.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {note && (
        <p className="skills__note" data-testid="skills-note">
          {note}
        </p>
      )}
    </section>
  );
}
