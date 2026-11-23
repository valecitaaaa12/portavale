import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, test, vi } from "vitest";
import Hero from "../src/components/Hero";
import { profile } from "../src/data/portfolio";

describe("Hero", () => {
  test("muestra el nombre de Valentina", () => {
    render(<Hero profile={profile} onNavigate={() => {}} />);

    expect(
      screen.getByRole("heading", { name: "Valentina Valda" })
    ).toBeInTheDocument();
  });

  test("muestra el título profesional", () => {
    render(<Hero profile={profile} onNavigate={() => {}} />);

    expect(
      screen.getByText(/Estudiante de Ingeniería de Sistemas Informáticos/)
    ).toBeInTheDocument();
  });

  test("incluye la foto de perfil con texto alternativo", () => {
    render(<Hero profile={profile} onNavigate={() => {}} />);

    expect(
      screen.getByAltText("Foto de Valentina Valda")
    ).toBeInTheDocument();
  });

  test("los botones navegan a proyectos y contacto", () => {
    const onNavigate = vi.fn();
    render(<Hero profile={profile} onNavigate={onNavigate} />);

    fireEvent.click(screen.getByRole("button", { name: "Ver proyectos" }));
    expect(onNavigate).toHaveBeenCalledWith("proyectos");

    fireEvent.click(screen.getByRole("button", { name: "Contáctame" }));
    expect(onNavigate).toHaveBeenCalledWith("contacto");
  });
});
