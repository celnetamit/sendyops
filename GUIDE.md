# Sendy Dashboard Connection Guide

This dashboard provides a **secure, high-performance** experience for visualizing your Sendy email campaign data with enhanced sender tracking and campaign categorization.

---

## 🔒 Authentication

**The dashboard is secure and requires login.**

- **Login URL**: `/login`
- **Default Admin User**:
  - **Email**: `admin@sendy.com`
  - **Password**: `admin`

> ⚠️ **Important**: Change this password immediately after first login via Prisma Studio (`npx prisma studio`)

---

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Create a `.env` file with your Sendy database credentials:

```env
# Remote Sendy Database
DB_HOST=your_sendy_host.com
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=sendy
DB_PORT=3306

# Auth Secret (Generate: openssl rand -base64 32)
AUTH_SECRET=your_secure_random_string

# Application URL
NEXTAUTH_URL=http://localhost:3000
```

### 3. Initialize Database

```bash
npx prisma migrate deploy
npx prisma generate
```

### 4. Start Development Server

```bash
npm run dev
```

Visit: **http://localhost:3000**

---

## 📊 Features

### Campaign Categorization

- **📚 Courses**: Automatically categorized course-related campaigns
- **🎯 Workshops**: Workshop and event campaigns
- **📧 General**: Other marketing emails

### Sender Tracking

- Track who sent each campaign
- Department information
- Campaign topics and target audience
- Enhanced search by sender

### Advanced Filtering

- Filter by category (Courses, Workshops, General)
- Filter by status (Sent, Sending, Scheduled, Draft)
- Search by title, subject, or sender name

### Analytics Dashboard

- Category-wise campaign statistics
- Real-time performance metrics
- Engagement tracking
- Delivery and bounce rates

---

## 🔄 Syncing Data

### Manual Sync

1. Login to the dashboard
2. Click the **"Sync Data"** button in the top navigation
3. Wait for sync to complete

This downloads the latest campaigns and subscribers from your Sendy database.

### Automatic Sync

Set up a cron job to sync automatically:

```bash
# Sync every hour
0 * * * * curl -X POST http://localhost:3000/api/sync
```

---

## 💡 Why This Dashboard?

### ⚡ Super Fast

Unlike standard Sendy which queries heavy log tables on every page load, this dashboard uses a local SQLite cache. Pages load **instantly**.

### 🛡️ Secure

Built-in authentication protects your sensitive mailing list data. Role-based access control ready for team use.

### 📊 Modern UI

A premium, responsive interface with:

- Color-coded category badges
- Real-time metrics
- Interactive charts
- Mobile-friendly design

### 🔄 Resilient

Your dashboard works even if the remote Sendy server is temporarily slow or under load.

### 🎯 Smart Categorization

Automatically categorizes campaigns based on keywords:

- **Course keywords**: course, training, learn, tutorial, lesson, class, certification, program
- **Workshop keywords**: workshop, seminar, webinar, session, event, meetup, conference

---

## 📱 Using the Dashboard

### Dashboard Page

- View overall statistics
- See category breakdown (Courses, Workshops, General)
- Monitor recent activity
- Track performance metrics

### Campaigns Page

- Browse all campaigns
- Filter by category or status
- Search by title, subject, or sender
- View detailed metrics for each campaign

### Campaign Detail Page

- Complete sender information
- Campaign category and topic
- Detailed analytics (opens, clicks, bounces)
- Timeline of campaign events

### Subscribers Page

- View all subscribers
- Filter by status
- Track engagement
- Export data

---

## 🔧 Advanced Configuration

### Change Admin Password

1. Run Prisma Studio:

   ```bash
   npx prisma studio
   ```

2. Navigate to the `User` table
3. Find the admin user
4. Update the password (use bcrypt hash)
5. Save changes

### Add Custom Categories

Edit the categorization logic in:
`src/lib/sync-service.ts`

Add your custom keywords to the `categorizeCampaign` function.

### Customize Sync Frequency

Edit the sync interval in your cron job or application scheduler.

---

## 🐳 Docker Deployment

### Using Docker Compose

1. Create `.env` file with your configuration
2. Run:
   ```bash
   docker-compose up -d
   ```

### Using Docker Only

```bash
docker build -t sendy-dashboard .
docker run -d -p 3000:3000 --env-file .env sendy-dashboard
```

---

## 📚 Documentation

- **[DEPLOYMENT.md](./DEPLOYMENT.md)**: Complete production deployment guide
- **[walkthrough.md](./walkthrough.md)**: Feature walkthrough and implementation details

---

## 🆘 Troubleshooting

### "There was a problem with the server configuration"

**Solution**: Verify your `.env` file has correct `AUTH_SECRET` and `NEXTAUTH_URL`

### Database Connection Fails

**Solution**:

1. Check Sendy database credentials in `.env`
2. Verify firewall allows MySQL connection
3. Test connection from your server to Sendy database

### Sync Button Doesn't Work

**Solution**:

1. Check Sendy database credentials
2. Verify network connectivity
3. Check browser console for errors
4. Review API logs

### Build Errors

**Solution**:

```bash
rm -rf .next node_modules
npm install
npm run build
```

---

## 🔐 Security Best Practices

- ✅ Change default admin password immediately
- ✅ Use strong, random AUTH_SECRET
- ✅ Enable HTTPS in production
- ✅ Keep dependencies updated
- ✅ Regular database backups
- ✅ Monitor access logs

---

## 📈 Performance Tips

- Sync data during off-peak hours
- Use database indexes for large datasets
- Enable caching in production
- Monitor application performance
- Regular database maintenance

---

## 🎉 You're All Set!

Your Sendy Dashboard is now ready to use. Login and start tracking your email campaigns with enhanced sender information and intelligent categorization!

**Need help?** Check the [DEPLOYMENT.md](./DEPLOYMENT.md) guide for detailed instructions.
