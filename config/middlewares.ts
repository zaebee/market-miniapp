import { StrapiEnv } from '../src/types';

export default ({ env }: { env: StrapiEnv }) => [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'global::rate-limit',
    config: {
      max: env.int('RATELIMIT_MAX', 100),
      duration: env.int('RATELIMIT_DURATION', 60000),
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
