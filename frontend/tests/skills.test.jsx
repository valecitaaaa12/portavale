import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Skills from "../src/components/Skills";
import { profile } from "../src/data/portfolio";

describe("Skills", () => {
  test("renderiza las categorías de skills", () => {
    render(<Skills skills={profile.skills} note={profile.skillsNote} />);

    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("Backend")).toBeInTheDocument();
    expect(screen.getByText("Bases de datos")).toBeInTheDocument();
    expect(screen.getByText("DevOps")).toBeInTheDocument();
  });

  test("incluye tecnologías clave como React, Docker y PostgreSQL", () => {
    render(<Skills skills={profile.skills} note={profile.skillsNote} />);

    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("Docker")).toBeInTheDocument();
    expect(screen.getByText("PostgreSQL")).toBeInTheDocument();
  });

  test("muestra la nota de aprendizaje continuo", () => {
    render(<Skills skills={profile.skills} note={profile.skillsNote} />);

    expect(
      screen.getByText(/Siempre dispuesta a aprender cualquier herramienta/)
    ).toBeInTheDocument();
  });
});
