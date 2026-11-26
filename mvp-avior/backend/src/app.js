const path = require("path");
const express = require("express");
const cors = require("cors");
const authRouter = require("./routes/auth");
const instructoresRouter = require("./routes/instructores");
const registrosRouter = require("./routes/registros");
const configuracionRouter = require("./routes/configuracion");
const avisosRouter = require("./routes/avisos");
const uploadsRouter = require("./routes/uploads");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "mvp-avior-api",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRouter);
app.use("/api/instructores", instructoresRouter);
app.use("/api/registros", registrosRouter);
app.use("/api/configuracion", configuracionRouter);
app.use("/api/avisos", avisosRouter);
app.use("/api/upload", uploadsRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  console.error(err);
  const message =
    err.name === "MulterError"
      ? "Error al subir el archivo: " + err.message
      : "Error interno del servidor";
  res.status(500).json({ error: message });
});

module.exports = app;
