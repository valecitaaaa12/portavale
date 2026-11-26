const router = require("express").Router();
const pool = require("../db/pool");
const { requireAuth } = require("../middleware/auth");
const { validateRegistro } = require("../utils/validations");
const {
  calcularMontoTotal,
  generarMesPago,
  resumenPorPagar
} = require("../utils/calculations");

router.use(requireAuth);

const SELECT_REGISTRO = `
  SELECT r.*, i.nombre AS instructor, i.tarifa_hora, i.banco, i.numero_cuenta,
         i.imagen_qr, i.whatsapp, i.email
  FROM registros r
  JOIN instructores i ON i.id = r.instructor_id
`;

router.get("/", async (req, res, next) => {
  try {
    const { estado } = req.query;
    let sql = `${SELECT_REGISTRO} ORDER BY r.fecha DESC, r.id DESC`;
    const params = [];

    if (estado) {
      sql = `${SELECT_REGISTRO} WHERE r.estado_pago = $1 ORDER BY r.fecha DESC, r.id DESC`;
      params.push(estado);
    }

    const { rows } = await pool.query(sql, params);
    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.get("/por-pagar", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      `${SELECT_REGISTRO} WHERE r.estado_pago = 'Pendiente' ORDER BY i.nombre ASC`
    );
    res.json(resumenPorPagar(rows));
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  const { valid, errors, data } = validateRegistro(req.body);
  if (!valid) {
    return res.status(400).json({ ok: false, errors });
  }

  try {
    const instructorResult = await pool.query(
      "SELECT id, tarifa_hora FROM instructores WHERE id = $1",
      [data.instructor_id]
    );
    if (instructorResult.rows.length === 0) {
      return res
        .status(404)
        .json({ ok: false, error: "El instructor seleccionado no existe." });
    }

    const tarifa = instructorResult.rows[0].tarifa_hora;
    const monto = calcularMontoTotal(data.horas_de_instruccion, tarifa);
    const mes = generarMesPago(data.fecha);

    const { rows } = await pool.query(
      `INSERT INTO registros (fecha, instructor_id, materia, horas_de_instruccion, monto_total, mes_pago, estado_pago)
       VALUES ($1, $2, $3, $4, $5, $6, 'Pendiente') RETURNING *`,
      [
        data.fecha,
        data.instructor_id,
        data.materia,
        data.horas_de_instruccion,
        monto,
        mes
      ]
    );

    res.status(201).json({ ok: true, data: rows[0] });
  } catch (error) {
    next(error);
  }
});

router.post("/:id/pagar", async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      "SELECT id, estado_pago FROM registros WHERE id = $1",
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ ok: false, error: "Registro no encontrado." });
    }
    if (rows[0].estado_pago === "Pagado") {
      return res
        .status(409)
        .json({ ok: false, error: "El registro ya fue pagado." });
    }

    const comprobante =
      typeof req.body?.comprobante_pago === "string"
        ? req.body.comprobante_pago
        : null;

    const hoy = new Date().toISOString().slice(0, 10);
    const { rows: actualizados } = await pool.query(
      `UPDATE registros
       SET estado_pago = 'Pagado', fecha_pago = $1, comprobante_pago = $2
       WHERE id = $3 RETURNING *`,
      [hoy, comprobante, req.params.id]
    );

    res.json({ ok: true, data: actualizados[0] });
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const { rowCount } = await pool.query(
      "DELETE FROM registros WHERE id = $1",
      [req.params.id]
    );
    if (rowCount === 0) {
      return res.status(404).json({ ok: false, error: "Registro no encontrado." });
    }
    res.json({ ok: true });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
