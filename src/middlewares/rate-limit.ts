import rateLimit from 'koa-ratelimit';
import type { Context } from 'koa';

// In-memory store for rate limiting
// For production, use Redis store: https://github.com/koajs/ratelimit#stores
const db = new Map();

// Rate limiting middleware factory
export default (config: { tier?: 'api' | 'auth' | 'contentCreation' } = {}) => {
  const tier = config.tier || 'api';
  return rateLimitConfigs[tier];
};

// Rate limiting configurations
const rateLimitConfigs = {
  // General API rate limit: 100 requests per 15 minutes per IP
  api: rateLimit({
    driver: 'memory',
    db,
    duration: 15 * 60 * 1000, // 15 minutes in milliseconds
    errorMessage: 'Rate limit exceeded. Please try again later.',
    id: (ctx: Context) => ctx.ip,
    headers: {
      remaining: 'X-RateLimit-Remaining',
      reset: 'X-RateLimit-Reset',
      total: 'X-RateLimit-Limit',
    },
    max: 100,
    disableHeader: false,
    whitelist: (ctx: Context) => {
      // Whitelist local development IPs
      return ctx.ip === '127.0.0.1' || ctx.ip === '::1';
    },
    blacklist: (ctx: Context) => {
      // Block known bad IPs (can be extended with a database lookup)
      return false;
    },
  }),

  // Strict rate limit for authentication endpoints: 5 requests per 15 minutes per IP
  auth: rateLimit({
    driver: 'memory',
    db,
    duration: 15 * 60 * 1000, // 15 minutes
    errorMessage: 'Too many authentication attempts. Please try again later.',
    id: (ctx: Context) => ctx.ip,
    headers: {
      remaining: 'X-RateLimit-Remaining',
      reset: 'X-RateLimit-Reset',
      total: 'X-RateLimit-Limit',
    },
    max: 5,
    disableHeader: false,
  }),

  // Moderate rate limit for content creation: 30 requests per 15 minutes per IP
  contentCreation: rateLimit({
    driver: 'memory',
    db,
    duration: 15 * 60 * 1000, // 15 minutes
    errorMessage: 'Content creation rate limit exceeded. Please try again later.',
    id: (ctx: Context) => ctx.ip,
    headers: {
      remaining: 'X-RateLimit-Remaining',
      reset: 'X-RateLimit-Reset',
      total: 'X-RateLimit-Limit',
    },
    max: 30,
    disableHeader: false,
  }),
};
