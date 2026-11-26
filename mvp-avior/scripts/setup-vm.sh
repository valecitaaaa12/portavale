#!/usr/bin/env bash
# =============================================================
# setup-vm.sh — Configuración de la VM del mvp-avior
# Alternativa a Ansible: instala Docker, Git, configurar
# firewall/iptables (80, 443) y levanta el mvp-avior.
# Uso: sudo bash setup-vm.sh <DOCKERHUB_USERNAME>
# =============================================================
set -euo pipefail

DOCKERHUB_USERNAME="${1:-valecitaaaa12}"
DEPLOY_DIR="/opt/mvp-avior"

echo "==> [1/7] Actualizando índices de paquetes..."
apt-get update -y

echo "==> [2/7] Instalando git, curl y ufw..."
apt-get install -y git curl ufw

echo "==> [3/7] Instalando Docker..."
if ! command -v docker >/dev/null 2>&1; then
  curl -fsSL https://get.docker.com | sh
fi
systemctl enable --now docker
usermod -aG docker ubuntu || true

echo "==> [4/7] Configurando firewall (UFW) en puertos 22, 80, 443, 5900..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw allow 5900/tcp
ufw --force enable

echo "==> [5/7] Configurando reglas explícitas de iptables..."
iptables -C INPUT -p tcp --dport 80 -j ACCEPT 2>/dev/null || iptables -A INPUT -p tcp --dport 80 -j ACCEPT
iptables -C INPUT -p tcp --dport 443 -j ACCEPT 2>/dev/null || iptables -A INPUT -p tcp --dport 443 -j ACCEPT
iptables -C INPUT -p tcp --dport 22 -j ACCEPT 2>/dev/null || iptables -A INPUT -p tcp --dport 22 -j ACCEPT

echo "==> [6/7] Desplegando el mvp-avior con Docker Compose..."
mkdir -p "$DEPLOY_DIR"
cp "$(dirname "$0")/../docker-compose.prod.yml" "$DEPLOY_DIR/docker-compose.yml"
echo "DOCKERHUB_USERNAME=${DOCKERHUB_USERNAME}" > "$DEPLOY_DIR/.env"
cd "$DEPLOY_DIR"
docker compose up -d --pull always

echo "==> [7/7] Estado de los contenedores:"
docker compose ps

echo "==> Listo. Sitio disponible en http://<IP-PUBLICA>"
