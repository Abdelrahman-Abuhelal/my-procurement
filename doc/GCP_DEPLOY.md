# GCP Deployment Guide (Docker Compose on Compute Engine)

This guide deploys the existing Docker setup on one Google Compute Engine VM.

## Why this path

- Fastest way to deploy the full stack for assessment/demo.
- Uses the same local Docker Compose setup.
- Keeps frontend, API, and MongoDB in one reproducible environment.

## Architecture

Services started from `docker-compose.yml`:

- `mongo` (MongoDB)
- `api` (NestJS)
- `web` (Angular SSR)
- `nginx` (public entrypoint and reverse proxy)

Public URL flows through `nginx`:

- `/` -> `web`
- `/api/*` -> `api`

## Prerequisites

- Google Cloud SDK (`gcloud`) installed and authenticated
- Billing-enabled GCP project
- Compute Engine API enabled
- Your repository available on GitHub

## 1. Configure gcloud

```bash
gcloud auth login
gcloud config set project <YOUR_PROJECT_ID>
```

## 2. Create VM

```bash
gcloud compute instances create procurement-portal-vm \
  --zone=me-central2-a \
  --machine-type=e2-medium \
  --image-family=debian-12 \
  --image-project=debian-cloud \
  --tags=procurement-portal-http
```

## 3. Open HTTP firewall

```bash
gcloud compute firewall-rules create allow-procurement-http \
  --allow=tcp:80 \
  --target-tags=procurement-portal-http
```

If the rule already exists, skip this step.

## 4. SSH into VM

```bash
gcloud compute ssh procurement-portal-vm --zone=me-central2-a
```

## 5. Install Docker + Compose plugin on VM

```bash
sudo apt update
sudo apt install -y docker.io docker-compose-plugin git
sudo usermod -aG docker $USER
newgrp docker
```

## 6. Clone repository

```bash
git clone <YOUR_REPO_URL>
cd procurement-portal
```

## 7. Create backend env file on VM

Create `apps/api/.env`:

```env
MONGO_URI=mongodb://mongo:27017/procurement_portal
JWT_SECRET=<STRONG_SECRET>
JWT_EXPIRES_IN=8h
PORT=3000
NODE_ENV=production
```

For MongoDB Atlas instead of local mongo service, set `MONGO_URI` to your Atlas connection string.

## 8. Start the stack

```bash
APP_PORT=80 docker compose up -d --build
```

## 9. Verify deployment

Get external IP:

```bash
gcloud compute instances describe procurement-portal-vm \
  --zone=me-central2-a \
  --format='get(networkInterfaces[0].accessConfigs[0].natIP)'
```

Open in browser:

- `http://<EXTERNAL_IP>`
- `http://<EXTERNAL_IP>/api/docs`

## 10. Update deployment

On the VM:

```bash
git pull
APP_PORT=80 docker compose up -d --build
```

## Operational Notes

- Keep production secrets only in `apps/api/.env` on the VM (do not commit them).
- Add HTTPS later with a load balancer and managed certificate if needed.
- For a simple interview demo, this setup is sufficient and easy to explain.
