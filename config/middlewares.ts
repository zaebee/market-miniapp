export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'global::rate-limit',
    config: {
      max: 100,
      duration: 60000,
    },
  },
  'strapi::cors',
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
