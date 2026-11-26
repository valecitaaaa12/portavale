# MVP AVIOR — Práctica 4.1

Aplicación privada de administración para el registro de horas y gestión de pagos a instructores de AVIOR CORPORATION SRL. La interfaz y la API están en español. El sistema no procesa transferencias: permite revisar datos bancarios/QR y registrar el pago una vez realizado por la persona administradora.

## Funcionalidad

- Inicio de sesión administrativo con token de sesión.
- Resumen de pagos pendientes y movimientos registrados.
- Directorio de instructores con tarifa individual, cuenta, WhatsApp y carga de QR.
- Registro de clase/fecha/horas y cálculo del monto desde la tarifa del instructor.
- Vista “Por pagar” agrupada por instructor; cada clase tiene una acción separada para registrar el pago y mostrar su QR.
- Configuración del día de corte, preferencias de avisos y recordatorios dentro de la aplicación.
- PostgreSQL, contenedores Docker, Terraform para Oracle Cloud y playbook Ansible.

## Ejecutar localmente

Instala Docker Desktop y espera a que el motor muestre “Running”. Desde esta carpeta:

```sh
cp .env.example .env
# Edita .env: cambia POSTGRES_PASSWORD, JWT_SECRET y ADMIN_PASSWORD.
docker compose up --build
```

Abre http://localhost:5174. La API responde en http://localhost:5001/api/health; PostgreSQL queda ligado a localhost en el puerto 5433. En modo local se puede usar `admin` / `Admin123!`; define tu propio `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `JWT_SECRET` y credenciales de base de datos en `.env` antes de usar datos reales.

También puedes ejecutar el frontend con Vite (`npm --prefix frontend run dev`) y la API con `npm --prefix backend run dev`; en ese modo Vite reenvía `/api` y `/uploads` a `localhost:5001`.

## Pruebas

```sh
npm install --prefix backend
npm install --prefix frontend
npm run test:unit
npm run test:integration
npm run test:e2e
```

Las pruebas de API usan una base de datos simulada y no requieren credenciales de nube. Playwright necesita Chromium (`npx playwright install chromium`).

## CI/CD y nube

`dev.yml` ejecuta pruebas al hacer push o abrir PR hacia `dev`. `main.yml` requiere que pasen unit, integración y E2E; publica frontend/backend en Docker Hub y, después, crea y configura una VM Ubuntu 24.04 en Oracle Cloud con Terraform y Ansible.

Antes de habilitar los jobs de publicación/despliegue, configura los secretos de GitHub: `DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `OCI_TENANCY_OCID`, `OCI_USER_OCID`, `OCI_FINGERPRINT`, `OCI_PRIVATE_KEY`, `OCI_REGION`, `OCI_COMPARTMENT_OCID`, `SSH_PUBLIC_KEY`, `SSH_PRIVATE_KEY`, `JWT_SECRET`, `POSTGRES_PASSWORD` y `VNC_PASSWORD`. El despliegue real se deja pendiente hasta disponer de esos secretos y autorización de uso de la cuenta OCI.

Para una VM existente, la configuración de producción liga el frontend a `127.0.0.1:8080`; colócalo detrás de un proxy HTTPS antes de dar acceso externo. La semilla demo se desactiva en producción y se exige definir `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `POSTGRES_PASSWORD` y `JWT_SECRET` en el archivo `.env` del servidor. No expongas la API ni PostgreSQL directamente a Internet.

No guardes claves privadas, tokens, contraseñas reales ni `.env` en Git.
