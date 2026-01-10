# Market MiniApp

A blog content management platform built with Strapi v5.33.2. This headless CMS provides a complete blogging solution with article management, author profiles, content categorization, and SEO optimization.

## Overview

Market MiniApp is a TypeScript-based Strapi application that enables content creators to manage blog articles, authors, and categories through a modern admin interface while exposing a RESTful API for content consumption.

### Key Features

- **Article Management**: Rich content blocks and draft/publish workflows.
- **Author System**: Profiles with avatars and contact information.
- **Categorization**: Organized content taxonomy.
- **SEO Optimization**: Built-in metadata for articles and pages.
- **Dynamic Content**: Support for media, quotes, rich text, and sliders.

## Quick Start

1. **Install Dependencies**: `npm install`
2. **Configure**: `cp .env.example .env` and update required keys.
3. **Start**: `npm run develop`

For detailed installation and database configuration, see [SETUP.md](SETUP.md).

## Documentation

- [SETUP.md](SETUP.md) - Installation, environment setup, and production deployment.
- [API.md](API.md) - REST API endpoints, filtering, sorting, and authentication.
- [CONTENT-STRUCTURE.md](CONTENT-STRUCTURE.md) - Data models, components, and content workflows.

## API Usage Example

```bash
# Fetch all published articles
curl http://localhost:1337/api/articles
```

## Development

### Available Scripts

- `npm run develop` - Start development server.
- `npm run build` - Build admin panel.
- `npm run start` - Start production server.
- `npm run seed:example` - Populate database with demo data.

For more development guidelines, see the [Development](#development-1) section.

## License

This project is based on Strapi v5.33.2. See Strapi's license at https://github.com/strapi/strapi.
