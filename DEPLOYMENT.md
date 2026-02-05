# Deployment Guide

This application is configured for production using **PostgreSQL** and **Docker**.

## Prerequisites

- Docker & Docker Compose
- Environment variables configured (see `env.production.template`)

## 1. Environment Setup

Copy the template to a production `.env` file:

```bash
cp env.production.template .env
```

Edit `.env` and ensure `DATABASE_URL` matches your Postgres credentials.

## 2. Using Docker Compose (Recommended)

This will start the application and a local PostgreSQL database.

```bash
# Start services
docker-compose up -d --build

# Run Database Migrations (First time setup)
docker-compose exec sendy-dashboard npx prisma migrate deploy

# (Optional) Seed Initial Data
docker-compose exec sendy-dashboard npx tsx prisma/seed.ts
```

## 3. Manual Deployment (Node.js)

If deploying without Docker:

```bash
# Install dependencies
npm ci

# Generate Prisma Client
npx prisma generate

# Run Migrations
npx prisma migrate deploy

# Build
npm run build

# Start
npm start
```

## Troubleshooting

- **Database Connection Error**: Ensure `DATABASE_URL` is correct and the database is running. If using Docker, use the service name `db` as the host.
- **Permission Denied**: If running locally on Linux, you may need `sudo` for Docker commands.

## 4. Deploying to Coolify

This project is configured for seamless deployment on Coolify.

### Step 1: Add Resource

1. Go to your Coolify dashboard.
2. Select **"Project"** -> **"New"** -> **"GitHub / Private Git"**.
3. Select this repository.

### Step 2: Configuration

In the **Configuration** tab:

1. **Build Pack**: Select `Docker Compose` or `Docker Configuration`.
2. **Docker Image**: Ensure it points to the `Dockerfile`.

### Step 3: Environment Variables

Go to the **Environment Variables** tab and add the following (copy from your `.env`):

| Variable                | Description                                                                        |
| ----------------------- | ---------------------------------------------------------------------------------- |
| `DATABASE_URL`          | Connection string to your Postgres DB (e.g. `postgresql://user:pass@host:5432/db`) |
| `AUTH_SECRET`           | Secure random string                                                               |
| `ACCESS_PASSWORD`       | Password for accessing the dashboard (e.g. `password123`)                          |
| `NEXTAUTH_URL`          | The full URL of your deployed app (e.g. `https://sendy.yourdomain.com`)            |
| `DB_HOST`, `DB_USER`... | Connection details for your remote Sendy MySQL database                            |

> **Note**: For `DATABASE_URL`, if you are using a PostgreSQL database hosted within Coolify, use the internal connection string provided by Coolify.

### Step 4: Deploy

Click **"Deploy"**.

- The build process will automatically Create `deploy.sh`.
- On startup, the container will **automatically run migrations** and **seed the admin user**.

### Troubleshooting Coolify

- Check the **"Logs"** tab in Coolify.
- You should see "🚀 Starting Deployment Script..." followed by migration logs.
- If login fails, check if the "🌱 Seeding Database..." step succeeded.
