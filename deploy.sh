#!/bin/sh
set -e

echo "🚀 Starting Deployment Script..."

# 1. Run Migrations
echo "📦 Running Database Migrations..."
npx prisma migrate deploy

# 2. Seed Database (Idempotent - Safe to run every time)
echo "🌱 Seeding Database..."
npx tsx prisma/seed.ts

# 3. Start Application
echo "✅ Starting Next.js Server..."
exec node server.js
