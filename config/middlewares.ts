export default [
  'strapi::logger',
  'strapi::errors',

  // Custom security headers (replaces strapi::security for enhanced control)
  {
    name: 'custom::security-headers',
    resolve: '../src/middlewares/security-headers',
    config: {},
  },

  // Custom CORS configuration (replaces strapi::cors)
  {
    name: 'custom::cors',
    resolve: '../src/middlewares/cors-config',
    config: {},
  },

  // Rate limiting for general API endpoints
  {
    name: 'custom::rate-limit',
    resolve: '../src/middlewares/rate-limit',
    config: {
      tier: 'api', // Use 'api', 'auth', or 'contentCreation'
    },
  },

  // Request size and complexity limits
  {
    name: 'custom::request-limits',
    resolve: '../src/middlewares/request-limits',
    config: {
      jsonLimit: '10mb',
      formLimit: '10mb',
      textLimit: '1mb',
      maxFileSize: 52428800, // 50MB in bytes
    },
  },

  // Query parameter validation
  {
    name: 'custom::validate-query',
    resolve: '../src/middlewares/validation',
    config: {
      middleware: 'validateQueryParams',
    },
  },

  // Query complexity limits
  {
    name: 'custom::query-complexity',
    resolve: '../src/middlewares/request-limits',
    config: {
      middleware: 'queryComplexityLimit',
      maxDepth: 5,
      maxKeys: 50,
    },
  },

  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',

  // Sanitize request body after parsing
  {
    name: 'custom::sanitize-body',
    resolve: '../src/middlewares/validation',
    config: {
      middleware: 'sanitizeBody',
    },
  },

  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
