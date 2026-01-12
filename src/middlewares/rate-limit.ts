import ratelimit from 'koa-ratelimit';

// The database map should be created once in the module scope,
// not inside the middleware factory function.
const db = new Map();

export default (config: any) => {
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