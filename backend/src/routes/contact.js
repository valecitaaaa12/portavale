const router = require("express").Router();
const pool = require("../db/pool");
const { validateContact } = require("../utils/validations");

router.post("/", async (req, res, next) => {
  const { valid, errors, data } = validateContact(req.body);

  if (!valid) {
    return res.status(400).json({ ok: false, errors });
  }

  try {
    const { rows } = await pool.query(
      "INSERT INTO messages (name, email, message) VALUES ($1, $2, $3) RETURNING id, name, email, created_at",
      [data.name, data.email, data.message]
    );

    res.status(201).json({
      ok: true,
      message: "Mensaje enviado correctamente",
      data: rows[0]
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
