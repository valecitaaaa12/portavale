# Entrega de las prácticas 3.2 y 4.1

Este repositorio reúne el portafolio personal (práctica 3.2) y AVIOR, un MVP de gestión de horas y pagos de instructores (práctica 4.1). AVIOR se trabaja en equipo de dos personas: una persona puede encargarse de interfaz/experiencia y la otra de API/datos/infraestructura; ambas revisan pruebas y entrega.

## Práctica 3.2 — Portafolio personal

- **Frontend:** React y Vite en `frontend/`.
- **Backend:** Node.js y Express en `backend/`.
- **Base de datos:** PostgreSQL.
- **Pruebas automatizadas:** 20 unitarias de frontend, 10 unitarias de backend, 8 pruebas de integración API y 6 E2E con Playwright.
- **CI en `dev`:** cada push y pull request ejecuta los seis grupos de pruebas definidos en `.github/workflows/dev.yml`.
- **Docker:** imágenes separadas para frontend y backend; Compose de producción con PostgreSQL.
- **VM:** Terraform define VCN, subnet pública, reglas de red e instancia pagada Ubuntu 24.04 con IP pública: `VM.Standard.E4.Flex`, 1 OCPU y 8 GB RAM. La tarifa pública de cómputo estima aproximadamente US$35.40 por 730 horas al mes, sin disco, tráfico ni impuestos. Ansible instala Git, Docker, UFW/iptables y VNC. VNC escucha solo en localhost; acceder mediante túnel SSH: `ssh -L 5901:127.0.0.1:5901 ubuntu@IP_PUBLICA`.

## Práctica 4.1 — MVP AVIOR

- **Frontend:** React y Vite en `mvp-avior/frontend/`.
- **Backend:** Node.js y Express en `mvp-avior/backend/`.
- **Base de datos:** PostgreSQL.
- **Funcionalidad:** inicio de sesión administrativo, directorio de instructores, registro de clases/horas, cálculo de montos y periodos, pagos pendientes, configuración de corte, avisos y carga de QR.
- **Pruebas:** 7 unitarias de interfaz, 26 unitarias de backend, 7 de integración API y 6 E2E con Playwright. Se supera el mínimo de 6 por categoría.
- **Trabajo en pareja:** distribuir interfaz/accesibilidad y diseño entre una persona; API, modelo de datos y despliegue entre la otra; revisar entre ambas los tests y cambios.

## Cómo ejecutar y probar

Requiere Node.js 20 o superior, Docker Desktop con motor Linux activo y Playwright/Chromium para E2E.

```powershell
# Portafolio
cd backend; npm ci; npm test
cd ../frontend; npm ci; npm test; npx playwright install chromium; npm run test:e2e

# MVP AVIOR (para integración local, iniciar PostgreSQL primero)
cd ../mvp-avior/backend; npm ci; npm run test:unit; npm run test:integration
cd ../frontend; npm ci; npm run test:unit; npx playwright install chromium; npm run test:e2e
```

En `dev`, GitHub Actions inicia PostgreSQL como servicio para las pruebas que lo requieren. Para ejecutar las dos aplicaciones en Docker local, usar `docker-compose.yml` y `mvp-avior/docker-compose.yml`.

## Publicación en `main`

`.github/workflows/main.yml` espera pruebas verdes y publica cuatro imágenes a Docker Hub: `portafolio-frontend`, `portafolio-backend`, `mvp-avior-frontend` y `mvp-avior-backend`. El job Terraform usa el backend OCI nativo y estado remoto privado en Object Storage para actualizar la misma infraestructura en siguientes ejecuciones. El job Terraform corre bajo el entorno GitHub `oci-production`; hay que configurarlo con un revisor obligatorio para que una persona apruebe el despliegue pagado. Después, Ansible configura/despliega el Compose conjunto en la VM. El portafolio queda en `/` y AVIOR en `/mvp/`.

Crear previamente un bucket privado y versionado para el estado Terraform. El usuario de API de OCI debe tener permisos de lectura/escritura de objetos en ese bucket. Configurar estos **GitHub Actions Secrets** en el repositorio: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `OCI_TENANCY_OCID`, `OCI_USER_OCID`, `OCI_FINGERPRINT`, `OCI_PRIVATE_KEY`, `OCI_REGION`, `OCI_COMPARTMENT_OCID`, `OCI_OBJECT_STORAGE_NAMESPACE`, `OCI_STATE_BUCKET`, `SSH_PUBLIC_KEY`, `SSH_PRIVATE_KEY`, `POSTGRES_PASSWORD`, `MVP_POSTGRES_PASSWORD`, `MVP_JWT_SECRET`, `MVP_ADMIN_USERNAME`, `MVP_ADMIN_PASSWORD`, `VNC_PASSWORD`. La IP pública se obtiene del output de Terraform, no se guarda como secreto.

Antes de aprobar el primer despliegue, revisar en OCI si ya existe una VM creada por una ejecución anterior. Si existe, importarla al estado remoto en vez de crear otra. El estado remoto y los secretos deben quedar listos antes de habilitar el job de Terraform. Al estar protegido con revisión obligatoria, Terraform no empieza hasta que una persona aprueba ese job.

## Dominio opcional

El bonus de Cloudflare requiere un dominio registrado y acceso a su zona. Cuando se disponga de un dominio, apuntar el DNS a la IP pública y añadir TLS (Cloudflare proxy o certificado en el servidor); no se ha registrado ni modificado una zona por esta entrega.
