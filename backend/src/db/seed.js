const fs = require("fs");
const path = require("path");
const pool = require("./pool");

const projects = [
  {
    name: "Bad Bunny Vape Bolivia",
    description:
      "Tienda online de vapes premium con catálogo, carrito de compras y diseño responsivo. Desplegada en Oracle Cloud (Nginx) y Vercel.",
    tech: ["React", "Vite", "Tailwind CSS"],
    url: "https://bad-bunny-vape-bolivia.vercel.app",
    repo_url: "https://github.com/valecitaaaa12/proyectocondonata",
    image: null
  },
  {
    name: "AVIOR Corporation SRL",
    description:
      "Sitio institucional y sistema académico de la escuela de formación aeronáutica con 3 roles (admin, instructor, estudiante) y CI/CD con Docker Hub.",
    tech: ["React", "Vite", "Docker", "GitHub Actions"],
    url: null,
    repo_url: "https://github.com/valecitaaaa12/avior-corporation",
    image: null
  },
  {
    name: "Borboleta Salón de Eventos",
    description:
      "Sitio completo para salón de eventos con cotizador interactivo, calendario de disponibilidad, panel de administración y portal de clientes.",
    tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
    url: null,
    repo_url: "https://github.com/valecitaaaa12/borboleta",
    image: null
  }
];

async function applySchema(db = pool) {
  const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  await db.query(sql);
}

async function seedProjects(db = pool) {
  const { rows } = await db.query(
    "SELECT COUNT(*)::int AS count FROM projects"
  );
  if (rows[0].count > 0) return rows[0].count;

  for (const project of projects) {
    await db.query(
      "INSERT INTO projects (name, description, tech, url, repo_url, image) VALUES ($1, $2, $3, $4, $5, $6)",
      [
        project.name,
        project.description,
        project.tech,
        project.url,
        project.repo_url,
        project.image
      ]
    );
  }
  return projects.length;
}

async function main() {
  await applySchema();
  const count = await seedProjects();
  console.log(`Base de datos lista. Proyectos en la BD: ${count}`);
  await pool.end();
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { applySchema, seedProjects, projects };
