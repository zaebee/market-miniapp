import cors from '@koa/cors';

// CORS configuration
export default (config: any, { strapi }: any) => {
  // Allowed origins - should be configured via environment variables
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:1337'];

  return cors({
    // Origin validation function
    origin: (ctx) => {
      const origin = ctx.request.header.origin;

      // Allow requests with no origin (e.g., mobile apps, Postman)
      if (!origin) {
        return '*';
      }

      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        return origin;
      }

      // In development, allow localhost with any port
      if (process.env.NODE_ENV === 'development' && origin.includes('localhost')) {
        return origin;
      }

      // For production, reject unauthorized origins
      if (process.env.NODE_ENV === 'production') {
        ctx.throw(403, `Origin ${origin} is not allowed by CORS policy`);
      }

      // Default: allow in non-production environments
      return origin;
    },

    // Allowed HTTP methods
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],

    // Allowed headers
    allowHeaders: [
      'Content-Type',
      'Authorization',
      'Accept',
      'Origin',
      'X-Requested-With',
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-RateLimit-Reset',
    ],

    // Exposed headers (visible to client-side JavaScript)
    exposeHeaders: [
      'X-RateLimit-Limit',
      'X-RateLimit-Remaining',
      'X-RateLimit-Reset',
      'Content-Length',
      'Content-Type',
    ],

    // Credentials support (cookies, authorization headers)
    credentials: true,

    // Preflight request cache duration (in seconds)
    maxAge: 600, // 10 minutes

    // Keep headers on error responses
    keepHeadersOnError: true,
  });
};
