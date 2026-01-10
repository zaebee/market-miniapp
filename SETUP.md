# Setup Guide

Complete setup instructions for Market MiniApp blog platform.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Installation](#installation)
3. [Environment Configuration](#environment-configuration)
4. [Database Setup](#database-setup)
5. [First Run](#first-run)
6. [Demo Data](#demo-data)
7. [Production Setup](#production-setup)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### Required

- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher (comes with Node.js)

### Optional

- **Git**: For version control
- **PostgreSQL** or **MySQL**: For production databases (SQLite used by default)

### Verify Installation

Check your installed versions:

```bash
node --version
npm --version
```

If Node.js is not installed, download it from: https://nodejs.org/

## Installation

### 1. Clone or Download Project

If using Git:

```bash
git clone <repository-url>
cd market-miniapp
```

Or download and extract the project archive.

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Strapi framework and plugins
- Database drivers
- React for admin panel
- TypeScript and build tools

**Installation time**: 2-5 minutes depending on your connection.

### 3. Verify Installation

```bash
npm list @strapi/strapi
```

Should output: `@strapi/strapi@5.33.2`

## Environment Configuration

### 1. Create Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

### 2. Generate Security Keys

Security keys must be unique random strings. Generate them using one of these methods:

#### Method 1: Using OpenSSL (Recommended)

```bash
# Generate all keys at once
echo "APP_KEYS=\"$(openssl rand -base64 32),$(openssl rand -base64 32)\"" >> .env
echo "API_TOKEN_SALT=$(openssl rand -base64 32)" >> .env
echo "ADMIN_JWT_SECRET=$(openssl rand -base64 32)" >> .env
echo "TRANSFER_TOKEN_SALT=$(openssl rand -base64 32)" >> .env
echo "JWT_SECRET=$(openssl rand -base64 32)" >> .env
echo "ENCRYPTION_KEY=$(openssl rand -base64 32)" >> .env
```

#### Method 2: Using Node.js

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Run this command 6 times and update each key in `.env`.

#### Method 3: Manual Generation

Use an online secure password generator to create 6 random strings (32+ characters each).

**Important**: Never use the default placeholder values in production!

### 3. Configure Basic Settings

Edit `.env` to set your preferences:

```env
# Server Configuration
HOST=0.0.0.0
PORT=1337

# Security Keys (replace with generated values)
APP_KEYS="your-generated-key-1,your-generated-key-2"
API_TOKEN_SALT=your-generated-salt
ADMIN_JWT_SECRET=your-generated-secret
TRANSFER_TOKEN_SALT=your-generated-salt
JWT_SECRET=your-generated-secret
ENCRYPTION_KEY=your-generated-key

# Database (optional, defaults to SQLite)
# DATABASE_CLIENT=sqlite
# DATABASE_FILENAME=.tmp/data.db

# Node Environment
NODE_ENV=development
```

### 4. Verify Configuration

```bash
# Check if .env file exists and has content
cat .env
```

## Database Setup

Market MiniApp supports three database options:

### Option 1: SQLite (Default)

No additional setup needed! SQLite works out of the box for development.

**Pros:**
- Zero configuration
- No separate database server needed
- Perfect for development and testing

**Cons:**
- Not recommended for production
- Limited concurrent connections
- No network access

**Location**: `.tmp/data.db` (created automatically)

### Option 2: PostgreSQL (Recommended for Production)

#### Install PostgreSQL

**macOS:**
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Windows:**
Download from: https://www.postgresql.org/download/windows/

#### Create Database

```bash
# Access PostgreSQL
sudo -u postgres psql

# Create database and user
CREATE DATABASE strapi;
CREATE USER strapi WITH ENCRYPTED PASSWORD 'strapi';
GRANT ALL PRIVILEGES ON DATABASE strapi TO strapi;
\q
```

#### Install PostgreSQL Driver

```bash
npm install pg
```

#### Configure Environment

Update `.env`:

```env
DATABASE_CLIENT=postgres
DATABASE_HOST=127.0.0.1
DATABASE_PORT=5432
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
DATABASE_SSL=false
```

For production with SSL:

```env
DATABASE_SSL=true
DATABASE_SSL_REJECT_UNAUTHORIZED=false
```

### Option 3: MySQL

#### Install MySQL

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Ubuntu/Debian:**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

**Windows:**
Download from: https://dev.mysql.com/downloads/installer/

#### Create Database

```bash
# Access MySQL
mysql -u root -p

# Create database and user
CREATE DATABASE strapi CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'strapi'@'localhost' IDENTIFIED BY 'strapi';
GRANT ALL PRIVILEGES ON strapi.* TO 'strapi'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Install MySQL Driver

```bash
npm install mysql2
```

#### Configure Environment

Update `.env`:

```env
DATABASE_CLIENT=mysql
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
```

## First Run

### 1. Start Development Server

```bash
npm run develop
```

You should see:

```
Building your admin UI with development configuration...
Admin UI built successfully

 Project information

┌────────────────────────────────────────────────────┐
│ Time               │ Thu Jan 10 2025 12:00:00      │
│ Launched in        │ 2345 ms                       │
│ Environment        │ development                   │
│ Process PID        │ 12345                         │
│ Version            │ 5.33.2                        │
│ Edition            │ Community                     │
│ Database           │ sqlite                        │
└────────────────────────────────────────────────────┘

 Actions available

One more thing...
Create your first administrator 💻 by going to the administration panel at:

┌─────────────────────────────┐
│ http://localhost:1337/admin │
└─────────────────────────────┘
```

### 2. Create Admin Account

1. Open your browser and navigate to: `http://localhost:1337/admin`
2. You'll see the admin registration form
3. Fill in the form:
   - First name
   - Last name
   - Email (will be your username)
   - Password (min 8 characters)
4. Click "Let's start"

### 3. Explore Admin Panel

After logging in, you'll see:

- **Content Manager**: Create and manage your content
- **Content-Type Builder**: Modify data structures
- **Media Library**: Manage uploaded files
- **Settings**: Configure your application

### 4. Verify API

The API is automatically available at: `http://localhost:1337/api`

Test it:

```bash
# Should return empty arrays (no content yet)
curl http://localhost:1337/api/articles
curl http://localhost:1337/api/authors
curl http://localhost:1337/api/categories
```

## Demo Data

Load sample content to explore the platform.

### 1. Run Seed Script

```bash
npm run seed:example
```

This will create:
- 3 sample authors
- 4 content categories
- 6 blog articles
- Global site settings
- About page content
- Demo images

### 2. Verify Seeded Data

```bash
# Check articles
curl http://localhost:1337/api/articles

# Check authors
curl http://localhost:1337/api/authors

# Check categories
curl http://localhost:1337/api/categories
```

### 3. View in Admin Panel

1. Go to Content Manager > Articles
2. You should see 6 sample articles
3. Click any article to view its content

### 4. Clear Demo Data (Optional)

To start fresh:

```bash
# Stop the server (Ctrl+C)

# Remove database (SQLite)
rm -rf .tmp/data.db

# Remove uploaded files
rm -rf public/uploads/*

# Restart server
npm run develop
```

You'll need to create a new admin account.

## Production Setup

### 1. Build Admin Panel

```bash
npm run build
```

This creates an optimized build in the `build/` directory.

### 2. Configure Environment

Update `.env` for production:

```env
NODE_ENV=production
HOST=0.0.0.0
PORT=1337

# Use PostgreSQL or MySQL (not SQLite)
DATABASE_CLIENT=postgres
DATABASE_HOST=your-db-host
DATABASE_PORT=5432
DATABASE_NAME=strapi_prod
DATABASE_USERNAME=strapi_prod
DATABASE_PASSWORD=strong-password
DATABASE_SSL=true

# Generate new secure keys
APP_KEYS="production-key-1,production-key-2"
API_TOKEN_SALT=production-salt
ADMIN_JWT_SECRET=production-secret
TRANSFER_TOKEN_SALT=production-salt
JWT_SECRET=production-secret
ENCRYPTION_KEY=production-key
```

### 3. Start Production Server

```bash
NODE_ENV=production npm start
```

### 4. Setup Process Manager

Use PM2 to keep the app running:

```bash
# Install PM2 globally
npm install -g pm2

# Start application
pm2 start npm --name "market-miniapp" -- start

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
```

### 5. Configure Reverse Proxy

Use Nginx as a reverse proxy:

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:1337;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    client_max_body_size 100M;
}
```

### 6. Setup SSL

Use Let's Encrypt for free SSL:

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com
```

### 7. Setup Backups

Backup your database and uploads regularly:

```bash
# PostgreSQL backup
pg_dump -U strapi strapi_prod > backup_$(date +%Y%m%d).sql

# Backup uploads
tar -czf uploads_$(date +%Y%m%d).tar.gz public/uploads/
```

## Troubleshooting

### Port Already in Use

**Error:** `Port 1337 is already in use`

**Solution:**
```bash
# Find process using port
lsof -i :1337

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=3000 npm run develop
```

### Database Connection Failed

**Error:** `Database connection failed`

**Solutions:**

1. Verify database is running:
   ```bash
   # PostgreSQL
   pg_isready

   # MySQL
   mysqladmin ping
   ```

2. Check credentials in `.env`
3. Ensure database exists
4. Check firewall settings

### Module Not Found

**Error:** `Cannot find module '@strapi/strapi'`

**Solution:**
```bash
# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Admin Panel Not Loading

**Issues:**
- Blank page
- Build errors
- 404 errors

**Solutions:**

1. Rebuild admin panel:
   ```bash
   npm run build -- --clean
   ```

2. Clear browser cache
3. Check browser console for errors
4. Verify `public/` directory has admin files

### Permission Errors

**Error:** `EACCES: permission denied`

**Solution:**
```bash
# Fix permissions
sudo chown -R $USER:$USER .
chmod -R 755 .
```

### Out of Memory

**Error:** `JavaScript heap out of memory`

**Solution:**
```bash
# Increase Node.js memory limit
NODE_OPTIONS="--max-old-space-size=4096" npm run develop
```

### Uploads Not Working

**Issues:**
- Files not uploading
- 413 Request Entity Too Large

**Solutions:**

1. Check `public/uploads/` permissions:
   ```bash
   chmod -R 755 public/uploads
   ```

2. Increase upload size in `config/middlewares.ts`:
   ```typescript
   {
     name: 'strapi::body',
     config: {
       formLimit: '256mb',
       jsonLimit: '256mb',
       textLimit: '256mb',
     },
   }
   ```

3. If using Nginx, increase client_max_body_size

### Database Migrations Failed

**Error:** Migration errors on startup

**Solutions:**

1. Check database connection
2. Ensure database user has sufficient permissions
3. For development, you can reset the database:
   ```bash
   # SQLite
   rm -rf .tmp/

   # PostgreSQL/MySQL
   DROP DATABASE strapi;
   CREATE DATABASE strapi;
   ```

## Getting Help

If you encounter issues:

1. Check Strapi documentation: https://docs.strapi.io
2. Search GitHub issues: https://github.com/strapi/strapi/issues
3. Ask on Discord: https://discord.strapi.io
4. Post on Forum: https://forum.strapi.io

## Next Steps

After successful setup:

1. Read the [README.md](README.md) for feature overview
2. Explore [API.md](API.md) for API documentation
3. Check [CONTENT-STRUCTURE.md](CONTENT-STRUCTURE.md) for content modeling
4. Start building your blog!
