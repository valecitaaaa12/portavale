function isValidEmail(email) {
  if (typeof email !== "string") return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email.trim());
}

function isValidPhone(phone) {
  if (typeof phone !== "string") return false;
  return /^\+?\d{7,15}$/.test(phone.replace(/[\s-]/g, ""));
}

function validateInstructor(payload = {}) {
  const errors = [];

  const nombre = typeof payload.nombre === "string" ? payload.nombre.trim() : "";
  const banco = typeof payload.banco === "string" ? payload.banco.trim() : "";
  const numero_cuenta =
    typeof payload.numero_cuenta === "string"
      ? payload.numero_cuenta.trim()
      : "";
  const email = typeof payload.email === "string" ? payload.email.trim() : "";
  const whatsapp =
    typeof payload.whatsapp === "string" ? payload.whatsapp.trim() : "";
  const tarifa_hora = Number(payload.tarifa_hora);

  if (nombre.length < 3) {
    errors.push("El nombre debe tener al menos 3 caracteres.");
  }
  if (!Number.isFinite(tarifa_hora) || tarifa_hora <= 0) {
    errors.push("La tarifa por hora debe ser un número mayor a 0.");
  }
  if (banco.length < 2) {
    errors.push("El banco es obligatorio.");
  }
  if (numero_cuenta.length < 4) {
    errors.push("El número de cuenta debe tener al menos 4 caracteres.");
  }
  if (!isValidEmail(email)) {
    errors.push("El correo electrónico no es válido.");
  }
  if (!isValidPhone(whatsapp)) {
    errors.push("El número de WhatsApp no es válido (ej. +59175444757).");
  }

  return {
    valid: errors.length === 0,
    errors,
    data: {
      nombre,
      tarifa_hora: Number.isFinite(tarifa_hora) ? tarifa_hora : 0,
      banco,
      numero_cuenta,
      email,
      whatsapp,
      imagen_qr: typeof payload.imagen_qr === "string" ? payload.imagen_qr : null,
      es_planta: Boolean(payload.es_planta)
    }
  };
}

function validateRegistro(payload = {}) {
  const errors = [];

  const fecha =
    typeof payload.fecha === "string" && payload.fecha
      ? payload.fecha
      : null;
  const materia =
    typeof payload.materia === "string" ? payload.materia.trim() : "";
  const horas = Number(payload.horas_de_instruccion ?? payload.horas);
  const instructor_id = Number(payload.instructor_id);

  if (!fecha || Number.isNaN(Date.parse(fecha))) {
    errors.push("La fecha es obligatoria y debe ser válida.");
  }
  if (!Number.isInteger(instructor_id) || instructor_id <= 0) {
    errors.push("Debes seleccionar un instructor.");
  }
  if (materia.length < 2) {
    errors.push("La materia es obligatoria.");
  }
  if (!Number.isFinite(horas) || horas <= 0 || horas > 24) {
    errors.push("Las horas deben estar entre 0.5 y 24.");
  }

  return {
    valid: errors.length === 0,
    errors,
    data: {
      fecha,
      instructor_id: Number.isInteger(instructor_id) ? instructor_id : null,
      materia,
      horas_de_instruccion: Number.isFinite(horas) ? horas : 0
    }
  };
}

function validateConfig(payload = {}) {
  const errors = [];

  const tipo_corte = payload.tipo_corte;
  const valor = String(payload.valor ?? "").trim();

  if (!["dia_mes", "dia_semana"].includes(tipo_corte)) {
    errors.push("El tipo de corte debe ser 'dia_mes' o 'dia_semana'.");
  }

  if (tipo_corte === "dia_mes") {
    const dia = Number(valor);
    if (!Number.isInteger(dia) || dia < 1 || dia > 31) {
      errors.push("El día del mes debe estar entre 1 y 31.");
    }
  }

  if (tipo_corte === "dia_semana") {
    const dias = [
      "lunes",
      "martes",
      "miercoles",
      "jueves",
      "viernes",
      "sabado",
      "domingo"
    ];
    if (!dias.includes(valor.toLowerCase())) {
      errors.push(
        "El día de la semana debe ser: lunes, martes, miercoles, jueves, viernes, sabado o domingo."
      );
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    data: {
      tipo_corte,
      valor: valor.toLowerCase(),
      notificar_correo: payload.notificar_correo !== false,
      notificar_app: payload.notificar_app !== false
    }
  };
}

module.exports = {
  isValidEmail,
  isValidPhone,
  validateInstructor,
  validateRegistro,
  validateConfig
};
