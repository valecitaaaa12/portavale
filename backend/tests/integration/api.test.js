const request = require("supertest");
const app = require("../../src/app");
const pool = require("../../src/db/pool");
const { applySchema, seedProjects } = require("../../src/db/seed");

jest.setTimeout(20000);

beforeAll(async () => {
  await applySchema();
  await seedProjects();
});

afterAll(async () => {
  await pool.end();
});

describe("GET /api/health", () => {
  test("responde 200 con estado ok", async () => {
    const res = await request(app).get("/api/health");

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.service).toBe("portafolio-api");
  });

  test("devuelve un timestamp ISO", async () => {
    const res = await request(app).get("/api/health");

    expect(Number.isNaN(Date.parse(res.body.timestamp))).toBe(false);
  });
});

describe("GET /api/projects", () => {
  test("devuelve la lista de proyectos en formato de arreglo", async () => {
    const res = await request(app).get("/api/projects");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(3);
  });

  test("cada proyecto trae sus campos requeridos", async () => {
    const res = await request(app).get("/api/projects");

    for (const project of res.body) {
      expect(project.name).toBeTruthy();
      expect(project.description).toBeTruthy();
      expect(Array.isArray(project.tech)).toBe(true);
      expect(project).toHaveProperty("repo_url");
    }
  });

  test("incluye los proyectos reales del portafolio", async () => {
    const res = await request(app).get("/api/projects");
    const names = res.body.map((p) => p.name);

    expect(names).toContain("Bad Bunny Vape Bolivia");
    expect(names).toContain("AVIOR Corporation SRL");
    expect(names).toContain("Borboleta Salón de Eventos");
  });
});

describe("POST /api/contact", () => {
  test("acepta un mensaje válido y lo guarda", async () => {
    const res = await request(app).post("/api/contact").send({
      name: "Prueba Integración",
      email: "integracion@test.com",
      message: "Este es un mensaje de prueba para la integración."
    });

    expect(res.status).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.email).toBe("integracion@test.com");
  });

  test("rechaza un correo inválido con estado 400", async () => {
    const res = await request(app).post("/api/contact").send({
      name: "Prueba Integración",
      email: "no-es-un-correo",
      message: "Este es un mensaje de prueba para la integración."
    });

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
    expect(res.body.errors).toContain(
      "El correo electrónico no es válido."
    );
  });

  test("rechaza un payload incompleto con estado 400", async () => {
    const res = await request(app).post("/api/contact").send({
      name: "Solo Nombre"
    });

    expect(res.status).toBe(400);
    expect(res.body.errors.length).toBeGreaterThanOrEqual(2);
  });
});
