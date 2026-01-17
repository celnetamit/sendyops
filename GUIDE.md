# Sendy Dashboard Connection Guide

This dashboard has been upgraded to provide a **secure, high-performance** experience for visualizing your Sendy data.

## 🔒 Authentication

**The dashboard is now secure.**

- **Login URL**: `/login`
- **Default Admin User**:
  - **Email**: `admin@sendy.com`
  - **Password**: `admin`
    > **Important**: Change this password or user details in the `User` table (via `npx prisma studio`) as soon as possible.

## 🚀 How to Connect Data

Follow these steps to connect your live Sendy database:

1.  **Open the Project Folder**: Navigate to `sendy-dashboard`.
2.  **Edit `.env` File**: Create or edit the `.env` file with your Sendy MySQL credentials:

    ```env
    # Remote Sendy Database
    DB_HOST=your_sendy_host.com
    DB_USER=your_db_username
    DB_PASSWORD=your_db_password
    DB_NAME=sendy
    DB_PORT=3306

    # Auth Secret (Generate a random string: `openssl rand -base64 32`)
    AUTH_SECRET=changemetosomethingsecure
    ```

3.  **Start the App**: Run `npm run dev` or `npm start`.
4.  **Login**: Use the admin credentials above.
5.  **Sync Data**: Click the **Sync Data** button in the top-right corner of the dashboard.
    - This downloads the latest campaigns and subscribers to your local dashboard.
    - Browsing data is now **instant** because it reads from the local cache.

## 💡 Why This is Better

- **⚡ Super Fast**: Unlike standard Sendy which queries heavy log tables on every page load, this dashboard uses a local SQLite cache. Pages load instantly.
- **🛡️ Secure**: Built-in authentication protects your sensitive mailing list data.
- **📊 Modern UI**: A premium, responsive interface that works great on mobile and desktop.
- **🔄 Resilient**: Your dashboard works even if the remote Sendy server is temporarily slow or under load.
