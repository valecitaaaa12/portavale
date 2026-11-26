const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "mvp-avior-secret-cambio-en-prod";

function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({ ok: false, error: "Token no proporcionado." });
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ ok: false, error: "Token inválido o expirado." });
  }
}

function signToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username },
    JWT_SECRET,
    { expiresIn: "12h" }
  );
}

module.exports = { requireAuth, signToken, JWT_SECRET };
