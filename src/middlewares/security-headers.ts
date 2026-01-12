import helmet from 'koa-helmet';
import type { Context, Next } from 'koa';

export default (config: any, { strapi }: any) => {
  // First create helmet middleware
  const helmetMiddleware = helmet({
    // Content Security Policy
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"], // Strapi admin requires inline scripts
        styleSrc: ["'self'", "'unsafe-inline'"], // Strapi admin requires inline styles
        imgSrc: ["'self'", 'data:', 'blob:', 'https:'],
        fontSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        mediaSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameSrc: ["'none'"],
        baseUri: ["'self'"],
        formAction: ["'self'"],
        frameAncestors: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },

    // DNS Prefetch Control - control browser DNS prefetching
    dnsPrefetchControl: {
      allow: false,
    },

    // Expect-CT header (deprecated but still useful for older browsers)
    expectCt: {
      enforce: true,
      maxAge: 86400, // 24 hours
    },

    // X-Frame-Options - prevent clickjacking
    frameguard: {
      action: 'deny',
    },

    // Hide X-Powered-By header
    hidePoweredBy: true,

    // HTTP Strict Transport Security (HSTS)
    hsts: {
      maxAge: 31536000, // 1 year in seconds
      includeSubDomains: true,
      preload: true,
    },

    // IE No Open - prevent IE from executing downloads in site's context
    ieNoOpen: true,

    // X-Content-Type-Options - prevent MIME type sniffing
    noSniff: true,

    // Referrer Policy
    referrerPolicy: {
      policy: 'strict-origin-when-cross-origin',
    },

    // X-XSS-Protection (legacy, CSP is preferred but this adds defense in depth)
    xssFilter: true,
  });

  // Return middleware function
  return async (ctx: Context, next: Next) => {
    // Apply helmet first
    await helmetMiddleware(ctx, async () => {
      // Then add custom security headers
      ctx.set('Permissions-Policy', [
        'geolocation=()',
        'microphone=()',
        'camera=()',
        'payment=()',
        'usb=()',
        'magnetometer=()',
        'gyroscope=()',
        'accelerometer=()',
      ].join(', '));

      ctx.set('Cross-Origin-Opener-Policy', 'same-origin');
      ctx.set('Cross-Origin-Resource-Policy', 'same-origin');
      ctx.set('Cross-Origin-Embedder-Policy', 'require-corp');
      ctx.set('X-Download-Options', 'noopen');
      ctx.set('X-Permitted-Cross-Domain-Policies', 'none');

      await next();
    });
  };
};
