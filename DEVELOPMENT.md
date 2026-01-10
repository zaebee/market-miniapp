# Development Guide

This document provides instructions and best practices for developing and customizing the Market MiniApp blog platform.

## Available Scripts

In the project directory, you can run:

- `npm run develop` - Start development server with auto-reload.
- `npm run build` - Build admin panel for production.
- `npm run start` - Start production server.
- `npm run seed:example` - Populate database with demo data.
- `npm run console` - Start Strapi console.
- `npm run deploy` - Deploy application.
- `npm run upgrade` - Upgrade Strapi to latest version.
- `npm run upgrade:dry` - Preview Strapi upgrade changes.

## Backend Customization

### Admin Panel Customization

Admin UI configuration is located in:
- `src/admin/app.example.tsx` - Copy to `app.tsx` to customize.
- `src/admin/vite.config.example.ts` - Copy to `vite.config.ts` for build config.

### Creating Custom Content Types

Use the Strapi admin panel Content-Type Builder or create manually in `src/api/`.

### Adding Custom Logic

- **Controllers**: Handle HTTP requests in `src/api/[content-type]/controllers/`.
- **Services**: Business logic in `src/api/[content-type]/services/`.
- **Routes**: Custom routes in `src/api/[content-type]/routes/`.

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

## Further Resources

- [Strapi Documentation](https://docs.strapi.io) - Official documentation
- [Strapi Tutorials](https://strapi.io/tutorials) - Community tutorials
- [API Reference](https://docs.strapi.io/dev-docs/api/rest) - REST API documentation
- [Discord Community](https://discord.strapi.io) - Get help and connect
