function isValidEmail(email) {
  if (typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

function validateContact(payload = {}) {
  const errors = [];

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const message =
    typeof payload.message === "string" ? payload.message.trim() : "";

  if (name.length < 2) {
    errors.push("El nombre debe tener al menos 2 caracteres.");
  }
  if (!isValidEmail(email)) {
    errors.push("El correo electrónico no es válido.");
  }
  if (message.length < 10) {
    errors.push("El mensaje debe tener al menos 10 caracteres.");
  }

  return {
    valid: errors.length === 0,
    errors,
    data: { name, email, message }
  };
}

module.exports = { isValidEmail, validateContact };
