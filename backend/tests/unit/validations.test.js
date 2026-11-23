const { isValidEmail, validateContact } = require("../../src/utils/validations");

describe("isValidEmail", () => {
  test("acepta un correo válido", () => {
    expect(isValidEmail("valentinavalda446@gmail.com")).toBe(true);
  });

  test("rechaza un correo sin arroba", () => {
    expect(isValidEmail("valentinagmail.com")).toBe(false);
  });

  test("rechaza un correo sin dominio", () => {
    expect(isValidEmail("valentina@")).toBe(false);
  });

  test("rechaza valores que no son string", () => {
    expect(isValidEmail(null)).toBe(false);
    expect(isValidEmail(undefined)).toBe(false);
    expect(isValidEmail(12345)).toBe(false);
  });
});

describe("validateContact", () => {
  test("acepta un payload válido", () => {
    const result = validateContact({
      name: "Natalia Valda",
      email: "natalia@test.com",
      message: "Hola, me interesa contactarte para un proyecto."
    });

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.data.name).toBe("Natalia Valda");
  });

  test("rechaza un nombre muy corto", () => {
    const result = validateContact({
      name: "N",
      email: "natalia@test.com",
      message: "Hola, me interesa contactarte para un proyecto."
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "El nombre debe tener al menos 2 caracteres."
    );
  });

  test("rechaza un correo inválido", () => {
    const result = validateContact({
      name: "Natalia Valda",
      email: "no-es-un-correo",
      message: "Hola, me interesa contactarte para un proyecto."
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain("El correo electrónico no es válido.");
  });

  test("rechaza un mensaje muy corto", () => {
    const result = validateContact({
      name: "Natalia Valda",
      email: "natalia@test.com",
      message: "corto"
    });

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "El mensaje debe tener al menos 10 caracteres."
    );
  });

  test("rechaza un payload vacío y reporta los 3 errores", () => {
    const result = validateContact({});

    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(3);
  });

  test("recorta espacios en blanco antes de validar", () => {
    const result = validateContact({
      name: "  Natalia Valda  ",
      email: "  natalia@test.com  ",
      message: "  Mensaje con espacios extra alrededor.  "
    });

    expect(result.valid).toBe(true);
    expect(result.data.name).toBe("Natalia Valda");
    expect(result.data.email).toBe("natalia@test.com");
  });
});
