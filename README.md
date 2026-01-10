# Market MiniApp

A blog content management platform built with Strapi v5.33.2. This headless CMS provides a complete blogging solution with article management, author profiles, content categorization, and SEO optimization.

## Overview

Market MiniApp is a TypeScript-based Strapi application that enables content creators to manage blog articles, authors, and categories through a modern admin interface while exposing a RESTful API for content consumption.

### Key Features

- **Article Management**: Create, edit, and publish blog articles with rich content blocks
- **Author System**: Manage author profiles with avatars and contact information
- **Categorization**: Organize content with categories
- **SEO Optimization**: Built-in SEO metadata for articles and pages
- **Dynamic Content Blocks**: Support for media, quotes, rich text, and image sliders
- **Draft Workflow**: Draft and publish workflow for content review
- **Media Management**: Handle images, videos, and files

## Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn
- SQLite (default) or PostgreSQL/MySQL

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy the example environment file and update the values:

```bash
cp .env.example .env
```

Update the following required environment variables in `.env`:

```env
APP_KEYS="your-app-key-1,your-app-key-2"
API_TOKEN_SALT=your-random-salt
ADMIN_JWT_SECRET=your-admin-secret
TRANSFER_TOKEN_SALT=your-transfer-salt
JWT_SECRET=your-jwt-secret
ENCRYPTION_KEY=your-encryption-key
```

**Important**: Generate strong random values for production use.

### 3. Start Development Server

```bash
npm run develop
```

The admin panel will be available at: `http://localhost:1337/admin`

### 4. Create Admin User

On first run, you'll be prompted to create an admin user through the web interface.

### 5. (Optional) Seed Demo Data

To populate the database with example content:

```bash
npm run seed:example
```

This will create sample articles, authors, categories, and upload demo images.

## Available Scripts

- `npm run develop` - Start development server with auto-reload
- `npm run build` - Build admin panel for production
- `npm run start` - Start production server
- `npm run seed:example` - Populate database with demo data
- `npm run console` - Start Strapi console
- `npm run deploy` - Deploy application
- `npm run upgrade` - Upgrade Strapi to latest version
- `npm run upgrade:dry` - Preview Strapi upgrade changes

## Content Types

### Collection Types (Multiple Entries)

#### Articles
Blog posts with rich content support.

**Fields:**
- `title` (string, required) - Article title
- `description` (text, required) - Article summary
- `slug` (uid, required) - URL-friendly identifier
- `cover` (media) - Cover image
- `author` (relation) - Link to author
- `category` (relation) - Link to category
- `blocks` (dynamic zone) - Content blocks (media, quotes, rich text, sliders)

**API Endpoints:**
- `GET /api/articles` - List all published articles
- `GET /api/articles/:id` - Get single article
- `POST /api/articles` - Create article (authenticated)
- `PUT /api/articles/:id` - Update article (authenticated)
- `DELETE /api/articles/:id` - Delete article (authenticated)

#### Authors
Content author profiles.

**Fields:**
- `name` (string, required) - Author name
- `email` (email) - Contact email
- `avatar` (media) - Profile picture
- `articles` (relation) - Associated articles

**API Endpoints:**
- `GET /api/authors` - List all authors
- `GET /api/authors/:id` - Get single author

#### Categories
Content organization tags.

**Fields:**
- `name` (string, required) - Category name
- `slug` (uid, required) - URL-friendly identifier
- `description` (text) - Category description
- `articles` (relation) - Associated articles

**API Endpoints:**
- `GET /api/categories` - List all categories
- `GET /api/categories/:id` - Get single category

### Single Types (One Entry)

#### Global Settings
Site-wide configuration.

**Fields:**
- `siteName` (string) - Site title
- `siteDescription` (text) - Site description
- `favicon` (media) - Site favicon
- `defaultSeo` (component) - Default SEO settings

**API Endpoint:**
- `GET /api/global` - Get global settings

#### About
About page content.

**Fields:**
- `title` (string) - Page title
- `blocks` (dynamic zone) - Content blocks

**API Endpoint:**
- `GET /api/about` - Get about page content

## Reusable Components

### Media
Upload and display media files (images, videos, files).

### Quote
Author quotes with attribution.

**Fields:**
- `title` (string) - Quote title
- `body` (text) - Quote text

### Rich Text
Markdown-enabled text content.

**Fields:**
- `body` (rich text) - Markdown content

### Slider
Image gallery/carousel.

**Fields:**
- `files` (media, multiple) - Gallery images

### SEO
Search engine optimization metadata.

