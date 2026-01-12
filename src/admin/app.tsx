import type { StrapiApp } from '@strapi/strapi/admin';

export default {
  config: {
    locales: ['en', 'ru'],
  },
  bootstrap(_app: StrapiApp) {
    // Bootstrap function for admin panel customization
  },
};
