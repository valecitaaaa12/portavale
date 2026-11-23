# 🎨 Portafolio Personal — Valentina Valda

**Práctica 3.2** — Portafolio personal con frameworks Frontend, Backend y BD,
pipeline en GitHub Actions, empaquetado en Docker, infraestructura con
Terraform (Oracle Cloud) y configuración con Ansible.

## 📁 Estructura

```
portafolio-personal/
├── .github/workflows/
│   ├── dev.yml          # Push a dev → pruebas automatizadas
│   └── main.yml         # Push a main → Docker + Terraform + Ansible
├── frontend/            # React + Vite (Dockerfile multi-etapa + Nginx)
│   ├── src/
│   ├── tests/           # Tests unitarios (Vitest)
│   └── e2e/             # Tests E2E (Playwright)
├── backend/             # Express + PostgreSQL (API REST)
│   ├── src/
│   └── tests/           # Unit (Jest) + Integración (Supertest)
├── terraform/           # VCN, subnet, security list, VM Ubuntu 24.04, IP pública
├── ansible/             # Playbook: docker, git, firewall/iptables, VNC, despliegue
├── scripts/setup-vm.sh  # Alternativa con script bash
├── docker-compose.yml   # Desarrollo local
└── docker-compose.prod.yml  # Despliegue en la VM (imágenes de Docker Hub)
```

## 🚀 Ejecución local

```bash
# 1. Base de datos
docker compose up -d db

# 2. Backend (terminal 1)
cd backend
npm install
npm run seed
npm run dev            # http://localhost:5000

# 3. Frontend (terminal 2)
cd frontend
npm install
npm run dev            # http://localhost:5173
```

## 🧪 Tests

```bash
# Unit + integración (backend)
cd backend && npm test

# Unit (frontend)
cd frontend && npm test

# E2E (requiere docker compose up -d db)
cd frontend && npx playwright install chromium && npm run test:e2e
```

## 🐳 Docker

```bash
Copy-Item .env.example .env      # define una clave propia para la base de datos
docker compose up -d --build     # frontend en :80, backend en :5000, db en :5432
```

Para producción, define `POSTGRES_PASSWORD`, `DOCKERHUB_USERNAME` y `VNC_PASSWORD` en `.env` o como secretos del entorno. No uses credenciales de ejemplo en una VM pública.

## ☁️ Infraestructura

- **Terraform**: VCN + subnet pública + security list (22, 80, 443, 5900/VNC)
  + VM Ubuntu 24.04 con IP pública en Oracle Cloud.
- **Ansible**: instala Docker y Git, configura firewall (UFW + iptables en 80/443),
  instala VNC y levanta el portafolio con Docker Compose.

## 🔑 Secrets de GitHub requeridos (para main)

| Secret | Descripción |
|---|---|
| `DOCKERHUB_USERNAME` | Usuario de Docker Hub |
| `DOCKERHUB_TOKEN` | Token de acceso de Docker Hub |
| `OCI_TENANCY_OCID` | OCID del tenancy |
| `OCI_USER_OCID` | OCID del usuario |
| `OCI_FINGERPRINT` | Fingerprint de la API key |
| `OCI_PRIVATE_KEY` | Contenido de la clave privada .pem |
| `OCI_REGION` | Región (ej. us-ashburn-1) |
| `OCI_COMPARTMENT_OCID` | OCID del compartment |
| `SSH_PUBLIC_KEY` | Clave pública SSH para la VM |
| `SSH_PRIVATE_KEY` | Clave privada SSH para Ansible |
| `VNC_PASSWORD` | Contraseña del servidor VNC |

## 🌐 Cloudflare (puntos extra)

Zona de dominio + registro `A` apuntando a la IP pública de la VM.
