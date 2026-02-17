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

### Step 3: Environment Variables (CRITICAL)

Go to the **Environment Variables** tab and add the following. **MISSING ANY OF THESE WILL CAUSE ERRORS.**

| Variable          | Description                                         | Example Value                                   |
| :---------------- | :-------------------------------------------------- | :---------------------------------------------- |
| `DATABASE_URL`    | **Required**. Connection to local/remote Postgres.  | `postgresql://user:pass@db:5432/sendydashboard` |
| `AUTH_SECRET`     | **Required**. Random string for session encryption. | `openssl rand -base64 32` output                |
| `NEXTAUTH_URL`    | **Required**. The full URL of your deployed app.    | `https://your-dashboard.com`                    |
| `DB_HOST`         | **Required**. Sendy MySQL Host.                     | `sendy.yourdomain.com`                          |
| `DB_USER`         | **Required**. Sendy MySQL User.                     | `sendy_user`                                    |
| `DB_PASSWORD`     | **Required**. Sendy MySQL Password.                 | `secret_password`                               |
| `DB_NAME`         | **Required**. Sendy MySQL Database Name.            | `sendy`                                         |
| `ACCESS_PASSWORD` | _Optional_. Custom login password.                  | `password123` (default)                         |

> **Note**: For `DATABASE_URL`, if you are using a PostgreSQL database hosted within Coolify, use the internal connection string provided by Coolify.

### Step 4: Deploy

Click **"Deploy"**.

- The build process will automatically Create `deploy.sh`.
- On startup, the container will **automatically run migrations**.

## Troubleshooting & Debugging

If you cannot login or see data:

1.  **Check the Debug Route**:
    Visit `https://your-app-url.com/api/debug/connection`
    - **AUTH_SECRET**: Must check "Set (OK)". If "MISSING", login will fail.
    - **Prisma Status**: Must be "success". If failed, check `DATABASE_URL`.
    - **Sendy Status**: Must be "success". If failed, check `DB_HOST`, `DB_USER`, `DB_PASSWORD`.

2.  **Common Issues**:
    - **Database Connection Refused**: Ensure the database container is running and reachable. In Docker, use the service name (e.g., `db`) as the hostname, NOT `localhost`.
    - **Access Denied**: Check your MySQL/Postgres username and password.
    - **Login Fails**: Ensure `AUTH_SECRET` is set. Try the default password `password123`.

3.  **Logs**:
    Check the container logs in Coolify/Docker for more specific error messages.
