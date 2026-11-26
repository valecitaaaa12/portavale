const fs = require("fs");
const path = require("path");
const bcrypt = require("bcryptjs");
const pool = require("./pool");

const instructoresSeed = [
  {
    nombre: "Carlos Mamani Quispe",
    tarifa_hora: 85,
    banco: "Banco Nacional de Bolivia",
    numero_cuenta: "4567891234",
    imagen_qr: null,
    email: "cmamani@avior.edu.bo",
    whatsapp: "+59171112222",
    es_planta: true
  },
  {
    nombre: "María Elena Rojas",
    tarifa_hora: 95,
    banco: "Banco Mercantil Santa Cruz",
    numero_cuenta: "9876543210",
    imagen_qr: null,
    email: "mrojas@avior.edu.bo",
    whatsapp: "+59172223333",
    es_planta: false
  },
  {
    nombre: "Jorge Luis Vargas",
    tarifa_hora: 78,
    banco: "Banco Unión",
    numero_cuenta: "1122334455",
    imagen_qr: null,
    email: "jvargas@avior.edu.bo",
    whatsapp: "+59173334444",
    es_planta: false
  }
];

const registrosSeed = [
  {
    fecha: "2026-11-03",
    instructor_index: 0,
    materia: "Meteorología",
    horas_de_instruccion: 8
  },
  {
    fecha: "2026-11-05",
    instructor_index: 0,
    materia: "Navegación Aérea",
    horas_de_instruccion: 6
  },
  {
    fecha: "2026-11-04",
    instructor_index: 1,
    materia: "Reglamentación Aeronáutica",
    horas_de_instruccion: 10
  },
  {
    fecha: "2026-11-10",
    instructor_index: 2,
    materia: "Radiocomunicaciones",
    horas_de_instruccion: 7.5
  }
];

async function applySchema(db = pool) {
  const sql = fs.readFileSync(path.join(__dirname, "schema.sql"), "utf8");
  await db.query(sql);
}

async function ensureAdmin(db = pool, username = "admin", password = "Admin123!") {
  const { rows } = await db.query(
    "SELECT id FROM usuarios WHERE username = $1",
    [username]
  );
  if (rows.length > 0) return false;

  const hash = await bcrypt.hash(password, 10);
  await db.query(
    "INSERT INTO usuarios (username, password_hash) VALUES ($1, $2)",
    [username, hash]
  );
  return true;
}

async function ensureConfig(db = pool) {
  await db.query(
    `INSERT INTO configuracion (id, tipo_corte, valor, notificar_correo, notificar_app, whatsapp_aviso)
     VALUES (1, 'dia_mes', '17', TRUE, TRUE, '+59175444757')
     ON CONFLICT (id) DO NOTHING`
  );
}

async function seedAll(db = pool) {
  await applySchema(db);
  const adminUsername = process.env.ADMIN_USERNAME || "admin";
  const adminPassword = process.env.ADMIN_PASSWORD || "Admin123!";
  await ensureAdmin(db, adminUsername, adminPassword);
  await ensureConfig(db);

  if (process.env.SEED_DEMO_DATA === "false") {
    const { rows } = await db.query("SELECT COUNT(*)::int AS count FROM instructores");
    return { instructores: rows[0].count, registros: "sin semilla demo" };
  }

  const { rows } = await db.query("SELECT COUNT(*)::int AS count FROM instructores");
  if (rows[0].count > 0) return { instructores: rows[0].count };

  const creados = [];
  for (const instructor of instructoresSeed) {
    const { rows: inserted } = await db.query(
      `INSERT INTO instructores (nombre, tarifa_hora, banco, numero_cuenta, imagen_qr, email, whatsapp, es_planta)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [
        instructor.nombre,
        instructor.tarifa_hora,
        instructor.banco,
        instructor.numero_cuenta,
        instructor.imagen_qr,
        instructor.email,
        instructor.whatsapp,
        instructor.es_planta
      ]
    );
    creados.push(inserted[0].id);
  }

  const { calcularMontoTotal, generarMesPago } = require("../utils/calculations");
  for (const registro of registrosSeed) {
    const instructorId = creados[registro.instructor_index];
    const tarifa = instructoresSeed[registro.instructor_index].tarifa_hora;
    await db.query(
      `INSERT INTO registros (fecha, instructor_id, materia, horas_de_instruccion, monto_total, mes_pago, estado_pago)
       VALUES ($1, $2, $3, $4, $5, $6, 'Pendiente')`,
      [
        registro.fecha,
        instructorId,
        registro.materia,
        registro.horas_de_instruccion,
        calcularMontoTotal(registro.horas_de_instruccion, tarifa),
        generarMesPago(registro.fecha)
      ]
    );
  }

  return { instructores: creados.length, registros: registrosSeed.length };
}

async function main() {
  const result = await seedAll();
  console.log("Semilla completada:", result);
  await pool.end();
}

if (require.main === module) {
  main().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

module.exports = { applySchema, ensureAdmin, ensureConfig, seedAll };
