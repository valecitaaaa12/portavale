import { useEffect, useState } from "react";

const API = import.meta.env.VITE_API_URL || "/api";

export default function Projects({ projects: fallback }) {
  const [projects, setProjects] = useState(fallback);

  useEffect(() => {
    let cancelled = false;

    fetch(`${API}/projects`)
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          // Fusiona la API con las portadas/íconos locales (por nombre)
          const merged = data.map((apiProject) => {
            const local = (fallback || []).find(
              (p) => p.name === apiProject.name
            );
            return {
              ...apiProject,
              cover: apiProject.cover || local?.cover || null,
              icon: apiProject.icon || local?.icon || null
            };
          });
          setProjects(merged);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section id="proyectos" className="section">
      <header className="section__head">
        <span className="section__num">03</span>
        <h2 className="section__title">Proyectos</h2>
      </header>

      <div className="projects">
        {projects.map((project) => {
          const repo = project.repo || project.repo_url;
          return (
            <article className="project-card" key={project.id ?? project.name}>
              <div className="project-card__media">
                {project.cover ? (
                  <img
                    className="project-card__cover"
                    src={project.cover}
                    alt={`Portada de ${project.name}`}
                    loading="lazy"
                  />
                ) : (
                  <div className="project-card__icon">{project.icon || "✦"}</div>
                )}
              </div>

              <div className="project-card__body">
                <h3>{project.name}</h3>
                <p>{project.description}</p>

                <div className="project-card__tech">
                  {(project.tech || []).map((tech) => (
                    <span key={tech}>{tech}</span>
                  ))}
                </div>

                <div className="project-card__links">
                  {project.url && (
                    <a href={project.url} target="_blank" rel="noreferrer">
                      Demo ↗
                    </a>
                  )}
                  {repo && (
                    <a href={repo} target="_blank" rel="noreferrer">
                      Código ↗
                    </a>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
