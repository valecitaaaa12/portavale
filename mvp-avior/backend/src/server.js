require("dotenv").config();
const app = require("./app");
const pool = require("./db/pool");
const { seedAll } = require("./db/seed");

const PORT = process.env.PORT || 5001;

async function bootstrap() {
  if (process.env.AUTO_MIGRATE === "true") {
    const result = await seedAll();
    console.log("Esquema y semilla aplicados:", result);
  }

  const server = app.listen(PORT, "0.0.0.0", () => {
    console.log(`API del MVP AVIOR escuchando en el puerto ${PORT}`);
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