**Fields:**
- `metaTitle` (string) - Page title for search engines
- `metaDescription` (text) - Page description
- `shareImage` (media) - Social sharing image

## Database Configuration

### Default (SQLite)

No additional configuration needed. Database is stored in `.tmp/data.db`.

### MySQL

Update `.env`:

```env
DATABASE_CLIENT=mysql
DATABASE_HOST=127.0.0.1
DATABASE_PORT=3306
DATABASE_NAME=strapi
DATABASE_USERNAME=strapi
DATABASE_PASSWORD=strapi
```

### PostgreSQL

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

## Project Structure

```
market-miniapp/
├── config/                     # Server & database configuration
│   ├── admin.ts               # Admin panel settings
│   ├── api.ts                 # API configuration
│   ├── database.ts            # Database settings
│   ├── server.ts              # Server configuration
│   ├── middlewares.ts         # Middleware stack
│   └── plugins.ts             # Plugin configuration
├── src/
│   ├── index.ts               # App lifecycle hooks
│   ├── api/                   # Content type APIs
│   │   ├── article/           # Article resource
│   │   ├── author/            # Author resource
│   │   ├── category/          # Category resource
│   │   ├── about/             # About page resource
│   │   └── global/            # Global settings resource
│   ├── components/            # Reusable content components
│   │   └── shared/            # Shared components
│   │       ├── media.json
│   │       ├── quote.json
│   │       ├── rich-text.json
│   │       ├── slider.json
│   │       └── seo.json
│   ├── admin/                 # Admin UI configuration
│   └── extensions/            # Custom extensions
├── scripts/
│   └── seed.js                # Database seeding script
├── data/
│   ├── data.json              # Demo content
│   └── uploads/               # Demo images
├── database/
│   └── migrations/            # Database migrations
├── public/
│   ├── uploads/               # User-uploaded files
│   └── robots.txt             # SEO configuration
├── .env                       # Environment variables (create from .env.example)
├── package.json
├── tsconfig.json
└── README.md
```

## API Usage

All API endpoints are available at `http://localhost:1337/api` by default.

### Example: Fetch All Articles

```bash
curl http://localhost:1337/api/articles
```

### Example: Fetch Article with Relations

```bash
curl http://localhost:1337/api/articles?populate=*
```

### Example: Filter Articles by Category

```bash
curl http://localhost:1337/api/articles?filters[category][name][$eq]=Technology
```

For complete API documentation, see the Strapi REST API documentation: https://docs.strapi.io/dev-docs/api/rest

## Development

### Admin Panel Customization

Admin UI configuration is located in:
- `src/admin/app.example.tsx` - Copy to `app.tsx` to customize
- `src/admin/vite.config.example.ts` - Copy to `vite.config.ts` for build config

### Creating Custom Content Types

Use the Strapi admin panel Content-Type Builder or create manually in `src/api/`.

### Adding Custom Logic

- **Controllers**: Handle HTTP requests in `src/api/[content-type]/controllers/`
- **Services**: Business logic in `src/api/[content-type]/services/`
- **Routes**: Custom routes in `src/api/[content-type]/routes/`

### Lifecycle Hooks

Application-level hooks are in `src/index.ts`:

```typescript
export default {
  register({ strapi }) {
    // Called during app registration
  },
  bootstrap({ strapi }) {
    // Called after app initialization
  },
};
```

## Deployment

### Production Build

```bash
npm run build
NODE_ENV=production npm run start
```

### Environment Variables

Ensure all security keys are set with strong random values in production:

```bash
APP_KEYS=$(openssl rand -base64 32),$(openssl rand -base64 32)
API_TOKEN_SALT=$(openssl rand -base64 32)
ADMIN_JWT_SECRET=$(openssl rand -base64 32)
TRANSFER_TOKEN_SALT=$(openssl rand -base64 32)
JWT_SECRET=$(openssl rand -base64 32)
ENCRYPTION_KEY=$(openssl rand -base64 32)
```

### Deployment Platforms

Strapi supports deployment to:
- Strapi Cloud
- AWS
- DigitalOcean
- Heroku
- Google Cloud
- Azure
- And more

See deployment documentation: https://docs.strapi.io/dev-docs/deployment

## Learn More

- [Strapi Documentation](https://docs.strapi.io) - Official documentation
- [Strapi Tutorials](https://strapi.io/tutorials) - Community tutorials
- [API Reference](https://docs.strapi.io/dev-docs/api/rest) - REST API documentation
- [Discord Community](https://discord.strapi.io) - Get help and connect

## License

This project is based on Strapi v5.33.2. See Strapi's license at https://github.com/strapi/strapi.
