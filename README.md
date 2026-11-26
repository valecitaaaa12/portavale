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
3. En GitHub, añade los secretos requeridos de la tabla siguiente y configura el entorno `oci-production` utilizado por el workflow de despliegue.
4. La cuenta OCI está suscrita a São Paulo. Crear otra VM allí falló con `Out of host capacity`, por lo que el despliegue se hizo en la instancia ya existente `avior-web` (150.230.69.130), sin sustituir el sitio que sirve en `/`. Las prácticas responden en `/practicas/portafolio/` y `/practicas/mvp/`. La VM existente es Always Free; no se lanzó una instancia de pago.
5. La configuración de VNC del playbook corresponde a una VM nueva. No se instaló VNC en `avior-web`: la instancia existente tiene 1 GB de RAM y está sirviendo AVIOR más las dos prácticas.

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

Cloudflare solo añade puntos si existe un dominio y una zona DNS bajo tu cuenta. Cuando confirmes el dominio, el registro `A` debe apuntar a `150.230.69.130`; después se habilita HTTPS y proxy DNS. No se compró ni cambió un dominio. El despliegue actual funciona por HTTP.

## Estado del despliegue actual

El 26 de noviembre de 2026 se publicaron las aplicaciones en la VM existente. Se validaron desde fuera de la instancia la página AVIOR existente, las dos interfaces y las dos rutas de salud de API; todas devolvieron HTTP 200. La ejecución DEV `45825686180` del commit `8e31714` terminó correctamente. Las cuatro imágenes están construidas y ejecutándose en la VM; falta publicarlas en Docker Hub y completar el workflow MAIN cuando se disponga de las credenciales requeridas. Consulta [docs/OCI_EXISTING_VM.md](docs/OCI_EXISTING_VM.md).

Las reglas TCP 80 y 443 en iptables se conservan mediante `deployment/configure-firewall.sh` y `portavale-firewall.service`. Para repetir la configuración, ejecuta `sudo bash deployment/configure-firewall.sh` antes del script de rutas.

Consulta [docs/practicas-3.2-y-4.1.md](docs/practicas-3.2-y-4.1.md) para el detalle de requisitos, responsabilidades del equipo y evidencias.
