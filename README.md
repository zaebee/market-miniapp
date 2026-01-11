# Market MiniApp

A dual-purpose content management platform built with Strapi v5.33.2. This headless CMS provides both a blogging solution with article management and a real estate marketplace platform with property listings, agent profiles, and location-based search.

## Overview

Market MiniApp is a TypeScript-based Strapi application that combines two primary features:

1. **Blog Platform**: Manage articles, authors, and categories through a modern admin interface
2. **Real Estate Marketplace**: List apartments, manage real estate agents, and organize properties by city

Both features expose RESTful APIs for content consumption and third-party integrations.

### Key Features

#### Blog Features
- **Article Management**: Rich content blocks and draft/publish workflows.
- **Author System**: Profiles with avatars and contact information.
- **Categorization**: Organized content taxonomy.
- **SEO Optimization**: Built-in metadata for articles and pages.
- **Dynamic Content**: Support for media, quotes, rich text, and sliders.

#### Real Estate Features
- **Apartment Listings**: Property management with pricing, location, images, and detailed specifications (bedrooms, bathrooms, area).
- **Agent Profiles**: Real estate agent management with contact information, bio, and portfolio tracking.
- **City Directory**: Geographic organization with country/region categorization.
- **Relationship Management**: Link apartments to agents and cities for structured data queries.
- **Draft/Publish Workflow**: Control apartment listing visibility with draft states.

## Quick Start

1. **Install Dependencies**: `npm install`
2. **Configure**: `cp .env.example .env` and update required keys.
3. **Start**: `npm run develop`

For detailed installation and database configuration, see [SETUP.md](SETUP.md).

## Documentation

- [SETUP.md](SETUP.md) - Installation, environment setup, and production deployment.
- [API.md](API.md) - REST API endpoints, filtering, sorting, and authentication.
- [CONTENT-STRUCTURE.md](CONTENT-STRUCTURE.md) - Data models, components, and content workflows.
- [DEVELOPMENT.md](DEVELOPMENT.md) - Backend customization, custom logic, and scripts.
- [AGENTS.md](AGENTS.md) - Beads agent workflow, development process, and quality gates.

## Resources

- [Strapi Documentation](https://docs.strapi.io) - Official Strapi guides.
- [Strapi API Reference](https://docs.strapi.io/dev-docs/api/rest) - Detailed REST API documentation.

## API Usage Examples

```bash
# Blog API
curl http://localhost:1337/api/articles

# Real Estate API
curl http://localhost:1337/api/apartments?populate=*
curl http://localhost:1337/api/agents
curl http://localhost:1337/api/cities
```

## Development

For available scripts and backend customization guidelines, see [DEVELOPMENT.md](DEVELOPMENT.md).

## License

This project is based on Strapi v5.33.2. See Strapi's license at https://github.com/strapi/strapi.
