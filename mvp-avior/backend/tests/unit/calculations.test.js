const {
  calcularMontoTotal,
  generarMesPago,
  calcularFechaProximoCorte,
  resumenPorPagar
} = require("../../src/utils/calculations");

describe("calcularMontoTotal", () => {
  test("multiplica horas por tarifa", () => {
    expect(calcularMontoTotal(8, 85)).toBe(680);
  });

  test("redondea a 2 decimales", () => {
    expect(calcularMontoTotal(7.5, 78)).toBe(585);
    expect(calcularMontoTotal(3, 66.666)).toBe(200);
  });

  test("devuelve 0 con valores inválidos", () => {
    expect(calcularMontoTotal(0, 85)).toBe(0);
    expect(calcularMontoTotal(8, -10)).toBe(0);
    expect(calcularMontoTotal("abc", 85)).toBe(0);
  });
});

describe("generarMesPago", () => {
  test("genera el mes en formato YYYY-MM", () => {
    expect(generarMesPago("2026-11-05")).toBe("2026-11");
    expect(generarMesPago("2026-01-31")).toBe("2026-01");
  });

  test("devuelve null con fechas inválidas", () => {
    expect(generarMesPago("no-fecha")).toBeNull();
    expect(generarMesPago(null)).toBeNull();
  });
});

describe("calcularFechaProximoCorte", () => {
  test("calcula el próximo corte por día del mes", () => {
    const desde = new Date("2026-11-05T12:00:00Z");
    expect(calcularFechaProximoCorte("dia_mes", "17", desde)).toBe("2026-11-17");
  });

  test("pasa al siguiente mes si el día ya pasó", () => {
    const desde = new Date("2026-11-20T12:00:00Z");
    expect(calcularFechaProximoCorte("dia_mes", "17", desde)).toBe("2026-12-17");
  });

  test("calcula el próximo viernes", () => {
    const desde = new Date("2026-11-23T12:00:00Z"); // lunes
    expect(calcularFechaProximoCorte("dia_semana", "viernes", desde)).toBe(
      "2026-11-27"
    );
  });
});

describe("resumenPorPagar", () => {
  test("agrupa solo los registros pendientes por instructor", () => {
    const registros = [
      {
        instructor_id: 1,
        instructor: "Carlos Mamani",
        estado_pago: "Pendiente",
        monto_total: 680
      },
      {
        instructor_id: 1,
        instructor: "Carlos Mamani",
        estado_pago: "Pendiente",
        monto_total: 510
      },
      {
        instructor_id: 2,
        instructor: "María Rojas",
        estado_pago: "Pagado",
        monto_total: 950
      }
    ];

    const resumen = resumenPorPagar(registros);

    expect(resumen).toHaveLength(1);
    expect(resumen[0].instructor_id).toBe(1);
    expect(resumen[0].total_pagar).toBe(1190);
    expect(resumen[0].registros).toHaveLength(2);
  });

  test("devuelve arreglo vacío sin pendientes", () => {
    expect(resumenPorPagar([])).toHaveLength(0);
    expect(
      resumenPorPagar([
        {
          instructor_id: 1,
          estado_pago: "Pagado",
          monto_total: 100
        }
      ])
    ).toHaveLength(0);
  });
});
