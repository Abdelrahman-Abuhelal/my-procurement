# Mini Procurement Portal

Full-stack catalog management application for the technical assessment.

## Stack

- Monorepo: Nx
- Frontend: Angular (SSR)
- State: NgRx
- Backend: NestJS
- Database: MongoDB

## Features Implemented

- Authentication: sign-up, sign-in, sign-out
- 8-hour session token expiration
- Protected routes for catalog pages
- Protected catalog list with loading, empty, and error states
- Catalog search/filter
- Protected create-item form persisted in MongoDB
- Swagger API documentation

## Project Structure

- `apps/procurement-portal` - Angular frontend
- `apps/api` - NestJS backend
- `deploy/nginx` - reverse proxy config for unified app entrypoint

## Environment Variables

Create `apps/api/.env` from `.env.example`:

```env
MONGO_URI=mongodb://mongo:27017/procurement_portal
JWT_SECRET=change-me-in-production
JWT_EXPIRES_IN=8h
PORT=3000
NODE_ENV=production
```

## Run with Docker (Recommended)

1. Ensure Docker Desktop is running.
2. Create `apps/api/.env` from `.env.example`.
3. Start the full stack:

```bash
docker compose up --build
```

4. Access the app:

- Main app (nginx): `http://localhost:8080`
- Frontend direct: `http://localhost:4200`
- API direct: `http://localhost:3000/api`
- Swagger docs: `http://localhost:3000/api/docs`

To stop containers:

```bash
docker compose down
```

## Run Without Docker

Frontend:

```bash
npx nx serve procurement-portal
```

Backend:

```bash
npx nx serve api
```

## API Endpoints (Minimum Required)

- `POST /api/auth/signup`
- `POST /api/auth/signin`
- `GET /api/items`
- `POST /api/items`

## GCP Deployment

This project can be deployed to one Google Compute Engine VM using the same Docker Compose setup.

1. Configure gcloud:

```bash
gcloud auth login
gcloud config set project <YOUR_PROJECT_ID>
```

2. Create a VM:

```bash
gcloud compute instances create procurement-portal-vm \
  --zone=me-central2-a \
  --machine-type=e2-medium \
  --image-family=debian-12 \
  --image-project=debian-cloud \
  --tags=procurement-portal-http
```

3. Open HTTP firewall:

```bash
gcloud compute firewall-rules create allow-procurement-http \
  --allow=tcp:80 \
  --target-tags=procurement-portal-http
```

4. SSH into the VM:

```bash
gcloud compute ssh procurement-portal-vm --zone=me-central2-a
```

5. Install Docker and Docker Compose plugin:

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin git
sudo usermod -aG docker $USER
newgrp docker
```

6. Clone the repository and create `apps/api/.env`.

7. Start the stack:

```bash
APP_PORT=80 docker compose up -d --build
```

8. Visit:

- `http://<EXTERNAL_IP>`
- `http://<EXTERNAL_IP>/api/docs`

## Assumptions

- JWT auth is used with 8-hour expiration.
- MongoDB can be local containerized MongoDB or MongoDB Atlas.
- For demo simplicity, deployment path uses one Compute Engine VM with Docker Compose.
