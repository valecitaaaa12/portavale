function calcularMontoTotal(horas, tarifaHora) {
  const h = Number(horas);
  const t = Number(tarifaHora);

  if (!Number.isFinite(h) || !Number.isFinite(t) || h <= 0 || t <= 0) {
    return 0;
  }

  return Math.round(h * t * 100) / 100;
}

function generarMesPago(fecha) {
  const date = typeof fecha === "string" ? new Date(fecha) : fecha;
  if (!date || Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${year}-${month}`;
}

function calcularFechaProximoCorte(tipoCorte, valor, desde = new Date()) {
  if (tipoCorte === "dia_mes") {
    const dia = Math.min(Math.max(Number(valor), 1), 31);
    const siguiente = new Date(desde.getFullYear(), desde.getMonth(), dia);
    if (siguiente < new Date(desde.getFullYear(), desde.getMonth(), desde.getDate())) {
      siguiente.setMonth(siguiente.getMonth() + 1);
    }
    return siguiente.toISOString().slice(0, 10);
  }

  if (tipoCorte === "dia_semana") {
    const dias = {
      domingo: 0,
      lunes: 1,
      martes: 2,
      miercoles: 3,
      jueves: 4,
      viernes: 5,
      sabado: 6
    };
    const objetivo = dias[String(valor).toLowerCase()];
    if (objetivo === undefined) return null;

    const resultado = new Date(desde);
    const diff = (objetivo - resultado.getDay() + 7) % 7 || 7;
    resultado.setDate(resultado.getDate() + diff);
    return resultado.toISOString().slice(0, 10);
  }

  return null;
}

function resumenPorPagar(registros) {
  const grupos = new Map();

  for (const registro of registros) {
    if (registro.estado_pago !== "Pendiente") continue;

    const key = registro.instructor_id;
    if (!grupos.has(key)) {
      grupos.set(key, {
        instructor_id: key,
        instructor: registro.instructor,
        total_pagar: 0,
        registros: []
      });
    }

    const grupo = grupos.get(key);
    grupo.total_pagar =
      Math.round((grupo.total_pagar + Number(registro.monto_total)) * 100) / 100;
    grupo.registros.push(registro);
  }

  return Array.from(grupos.values()).sort(
    (a, b) => b.total_pagar - a.total_pagar
  );
}

module.exports = {
  calcularMontoTotal,
  generarMesPago,
  calcularFechaProximoCorte,
  resumenPorPagar
};
