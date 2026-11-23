const express = require("express");
const cors = require("cors");
const healthRouter = require("./routes/health");
const projectsRouter = require("./routes/projects");
const contactRouter = require("./routes/contact");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/projects", projectsRouter);
app.use("/api/contact", contactRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Error interno del servidor" });
});

module.exports = app;
