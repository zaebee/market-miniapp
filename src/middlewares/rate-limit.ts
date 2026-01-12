import { Core } from '@strapi/strapi';
import ratelimit from 'koa-ratelimit';

export default (config: any, { strapi }: { strapi: Core.Strapi }) => {
  const db = new Map();

  return ratelimit({
    driver: 'memory',
    db: db,
    duration: 60000,
    errorMessage: 'Sometimes You Just Have to Slow Down.',
    id: (ctx) => ctx.ip,
    headers: {
      remaining: 'Rate-Limit-Remaining',
      reset: 'Rate-Limit-Reset',
      total: 'Rate-Limit-Total'
    },
    max: 100,
    disableHeader: false,
    ...config,
  });
};
