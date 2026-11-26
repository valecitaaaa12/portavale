# Portafolio personal y MVP AVIOR

Repositorio para las prácticas 3.2 (portafolio personal) y 4.1 (MVP AVIOR). La interfaz del portafolio usa React/Vite con una estética editorial en blanco y negro; AVIOR es un panel privado para administrar instructores, horas y pagos. Ambos proyectos tienen API Express y PostgreSQL.

## Práctica 3.2 — Portafolio

- React, Vite y navegación por pestañas; incluye inicio, sobre mí, skills, proyectos y contacto.
- Perfil, portadas de proyectos, enlaces de GitHub y WhatsApp `+591 7579 1516`.
- API REST en Express y PostgreSQL.
- Pruebas: unitarias, integración y Playwright E2E.
- Docker, CI en `dev`, y publicación/despliegue en `main`.

## Práctica 4.1 — MVP AVIOR

- Aplicación para dos integrantes del equipo, con frontend React, API Express y PostgreSQL.
- Inicio de sesión, directorio de instructores, registro de clases, cálculos de montos, pagos pendientes, configuración y avisos.
- Colores institucionales negro y rojo, con el logotipo AVIOR.
- Pruebas: unitarias, integración y Playwright E2E; cada categoría supera el mínimo de seis.

## Ejecutar localmente

Necesitas Node.js 20 o superior y Docker Desktop con el motor Linux activo.

```powershell
# Portafolio (frontend :80, backend :5000 y PostgreSQL :5432)
docker compose up -d --build

# MVP AVIOR (frontend :5174, backend :5001 y PostgreSQL :5433)
docker compose -f mvp-avior/docker-compose.yml up -d --build
```

Para desarrollo sin Docker, instala dependencias en `backend`, `frontend`, `mvp-avior/backend` y `mvp-avior/frontend`; revisa sus archivos `.env.example` y README antes de iniciar los servidores.

## Pruebas

```powershell
cd backend; npm ci; npm run test:unit; npm run test:integration
cd ../frontend; npm ci; npm test; npx playwright install chromium; npm run test:e2e
cd ../mvp-avior/backend; npm ci; npm run test:unit; npm run test:integration
cd ../frontend; npm ci; npm run test:unit; npx playwright install chromium; npm run test:e2e
```

GitHub Actions instala Chromium y ejecuta las seis categorías en CI al hacer push o abrir un PR a `dev`; PostgreSQL se levanta como servicio de los jobs que lo requieren.

## CI/CD y servicios externos

`.github/workflows/dev.yml` corre las pruebas de ambas prácticas en `dev`. `.github/workflows/main.yml` publica las cuatro imágenes a Docker Hub, aplica Terraform y después configura/despliega los dos proyectos con Ansible. Terraform conserva su estado en un bucket privado de OCI Object Storage mediante el backend OCI nativo, de modo que los siguientes pushes actualicen la misma VM en lugar de crear copias.

Antes del primer despliegue:

1. En OCI, crea un bucket privado de Object Storage para el estado Terraform y habilita el versionado del bucket. Anota el namespace del Object Storage.
2. En OCI, confirma que el usuario de las credenciales de API de Terraform tenga permiso de leer/escribir objetos en ese bucket.
3. En GitHub, añade los secretos requeridos de la tabla siguiente y crea el entorno `oci-production` con un revisor obligatorio. El job de Terraform quedará detenido hasta que una persona apruebe el despliegue de pago.
4. Revisa el costo antes de aprobar el job. La configuración usa `VM.Standard.E4.Flex`, 1 OCPU y 8 GB RAM, una instancia pagada. La estimación de cómputo es aproximadamente US$0.0484922/hora (US$35.40 por 730 horas), sin incluir disco de arranque, almacenamiento, tráfico, impuestos ni variaciones regionales. Confirma el total en el estimador OCI de la región de la cuenta.
5. VNC solo escucha en localhost; conéctate mediante túnel SSH: `ssh -L 5901:127.0.0.1:5901 ubuntu@IP_PUBLICA`.

| GitHub Secret | Uso |
|---|---|
| `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN` | Publicar imágenes y descargarlas en la VM |
| `OCI_TENANCY_OCID`, `OCI_USER_OCID`, `OCI_FINGERPRINT`, `OCI_PRIVATE_KEY`, `OCI_REGION`, `OCI_COMPARTMENT_OCID` | Proveedor OCI de Terraform |
| `OCI_OBJECT_STORAGE_NAMESPACE`, `OCI_STATE_BUCKET` | Estado remoto de Terraform |
| `SSH_PUBLIC_KEY`, `SSH_PRIVATE_KEY` | Acceso SSH de Ansible a la VM |
| `VNC_PASSWORD` | Contraseña VNC (mínimo 8 caracteres) |
| `POSTGRES_PASSWORD`, `MVP_POSTGRES_PASSWORD` | PostgreSQL (mínimo 16 caracteres cada una) |
| `MVP_JWT_SECRET` | Firma de sesiones (mínimo 32 caracteres) |
| `MVP_ADMIN_USERNAME`, `MVP_ADMIN_PASSWORD` | Cuenta administrativa inicial de AVIOR (contraseña mínimo 12 caracteres) |

No guardes credenciales, tokens, claves privadas ni archivos `.env` en Git.

## Dominio opcional

Cloudflare solo añade puntos si existe un dominio y una zona DNS bajo tu cuenta. Cuando confirmes el dominio, el registro `A` debe apuntar a la IP pública de la VM; después se habilita HTTPS y proxy DNS. No se compró ni cambió un dominio como parte de estos cambios locales.

Consulta [docs/practicas-3.2-y-4.1.md](docs/practicas-3.2-y-4.1.md) para el detalle de requisitos, responsabilidades del equipo y evidencias.
