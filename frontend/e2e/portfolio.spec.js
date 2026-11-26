import { test, expect } from "@playwright/test";

test.describe("Portafolio personal - E2E", () => {
  test("la página principal carga con el nombre y la foto", async ({
    page
  }) => {
    await page.goto("/");

    await expect(
      page.getByRole("heading", { name: "Valentina Valda" })
    ).toBeVisible();
    const photo = page.getByAltText("Foto de Valentina Valda");
    await expect(photo).toBeVisible();
    await expect
      .poll(() => photo.evaluate((image) => image.naturalWidth))
      .toBeGreaterThan(0);
  });

  test("la navegación por pestañas muestra la sección de proyectos", async ({
    page
  }) => {
    await page.goto("/");

    await page.getByRole("tab", { name: "Proyectos" }).click();

    await expect(
      page.getByRole("heading", { name: "Proyectos" })
    ).toBeVisible();
    await expect(page).toHaveTitle("Valentina Valda | Portafolio");
  });

  test("muestra los 3 proyectos con sus portadas", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("tab", { name: "Proyectos" }).click();

    await expect(page.getByText("Bad Bunny Vape Bolivia")).toBeVisible();
    await expect(page.getByText("AVIOR Corporation SRL")).toBeVisible();
    await expect(page.getByText("Borboleta Salón de Eventos")).toBeVisible();
    for (const alt of [
      "Portada de Bad Bunny Vape Bolivia",
      "Portada de AVIOR Corporation SRL",
      "Portada de Borboleta Salón de Eventos"
    ]) {
      const cover = page.getByAltText(alt);
      await expect(cover).toBeVisible();
      await expect
        .poll(() => cover.evaluate((image) => image.naturalWidth))
        .toBeGreaterThan(0);
    }
  });

  test("la pestaña Sobre mí muestra el WhatsApp", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("tab", { name: "Sobre mí" }).click();

    await expect(
      page.getByRole("heading", { name: "Sobre mí" })
    ).toBeVisible();
    const whatsapp = page.getByRole("link", { name: "+59175791516" });
    await expect(whatsapp).toBeVisible();
    await expect(whatsapp).toHaveAttribute(
      "href",
      "https://wa.me/59175791516"
    );
  });

  test("el formulario de contacto valida los campos vacíos", async ({
    page
  }) => {
    await page.goto("/");
    await page.getByRole("tab", { name: "Contacto" }).click();

    await page.getByRole("button", { name: "Enviar mensaje" }).click();

    await expect(
      page.getByText("Ingresa tu nombre (mínimo 2 caracteres).")
    ).toBeVisible();
    await expect(
      page.getByText("Ingresa un correo electrónico válido.")
    ).toBeVisible();
  });

  test("envía un mensaje de contacto válido al backend", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("tab", { name: "Contacto" }).click();

    await page.getByPlaceholder("Tu nombre").fill("E2E Playwright");
    await page.getByPlaceholder("tu@email.com").fill("e2e@test.com");
    await page
      .getByPlaceholder("Cuéntame sobre tu proyecto...")
      .fill("Mensaje de prueba E2E suficientemente largo.");
    await page.getByRole("button", { name: "Enviar mensaje" }).click();

    await expect(
      page.getByText("¡Gracias! Tu mensaje fue enviado correctamente.")
    ).toBeVisible();
  });
});
