# Entrega de las prácticas 3.2 y 4.1

Este repositorio reúne el portafolio personal (práctica 3.2) y AVIOR, un MVP de gestión de horas y pagos de instructores (práctica 4.1). AVIOR se trabaja en equipo de dos personas: una persona puede encargarse de interfaz/experiencia y la otra de API/datos/infraestructura; ambas revisan pruebas y entrega.

## Práctica 3.2 — Portafolio personal

- **Frontend:** React y Vite en `frontend/`.
- **Backend:** Node.js y Express en `backend/`.
- **Base de datos:** PostgreSQL.
- **Pruebas automatizadas:** unitarias de frontend y backend, integración de API con PostgreSQL y E2E con Playwright. El proyecto tiene más de 3 pruebas en cada categoría.
- **CI en `dev`:** cada push y pull request ejecuta los seis grupos de pruebas definidos en `.github/workflows/dev.yml`.
- **Docker:** imágenes separadas para frontend y backend; Compose de producción con PostgreSQL.
- **VM:** Terraform define VCN, subnet pública, reglas de red e instancia Ubuntu 24.04 con IP pública. Ansible instala Git, Docker, UFW/iptables y VNC. VNC escucha solo en localhost; acceder mediante túnel SSH: `ssh -L 5901:127.0.0.1:5901 ubuntu@IP_PUBLICA`.

## Práctica 4.1 — MVP AVIOR

- **Frontend:** React y Vite en `mvp-avior/frontend/`.
- **Backend:** Node.js y Express en `mvp-avior/backend/`.
- **Base de datos:** PostgreSQL.
- **Funcionalidad:** inicio de sesión administrativo, directorio de instructores, registro de clases/horas, cálculo de montos y periodos, pagos pendientes, configuración de corte, avisos y carga de QR.
- **Pruebas:** 6 unitarias de interfaz, al menos 24 unitarias de backend, 7 de integración API y 6 E2E con Playwright. Se supera el mínimo de 6 por categoría.
- **Trabajo en pareja:** distribuir interfaz/accesibilidad y diseño entre una persona; API, modelo de datos y despliegue entre la otra; revisar entre ambas los tests y cambios.

## Cómo ejecutar y probar

Requiere Node.js 20, Docker Desktop con motor Linux activo y Playwright/Chromium para E2E.

```powershell
# Portafolio
cd backend; npm ci; npm test
cd ../frontend; npm ci; npm test; npx playwright install chromium; npm run test:e2e

# MVP AVIOR (para integración local, iniciar PostgreSQL primero)
cd ../mvp-avior/backend; npm ci; npm run test:unit; npm run test:integration
cd ../frontend; npm ci; npm run test:unit; npx playwright install chromium; npm run test:e2e
```

En `dev`, GitHub Actions inicia PostgreSQL como servicio para las pruebas de integración. Para ejecutar toda la aplicación en local, revisar `mvp-avior/README.md` y `docker-compose.yml`.

## Publicación en `main`

`.github/workflows/main.yml` espera pruebas verdes y publica cuatro imágenes a Docker Hub: `portafolio-frontend`, `portafolio-backend`, `mvp-avior-frontend` y `mvp-avior-backend`. Luego valida/planifica Terraform y Ansible configura/despliega el Compose conjunto en la VM. El portafolio queda en `/` y AVIOR en `/mvp/`.

Configurar estos **GitHub Actions Secrets** en el repositorio antes de activar la publicación: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `OCI_TENANCY_OCID`, `OCI_USER_OCID`, `OCI_FINGERPRINT`, `OCI_PRIVATE_KEY`, `OCI_REGION`, `OCI_COMPARTMENT_OCID`, `SSH_PUBLIC_KEY`, `SSH_PRIVATE_KEY`, `VM_PUBLIC_IP`, `POSTGRES_PASSWORD`, `MVP_POSTGRES_PASSWORD`, `MVP_JWT_SECRET`, `MVP_ADMIN_USERNAME`, `MVP_ADMIN_PASSWORD`, `VNC_PASSWORD`.

El workflow ejecuta `terraform plan`; no aplica cambios de red/VM automáticamente hasta importar la VM existente y guardar el estado Terraform remoto. Esto evita crear una segunda instancia por cada push. La configuración Terraform está en `terraform/`. El estado remoto/ importación inicial debe quedar listo antes de habilitar `terraform apply` en CI.

## Dominio opcional

El bonus de Cloudflare requiere un dominio registrado y acceso a su zona. Cuando se disponga de un dominio, apuntar el DNS a la IP pública y añadir TLS (Cloudflare proxy o certificado en el servidor); no se ha registrado ni modificado una zona por esta entrega.
