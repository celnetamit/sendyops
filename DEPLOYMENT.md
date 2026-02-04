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
