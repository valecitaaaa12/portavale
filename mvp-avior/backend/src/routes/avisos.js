const router = require("express").Router();
const pool = require("../db/pool");
const { requireAuth } = require("../middleware/auth");

router.use(requireAuth);

router.get("/", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM avisos ORDER BY created_at DESC LIMIT 50"
    );
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.get("/pendientes", async (req, res, next) => {
  try {
    const pendientes = await pool.query(
      `SELECT COUNT(*)::int AS cantidad, COALESCE(SUM(monto_total), 0)::numeric AS total
       FROM registros WHERE estado_pago = 'Pendiente'`
    );

    const config = await pool.query(
      "SELECT * FROM configuracion WHERE id = 1"
    );

    res.json({
      registros_pendientes: pendientes.rows[0].cantidad,
      total_pendiente: Number(pendientes.rows[0].total),
      configuracion: config.rows[0] || null
    });
  } catch (error) {
    next(error);
  }
});

router.post("/generar", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `SELECT COUNT(*)::int AS cantidad, COALESCE(SUM(monto_total), 0)::numeric AS total
       FROM registros WHERE estado_pago = 'Pendiente'`
    );

    const cantidad = rows[0].cantidad;
    if (cantidad === 0) {
      return res.json({
        ok: true,
        mensaje: "No hay registros pendientes. Nada que recordar."
      });
    }

    const mensaje = `Recordatorio de pago: tienes ${cantidad} registro(s) pendiente(s) por un total de Bs. ${Number(
      rows[0].total
    ).toFixed(2)}. Revisa el panel "Por Pagar".`;

    const { rows: aviso } = await pool.query(
      "INSERT INTO avisos (tipo, mensaje) VALUES ($1, $2) RETURNING *",
      ["recordatorio_pago", mensaje]
    );

    res.status(201).json({ ok: true, aviso: aviso[0] });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/leer", async (req, res, next) => {
  try {
    const { rowCount } = await pool.query(
      "UPDATE avisos SET leido = TRUE WHERE id = $1",
      [req.params.id]
    );
    if (rowCount === 0) {
      return res.status(404).json({ ok: false, error: "Aviso no encontrado." });
    }
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
