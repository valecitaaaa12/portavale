import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import Contact from "../src/components/Contact";
import { profile } from "../src/data/portfolio";

describe("Contact", () => {
  test("renderiza el formulario con nombre, email y mensaje", () => {
    render(<Contact profile={profile} />);

    expect(screen.getByPlaceholderText("Tu nombre")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("tu@email.com")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Cuéntame sobre tu proyecto...")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Enviar mensaje" })
    ).toBeInTheDocument();
  });

  test("muestra el WhatsApp +59175791516 como canal de contacto", () => {
    render(<Contact profile={profile} />);

    expect(screen.getByText("+59175791516")).toBeInTheDocument();
    expect(screen.getByText("+59175791516")).toHaveAttribute(
      "href",
      "https://wa.me/59175791516"
    );
  });

  test("muestra errores al enviar el formulario vacío", () => {
    render(<Contact profile={profile} />);

    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(
      screen.getByText("Ingresa tu nombre (mínimo 2 caracteres).")
    ).toBeInTheDocument();
    expect(
      screen.getByText("Ingresa un correo electrónico válido.")
    ).toBeInTheDocument();
    expect(
      screen.getByText("El mensaje debe tener al menos 10 caracteres.")
    ).toBeInTheDocument();
  });

  test("valida el formato del email", () => {
    render(<Contact profile={profile} />);

    fireEvent.change(screen.getByPlaceholderText("Tu nombre"), {
      target: { value: "Natalia Valda" }
    });
    fireEvent.change(screen.getByPlaceholderText("tu@email.com"), {
      target: { value: "no-es-un-correo" }
    });
    fireEvent.change(
      screen.getByPlaceholderText("Cuéntame sobre tu proyecto..."),
      { target: { value: "Este es un mensaje de prueba suficientemente largo." } }
    );
    fireEvent.click(screen.getByRole("button", { name: "Enviar mensaje" }));

    expect(
      screen.getByText("Ingresa un correo electrónico válido.")
    ).toBeInTheDocument();
    expect(
      screen.queryByText("Ingresa tu nombre (mínimo 2 caracteres).")
    ).not.toBeInTheDocument();
  });
});
