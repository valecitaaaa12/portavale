CREATE TABLE IF NOT EXISTS usuarios (
  id SERIAL PRIMARY KEY,
  username VARCHAR(80) UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS instructores (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(160) NOT NULL,
  tarifa_hora NUMERIC(10, 2) NOT NULL CHECK (tarifa_hora > 0),
  banco VARCHAR(120) NOT NULL,
  numero_cuenta VARCHAR(60) NOT NULL,
  imagen_qr VARCHAR(300),
  email VARCHAR(200) NOT NULL,
  whatsapp VARCHAR(40) NOT NULL,
  es_planta BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS registros (
  id SERIAL PRIMARY KEY,
  fecha DATE NOT NULL,
  instructor_id INTEGER NOT NULL REFERENCES instructores(id) ON DELETE CASCADE,
  materia VARCHAR(160) NOT NULL,
  horas_de_instruccion NUMERIC(5, 2) NOT NULL CHECK (horas_de_instruccion > 0),
  monto_total NUMERIC(12, 2) NOT NULL,
  mes_pago VARCHAR(7) NOT NULL,
  estado_pago VARCHAR(20) NOT NULL DEFAULT 'Pendiente'
    CHECK (estado_pago IN ('Pendiente', 'Pagado')),
  fecha_pago DATE,
  comprobante_pago VARCHAR(300),
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS configuracion (
  id SERIAL PRIMARY KEY CHECK (id = 1),
  tipo_corte VARCHAR(20) NOT NULL DEFAULT 'dia_mes'
    CHECK (tipo_corte IN ('dia_mes', 'dia_semana')),
  valor VARCHAR(20) NOT NULL DEFAULT '17',
  notificar_correo BOOLEAN NOT NULL DEFAULT TRUE,
  notificar_app BOOLEAN NOT NULL DEFAULT TRUE,
  whatsapp_aviso VARCHAR(40) DEFAULT '+59175444757'
);

CREATE TABLE IF NOT EXISTS avisos (
  id SERIAL PRIMARY KEY,
  tipo VARCHAR(40) NOT NULL,
  mensaje TEXT NOT NULL,
  leido BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);
