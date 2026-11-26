export const profile = {
  name: "Valentina Valda",
  fullName: "Natalia Valentina Valda Ibáñez",
  title: "Estudiante de Ingeniería de Sistemas Informáticos",
  about:
    "Soy Valentina Valda, estudiante de Ingeniería de Sistemas Informáticos con interés en transformar ideas en productos funcionales. He desarrollado proyectos reales —tiendas online, sitios institucionales y sistemas de gestión— dominando el stack JavaScript (React, Next.js, Node.js) y herramientas de despliegue como Docker, GitHub Actions y Oracle Cloud. Me apasiona el aprendizaje continuo y el trabajo en equipo.",
  photo: "/valevalda.jpeg",
  location: "Bolivia",
  email: "vvalda@gmail.com",
  emailAlt: "vvalda549@gmail.com",
  whatsapp: "+59175791516",
  github: "https://github.com/valecitaaaa12",
  githubUser: "valecitaaaa12",
  skillsNote:
    "Siempre dispuesta a aprender cualquier herramienta para fortalecer mis conocimientos.",
  skills: {
    Frontend: [
      "React",
      "Next.js",
      "Vite",
      "TypeScript",
      "JavaScript",
      "Tailwind CSS",
      "HTML/CSS"
    ],
    Backend: ["Node.js", "Express", "APIs REST"],
    "Bases de datos": ["PostgreSQL", "Prisma"],
    DevOps: ["Docker", "GitHub Actions", "Nginx", "Oracle Cloud", "Vercel"],
    Otros: ["Git/GitHub", "Linux"]
  },
  projects: [
    {
      id: 1,
      name: "Bad Bunny Vape Bolivia",
      description:
        "Tienda online de vapes premium con catálogo, carrito de compras y diseño responsivo. Desplegada en Oracle Cloud (Nginx) y Vercel.",
      tech: ["React", "Vite", "Tailwind CSS"],
      url: "https://bad-bunny-vape-bolivia.vercel.app",
      repo: "https://github.com/valecitaaaa12/proyectocondonata",
      cover: "/covers/bad-bunny-vape.svg",
      icon: "💨"
    },
    {
      id: 2,
      name: "AVIOR Corporation SRL",
      description:
        "Sitio institucional y sistema académico de la escuela de formación aeronáutica con 3 roles (admin, instructor, estudiante) y CI/CD automatizado con Docker Hub.",
      tech: ["React", "Vite", "Docker", "GitHub Actions"],
      url: null,
      repo: "https://github.com/valecitaaaa12/avior-corporation",
      cover: "/covers/avior-corporation.svg",
      icon: "✈️"
    },
    {
      id: 3,
      name: "Borboleta Salón de Eventos",
      description:
        "Sitio completo con cotizador interactivo, calendario de disponibilidad, panel de administración y portal de clientes.",
      tech: ["Next.js", "TypeScript", "Prisma", "PostgreSQL"],
      url: null,
      repo: "https://github.com/valecitaaaa12/borboleta",
      cover: "/covers/borboleta.svg",
      icon: "🦋"
    }
  ]
};
