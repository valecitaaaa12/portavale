require("dotenv").config();
const app = require("./app");
const pool = require("./db/pool");
const { applySchema, seedProjects } = require("./db/seed");

const PORT = process.env.PORT || 5000;

async function bootstrap() {
  if (process.env.AUTO_MIGRATE === "true") {
    await applySchema();
    await seedProjects();
    console.log("Esquema y datos semilla aplicados.");
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`API del portafolio escuchando en el puerto ${PORT}`);
  });

  async function shutdown() {
    console.log("Cerrando servidor...");
    await pool.end();
    server.close(() => process.exit(0));
  }

  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

bootstrap().catch((error) => {
  console.error("Error al iniciar la API:", error);
  process.exit(1);
});
