#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

docker network inspect portavale-edge >/dev/null 2>&1 || docker network create portavale-edge
docker network connect portavale-edge avior-web 2>/dev/null || true

docker compose -p portavale-practicas -f docker-compose.oci-existing.yml up -d --build

server_conf=/etc/nginx/conf.d/default.conf
backup=/etc/nginx/conf.d/default.conf.portavale-backup
route_include=/etc/nginx/practicas-routes.inc

if ! docker exec avior-web test -f "$backup"; then
  docker exec avior-web cp "$server_conf" "$backup"
fi
docker cp deployment/avior-web-practicas.conf "avior-web:$route_include"

if ! docker exec avior-web grep -qF "include $route_include;" "$server_conf"; then
  docker exec avior-web sed -i "/location \\/ {/i\\    include $route_include;" "$server_conf"
fi

if ! docker exec avior-web nginx -t; then
  docker exec avior-web cp "$backup" "$server_conf"
  docker exec avior-web rm -f "$route_include"
  docker exec avior-web nginx -t || true
  exit 1
fi

docker exec avior-web nginx -s reload
docker compose -p portavale-practicas -f docker-compose.oci-existing.yml ps
