const router = require("express").Router();
const pool = require("../db/pool");
const { requireAuth } = require("../middleware/auth");
const { validateInstructor } = require("../utils/validations");

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM instructores ORDER BY nombre ASC"
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM instructores WHERE id = $1",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ ok: false, error: "Instructor no encontrado." });
    }
    res.json(rows[0]);
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const { valid, errors, data } = validateInstructor(req.body);
  if (!valid) {
    return res.status(400).json({ ok: false, errors });
  }

  try {
    const { rows } = await pool.query(
      `INSERT INTO instructores (nombre, tarifa_hora, banco, numero_cuenta, imagen_qr, email, whatsapp, es_planta)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        data.nombre,
        data.tarifa_hora,
        data.banco,
        data.numero_cuenta,
        data.imagen_qr,
        data.email,
        data.whatsapp,
        data.es_planta
      ]
    );
    res.status(201).json({ ok: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req, res, next) => {
  const { valid, errors, data } = validateInstructor(req.body);
  if (!valid) {
    return res.status(400).json({ ok: false, errors });
  }

  try {
    const { rows } = await pool.query(
      `UPDATE instructores
       SET nombre = $1, tarifa_hora = $2, banco = $3, numero_cuenta = $4,
           imagen_qr = $5, email = $6, whatsapp = $7, es_planta = $8
       WHERE id = $9 RETURNING *`,
      [
        data.nombre,
        data.tarifa_hora,
        data.banco,
        data.numero_cuenta,
        data.imagen_qr,
        data.email,
        data.whatsapp,
        data.es_planta,
        req.params.id
      ]
    );
    if (rows.length === 0) {
      return res.status(404).json({ ok: false, error: "Instructor no encontrado." });
    }
    res.json({ ok: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { rowCount } = await pool.query(
      "DELETE FROM instructores WHERE id = $1",
      [req.params.id]
    );
    if (rowCount === 0) {
      return res.status(404).json({ ok: false, error: "Instructor no encontrado." });
    }
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
