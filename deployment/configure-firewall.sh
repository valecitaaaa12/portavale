#!/usr/bin/env bash
set -euo pipefail

if [[ "${EUID}" -ne 0 ]]; then
  echo "Ejecuta este script con sudo." >&2
  exit 1
fi

cat >/usr/local/sbin/portavale-firewall.sh <<'RULES'
#!/bin/sh
set -eu
for port in 80 443; do
  iptables -C INPUT -p tcp --dport "$port" -j ACCEPT 2>/dev/null || iptables -I INPUT 5 -p tcp --dport "$port" -j ACCEPT
done
RULES
chmod 750 /usr/local/sbin/portavale-firewall.sh

cat >/etc/systemd/system/portavale-firewall.service <<'UNIT'
[Unit]
Description=Portavale inbound HTTP and HTTPS firewall rules
After=network-pre.target
Before=network.target

[Service]
Type=oneshot
ExecStart=/usr/local/sbin/portavale-firewall.sh
RemainAfterExit=yes

[Install]
WantedBy=multi-user.target
UNIT

systemctl daemon-reload
systemctl enable --now portavale-firewall.service
iptables -S INPUT
