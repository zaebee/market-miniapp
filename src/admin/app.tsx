import type { StrapiApp } from '@strapi/strapi/admin';
import { VibeKanbanWebCompanion } from 'vibe-kanban-web-companion';

export default {
  config: {
    locales: [],
  },
  bootstrap(app: StrapiApp) {
    // Register the Vibe Kanban Web Companion component to render at the app root
    app.registerHook('Admin/Root', () => VibeKanbanWebCompanion);
  },
};
