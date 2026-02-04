# How to Connect Your Sendy Data

To see your real Sendy data (Campaigns, Subscribers, Analytics) in this dashboard, you need to connect it to your Sendy MySQL database.

## 1. Locate your Database Credentials

You can usually find these in your Sendy installation's `includes/config.php` file on your server. Look for:

```php
$dbHost = '...';
$dbUser = '...';
$dbPass = '...';
$dbName = '...';
```

## 2. Update Environment Variables

1.  Open the `.env` file in the root directory of this project.
2.  Find the **Database Connection** section.
3.  Fill in the values matching your Sendy database:

```ini
# .env file

# Sendy Database Connection
DB_HOST=127.0.0.1      # IP of your MySQL server (ensure remote access is allowed if not on same server)
DB_USER=your_db_user   # MySQL Username
DB_PASSWORD=your_pass  # MySQL Password
DB_NAME=sendy          # Database Name (usually 'sendy')
DB_PORT=3306           # Port (default 3306)
```

## 3. Restart the Application

After saving the `.env` file, you must restart the application for changes to take effect:

```bash
npm run dev
# or
npm start
```

## Troubleshooting

- **Empty Dashboard?** If the dashboard shows 0s, check the server logs (terminal) for "Sendy DB Connection Error".
- **Connection Refused?** If your Sendy database is on a different server (e.g., VPS), you might need to whitelist your IP or use an SSH tunnel.
- **Localhost?** If running locally and Sendy is on a live server, ensure you are using the live server's IP for `DB_HOST`, not 'localhost'.
