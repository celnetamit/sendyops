# 🚀 Production Deployment Guide

## Prerequisites

Before deploying to production, ensure you have:

- ✅ Node.js 18+ installed
- ✅ Access to your Sendy MySQL database
- ✅ A production server or hosting platform
- ✅ SSL certificate for HTTPS (recommended)

---

## Step 1: Environment Configuration

### 1.1 Create Production Environment File

Copy the template and configure your production environment:

```bash
cp env.production.template .env
```

### 1.2 Configure Environment Variables

Edit `.env` with your production values:

```bash
# Sendy Database (REQUIRED)
DB_HOST=your-sendy-db-host.com
DB_USER=your_db_user
DB_PASSWORD=your_secure_password
DB_NAME=sendy
DB_PORT=3306

# Authentication Secret (REQUIRED)
# Generate with: openssl rand -base64 32
AUTH_SECRET=your_generated_secret_here

# Production URL (REQUIRED)
NEXTAUTH_URL=https://yourdomain.com
```

### 1.3 Generate Secure AUTH_SECRET

Run this command to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output and paste it as your `AUTH_SECRET` value.

---

## Step 2: Database Setup

### 2.1 Initialize Local Database

The application uses SQLite for local caching. Initialize it:

```bash
npx prisma migrate deploy
npx prisma generate
```

### 2.2 Create Admin User

The default admin user is:

- **Email**: `admin@sendy.com`
- **Password**: `admin`

> ⚠️ **IMPORTANT**: Change this password immediately after first login!

To create a custom admin user, use Prisma Studio:

```bash
npx prisma studio
```

Navigate to the `User` table and:

1. Create a new user
2. Set a hashed password (use bcrypt)
3. Set role to "admin"

---

## Step 3: Build for Production

### 3.1 Install Dependencies

```bash
npm install --production
```

### 3.2 Build the Application

```bash
npm run build
```

This will:

- Generate Prisma client
- Build Next.js for production
- Optimize assets and bundles

### 3.3 Verify Build

Check that the build completed successfully. You should see output like:

```
✓ Compiled successfully
Route (app)                              Size     First Load JS
┌ ○ /                                    5.73 kB         209 kB
├ ○ /campaigns                           3.83 kB         112 kB
├ ƒ /campaigns/[id]                      3.47 kB         105 kB
...
```

---

## Step 4: Test Production Build Locally

Before deploying, test the production build:

```bash
npm start
```

Visit `http://localhost:3000` and verify:

- ✅ Login works
- ✅ Dashboard displays
- ✅ Campaigns page loads
- ✅ Category filters work
- ✅ Campaign detail pages load
- ✅ Data sync works

---

## Step 5: Deployment Options

### Option A: Deploy to Vercel (Recommended)

1. **Install Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:

   ```bash
   vercel login
   ```

3. **Deploy**:

   ```bash
   vercel --prod
   ```

4. **Set Environment Variables** in Vercel Dashboard:
   - Go to Project Settings → Environment Variables
   - Add all variables from your `.env` file

### Option B: Deploy to VPS/Server

1. **Transfer Files**:

   ```bash
   rsync -avz --exclude node_modules --exclude .next ./ user@your-server:/path/to/app
   ```

2. **On Server**:

   ```bash
   cd /path/to/app
   npm install --production
   npm run build
   ```

3. **Use PM2 for Process Management**:

   ```bash
   npm install -g pm2
   pm2 start npm --name "sendy-dashboard" -- start
   pm2 save
   pm2 startup
   ```

4. **Configure Nginx** (example):

   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Enable SSL with Let's Encrypt**:
   ```bash
   sudo certbot --nginx -d yourdomain.com
   ```

### Option C: Deploy to Docker

1. **Create Dockerfile** (already exists in project)

2. **Build Image**:

   ```bash
   docker build -t sendy-dashboard .
   ```

3. **Run Container**:
   ```bash
   docker run -d \
     -p 3000:3000 \
     --env-file .env \
     --name sendy-dashboard \
     sendy-dashboard
   ```

---

## Step 6: Post-Deployment

### 6.1 First Login

1. Navigate to `https://yourdomain.com/login`
2. Login with admin credentials
3. **Change the default password immediately**

### 6.2 Sync Data

1. Click "Sync Data" button in the navigation
2. Wait for sync to complete
3. Verify campaigns appear with correct categories

### 6.3 Verify Features

Test all key features:

- ✅ Dashboard shows category statistics
- ✅ Campaign filtering works (Courses, Workshops, General)
- ✅ Campaign detail pages display sender information
- ✅ Search includes sender names
- ✅ Metrics are accurate

---

## Step 7: Monitoring & Maintenance

### 7.1 Monitor Application

- Check application logs regularly
- Monitor database connection
- Track sync success/failures

### 7.2 Regular Data Sync

Set up a cron job to sync data regularly:

```bash
# Add to crontab (sync every hour)
0 * * * * curl -X POST https://yourdomain.com/api/sync
```

### 7.3 Backup Database

Regularly backup your SQLite database:

```bash
cp prisma/dev.db prisma/dev.db.backup-$(date +%Y%m%d)
```

---

## Security Checklist

- ✅ Changed default admin password
- ✅ Using HTTPS in production
- ✅ AUTH_SECRET is secure and random
- ✅ Database credentials are secure
- ✅ Environment variables are not committed to git
- ✅ Firewall configured on server
- ✅ Regular security updates applied

---

## Troubleshooting

### Issue: "There was a problem with the server configuration"

**Solution**: Check your `.env` file has correct `AUTH_SECRET` and `NEXTAUTH_URL`

### Issue: Database connection fails

**Solution**:

1. Verify Sendy database credentials
2. Check firewall allows connection to MySQL port
3. Ensure database host is accessible from your server

### Issue: Build fails

**Solution**:

1. Clear cache: `rm -rf .next node_modules`
2. Reinstall: `npm install`
3. Rebuild: `npm run build`

### Issue: Sync button doesn't work

**Solution**:

1. Check Sendy database credentials in `.env`
2. Verify network connectivity to Sendy database
3. Check API logs for errors

---

## Performance Optimization

### Enable Caching

Add these headers in your Nginx/Apache config:

```nginx
location /_next/static {
    expires 365d;
    add_header Cache-Control "public, immutable";
}
```

### Database Optimization

For large datasets, consider:

- Adding indexes to frequently queried fields
- Implementing pagination for large lists
- Using database connection pooling

---

## Support & Updates

### Updating the Application

1. Pull latest changes
2. Run migrations: `npx prisma migrate deploy`
3. Rebuild: `npm run build`
4. Restart application

### Getting Help

If you encounter issues:

1. Check application logs
2. Review this deployment guide
3. Verify environment configuration
4. Check database connectivity

---

## Production Checklist

Before going live, ensure:

- [ ] Production environment variables configured
- [ ] AUTH_SECRET is secure and random
- [ ] Default admin password changed
- [ ] HTTPS/SSL enabled
- [ ] Database connection tested
- [ ] Production build successful
- [ ] All features tested in production
- [ ] Monitoring set up
- [ ] Backup strategy in place
- [ ] Team members have access
- [ ] Documentation reviewed

---

## Next Steps

Once deployed, you can:

1. Invite team members to use the platform
2. Set up regular data syncs
3. Create campaign templates
4. Monitor email performance
5. Generate reports for stakeholders

**Your Sendy Dashboard is now production-ready! 🎉**
