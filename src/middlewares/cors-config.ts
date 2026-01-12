import cors from '@koa/cors';

// CORS configuration
export default (config: any, { strapi }: any) => {
  // Allowed origins - should be configured via environment variables
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',')
    : ['http://localhost:3000', 'http://localhost:1337'];

  return cors({
    // Origin validation function
    origin: (ctx): string => {
      const origin = ctx.request.header.origin;

      // Allow requests with no origin only in development
      // Production APIs should require origin header for security
      if (!origin) {
        if (process.env.NODE_ENV === 'production') {
          throw new Error('Origin header required in production');
        }
        return '*'; // Allow in development for tools like Postman
      }

      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        return origin;
      }

      // In development, allow localhost/127.0.0.1 with any port (strict regex)
      if (process.env.NODE_ENV === 'development') {
        const localhostPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
        if (localhostPattern.test(origin)) {
          return origin;
        }
        // Fall through to rejection
      }

      // Reject all unauthorized origins by throwing an error
      throw new Error(`Origin ${origin} is not allowed by CORS policy`);
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
