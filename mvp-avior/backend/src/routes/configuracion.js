const router = require("express").Router();
const pool = require("../db/pool");
const { requireAuth } = require("../middleware/auth");
const { validateConfig } = require("../utils/validations");
const { calcularFechaProximoCorte } = require("../utils/calculations");

router.get("/", async (req, res, next) => {
  try {
    const { rows } = await pool.query("SELECT * FROM configuracion WHERE id = 1");
    const config = rows[0] || null;
    const proximoCorte = config
      ? calcularFechaProximoCorte(config.tipo_corte, config.valor)
      : null;
    res.json({ ...config, proximo_corte: proximoCorte });
  } catch (error) {
    next(error);
  }
});

router.put("/", async (req, res, next) => {
  const { valid, errors, data } = validateConfig(req.body);
  if (!valid) {
    return res.status(400).json({ ok: false, errors });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE configuracion
       SET tipo_corte = $1, valor = $2, notificar_correo = $3, notificar_app = $4
       WHERE id = 1 RETURNING *`,
      [data.tipo_corte, data.valor, data.notificar_correo, data.notificar_app]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ ok: false, error: "Configuración no encontrada." });
    }
    res.json({ ok: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
