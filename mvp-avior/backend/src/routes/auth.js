const router = require("express").Router();
const bcrypt = require("bcryptjs");
const pool = require("../db/pool");
const { signToken } = require("../middleware/auth");

router.post("/login", async (req, res, next) => {
  try {
    const { username, password } = req.body || {};

    if (!username || !password) {
      return res
        .status(400)
        .json({ ok: false, error: "Usuario y contraseña son obligatorios." });
    }

    const { rows } = await pool.query(
      "SELECT id, username, password_hash FROM usuarios WHERE username = $1",
      [username]
    );

    if (rows.length === 0) {
      return res
        .status(401)
        .json({ ok: false, error: "Credenciales incorrectas." });
    }

    const match = await bcrypt.compare(password, rows[0].password_hash);
    if (!match) {
      return res
        .status(401)
        .json({ ok: false, error: "Credenciales incorrectas." });
    }

    const token = signToken(rows[0]);
    res.json({
      ok: true,
      token,
      user: { id: rows[0].id, username: rows[0].username }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
