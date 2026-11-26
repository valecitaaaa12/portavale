# Deployment on the existing OCI VM

The OCI instance `avior-web` already serves the AVIOR Corporation website on port 80. This deployment keeps that site at `/` and adds the two practices under `/practicas/portafolio/` and `/practicas/mvp/`. Their APIs and uploads use corresponding `/practicas/*` paths, so no additional public firewall ports are required.

The VM's Docker daemon runs the services from `docker-compose.oci-existing.yml`. The script `deployment/deploy-to-existing-avior-web.sh` creates the Docker network, adds the services, preserves the current Nginx configuration as a backup, validates the added routes, and reloads Nginx. It rolls the Nginx config back if validation fails.

Create a private `.env` file next to the compose file on the VM. Generate unique random values for each secret and do not commit this file:

```dotenv
PORTFOLIO_DB_PASSWORD=<random alphanumeric secret>
MVP_DB_PASSWORD=<different random alphanumeric secret>
MVP_JWT_SECRET=<random secret of at least 32 bytes>
MVP_ADMIN_USERNAME=admin
MVP_ADMIN_PASSWORD=<unique strong admin password>
```

Start the services and routes with:

```sh
bash deployment/deploy-to-existing-avior-web.sh
```

The compose limits memory for the two databases, APIs, and static frontends to fit the existing 1 GB VM. Databases and AVIOR uploads use persistent Docker volumes. The existing site's root container and its image are left in place.

Current instance URL paths are `http://150.230.69.130/practicas/portafolio/` and `http://150.230.69.130/practicas/mvp/`. The MVP login uses the username and password in the VM's private `.env` file. This deployment is HTTP only; HTTPS still requires a configured domain and certificate.
