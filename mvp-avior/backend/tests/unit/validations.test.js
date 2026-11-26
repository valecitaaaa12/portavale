const {
  isValidEmail,
  isValidPhone,
  validateInstructor,
  validateRegistro,
  validateConfig
} = require("../../src/utils/validations");

describe("isValidEmail / isValidPhone", () => {
  test("acepta un correo válido", () => {
    expect(isValidEmail("cmamani@avior.edu.bo")).toBe(true);
  });

  test("rechaza un correo inválido", () => {
    expect(isValidEmail("no-correo")).toBe(false);
  });

  test("acepta un teléfono con código de país", () => {
    expect(isValidPhone("+59175444757")).toBe(true);
    expect(isValidPhone("75444757")).toBe(true);
  });

  test("rechaza un teléfono demasiado corto", () => {
    expect(isValidPhone("123")).toBe(false);
  });
});

describe("validateInstructor", () => {
  const base = {
    nombre: "Carlos Mamani",
    tarifa_hora: 85,
    banco: "BNB",
    numero_cuenta: "4567891234",
    email: "carlos@test.com",
    whatsapp: "+59171112222"
  };

  test("acepta un instructor válido", () => {
    const result = validateInstructor(base);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
    expect(result.data.tarifa_hora).toBe(85);
  });

  test("rechaza tarifa en cero o negativa", () => {
    expect(validateInstructor({ ...base, tarifa_hora: 0 }).valid).toBe(false);
    expect(validateInstructor({ ...base, tarifa_hora: -5 }).valid).toBe(false);
  });

  test("rechaza un nombre muy corto", () => {
    const result = validateInstructor({ ...base, nombre: "C" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "El nombre debe tener al menos 3 caracteres."
    );
  });

  test("rechaza datos bancarios incompletos", () => {
    const result = validateInstructor({
      ...base,
      banco: "",
      numero_cuenta: "12"
    });
    expect(result.valid).toBe(false);
    expect(result.errors).toHaveLength(2);
  });
});

describe("validateRegistro", () => {
  const base = {
    fecha: "2026-11-05",
    instructor_id: 1,
    materia: "Meteorología",
    horas_de_instruccion: 8
  };

  test("acepta un registro válido", () => {
    const result = validateRegistro(base);
    expect(result.valid).toBe(true);
    expect(result.data.horas_de_instruccion).toBe(8);
  });

  test("rechaza un registro sin instructor", () => {
    const result = validateRegistro({ ...base, instructor_id: null });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain("Debes seleccionar un instructor.");
  });

  test("rechaza horas fuera de rango", () => {
    expect(validateRegistro({ ...base, horas_de_instruccion: 30 }).valid).toBe(
      false
    );
    expect(validateRegistro({ ...base, horas_de_instruccion: 0 }).valid).toBe(
      false
    );
  });

  test("rechaza una fecha inválida", () => {
    const result = validateRegistro({ ...base, fecha: "no-fecha" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "La fecha es obligatoria y debe ser válida."
    );
  });
});

describe("validateConfig", () => {
  test("acepta un corte por día del mes válido", () => {
    const result = validateConfig({ tipo_corte: "dia_mes", valor: "17" });
    expect(result.valid).toBe(true);
    expect(result.data.valor).toBe("17");
  });

  test("acepta un corte por día de la semana válido", () => {
    const result = validateConfig({ tipo_corte: "dia_semana", valor: "Viernes" });
    expect(result.valid).toBe(true);
    expect(result.data.valor).toBe("viernes");
  });

  test("rechaza un día del mes fuera de rango", () => {
    const result = validateConfig({ tipo_corte: "dia_mes", valor: "32" });
    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "El día del mes debe estar entre 1 y 31."
    );
  });

  test("rechaza un día de la semana inexistente", () => {
    const result = validateConfig({
      tipo_corte: "dia_semana",
      valor: "festivo"
    });
    expect(result.valid).toBe(false);
  });
});
