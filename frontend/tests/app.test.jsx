import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import App from "../src/App";

describe("App - navegación por pestañas", () => {
  test("muestra Inicio por defecto con el nombre y la foto", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "Valentina Valda" })
    ).toBeInTheDocument();
    expect(
      screen.getByAltText("Foto de Valentina Valda")
    ).toBeInTheDocument();
  });

  test("cambia a la pestaña Sobre mí", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("tab", { name: "Sobre mí" }));

    expect(
      screen.getByRole("heading", { name: "Sobre mí" })
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/Natalia Valentina Valda Ibáñez/).length
    ).toBeGreaterThanOrEqual(1);
  });

  test("cambia a la pestaña Skills", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("tab", { name: "Skills" }));

    expect(screen.getByText("Frontend")).toBeInTheDocument();
    expect(screen.getByText("Docker")).toBeInTheDocument();
  });

  test("cambia a la pestaña Proyectos con las portadas", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("tab", { name: "Proyectos" }));

    expect(screen.getByText("Bad Bunny Vape Bolivia")).toBeInTheDocument();
    expect(
      screen.getByAltText("Portada de Borboleta Salón de Eventos")
    ).toBeInTheDocument();
  });

  test("cambia a la pestaña Contacto con el WhatsApp", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("tab", { name: "Contacto" }));

    expect(screen.getByPlaceholderText("Tu nombre")).toBeInTheDocument();
    expect(screen.getByText("+59175791516")).toBeInTheDocument();
  });

  test("la pestaña activa tiene aria-selected", () => {
    render(<App />);

    const inicioTab = screen.getByRole("tab", { name: "Inicio" });
    expect(inicioTab).toHaveAttribute("aria-selected", "true");

    fireEvent.click(screen.getByRole("tab", { name: "Skills" }));
    expect(screen.getByRole("tab", { name: "Skills" })).toHaveAttribute(
      "aria-selected",
      "true"
    );
    expect(inicioTab).toHaveAttribute("aria-selected", "false");
  });
});
