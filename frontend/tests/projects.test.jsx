import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Projects from "../src/components/Projects";
import { profile } from "../src/data/portfolio";

describe("Projects", () => {
  test("muestra los 3 proyectos del portafolio", () => {
    render(<Projects projects={profile.projects} />);

    expect(screen.getByText("Bad Bunny Vape Bolivia")).toBeInTheDocument();
    expect(screen.getByText("AVIOR Corporation SRL")).toBeInTheDocument();
    expect(screen.getByText("Borboleta Salón de Eventos")).toBeInTheDocument();
  });

  test("muestra las tecnologías de cada proyecto", () => {
    render(<Projects projects={profile.projects} />);

    expect(screen.getAllByText("React").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Next.js")).toBeInTheDocument();
    expect(screen.getByText("Tailwind CSS")).toBeInTheDocument();
  });

  test("incluye enlaces al código y a la demo", () => {
    render(<Projects projects={profile.projects} />);

    const demoLink = screen.getByText("Demo ↗");
    expect(demoLink).toHaveAttribute(
      "href",
      "https://bad-bunny-vape-bolivia.vercel.app"
    );

    const repoLinks = screen.getAllByText("Código ↗");
    expect(repoLinks).toHaveLength(3);
    expect(repoLinks[0]).toHaveAttribute(
      "href",
      "https://github.com/valecitaaaa12/proyectocondonata"
    );
  });
});
