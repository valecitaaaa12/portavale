# Deployment on the existing OCI VM

The OCI instance `avior-web` already serves the AVIOR Corporation website on port 80. This deployment keeps that site at `/` and adds the two practices under `/practicas/portafolio/` and `/practicas/mvp/`. Their APIs and uploads use corresponding `/practicas/*` paths, so no additional public firewall ports are required.

The VM's Docker daemon runs the services from `docker-compose.oci-existing.yml`. The deployment needs an external Docker network named `portavale-edge`; connect the existing `avior-web` container and the new practice services to that network. Then copy `deployment/avior-web-practicas.conf` into the existing Nginx container and include it from `/etc/nginx/conf.d/default.conf` before its `location /` block. Run `nginx -t` before reloading Nginx.

Create a private `.env` file next to the compose file on the VM. Generate unique random values for each secret and do not commit this file:

```dotenv
PORTFOLIO_DB_PASSWORD=<random alphanumeric secret>
MVP_DB_PASSWORD=<different random alphanumeric secret>
MVP_JWT_SECRET=<random secret of at least 32 bytes>
MVP_ADMIN_USERNAME=admin
MVP_ADMIN_PASSWORD=<unique strong admin password>
```

Start the services with:

```sh
docker compose -p portavale-practicas -f docker-compose.oci-existing.yml up -d --build
```

The compose limits memory for the two databases, APIs, and static frontends to fit the existing 1 GB VM. Databases and AVIOR uploads use persistent Docker volumes. The existing site's root container and its image are left in place.

Current instance URL paths are `http://150.230.69.130/practicas/portafolio/` and `http://150.230.69.130/practicas/mvp/`. The MVP login uses the username and password in the VM's private `.env` file. This deployment is HTTP only; HTTPS still requires a configured domain and certificate.
