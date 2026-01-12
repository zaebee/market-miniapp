import type { Context, Next } from 'koa';

// Default export for Strapi middleware registration
export default (config: any = {}, { strapi }: any) => {
  const middleware = config.middleware;

  if (middleware === 'queryComplexityLimit') {
    return queryComplexityLimit({
      maxDepth: config.maxDepth,
      maxKeys: config.maxKeys,
    });
  }

  if (middleware === 'arrayLengthLimit') {
    return arrayLengthLimit(config.maxLength);
  }

  // Default to request size limits
  return requestSizeLimits(config);
};

// Request size limits middleware
export const requestSizeLimits = (options: {
  jsonLimit?: string;
  formLimit?: string;
  textLimit?: string;
  maxFileSize?: number;
} = {}) => {
  const {
    jsonLimit = '10mb',    // Default JSON body limit
    formLimit = '10mb',    // Default form body limit
    textLimit = '1mb',     // Default text body limit
    maxFileSize = 50 * 1024 * 1024, // Default max file size: 50MB
  } = options;

  return async (ctx: Context, next: Next) => {
    // Check content-length header if present
    const contentLength = ctx.request.headers['content-length'];

    if (contentLength) {
      const size = parseInt(contentLength, 10);

      // Validate that content-length is a valid number
      if (isNaN(size) || size < 0) {
        ctx.throw(400, 'Invalid Content-Length header');
      }

      // Determine appropriate limit based on content type
      const contentType = ctx.request.headers['content-type'] || '';
      let limit: number;

      if (contentType.includes('multipart/form-data')) {
        limit = maxFileSize;
      } else if (contentType.includes('application/json')) {
        limit = parseLimit(jsonLimit);
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        limit = parseLimit(formLimit);
      } else if (contentType.includes('text/')) {
        limit = parseLimit(textLimit);
      } else {
        // Default to JSON limit for unknown types
        limit = parseLimit(jsonLimit);
      }

      if (size > limit) {
        ctx.throw(413, `Request entity too large. Maximum size is ${formatBytes(limit)}.`);
      }
    }

    await next();
  };
};

// Parse limit string (e.g., '10mb', '1gb') to bytes
function parseLimit(limit: string): number {
  const units: { [key: string]: number } = {
    b: 1,
    kb: 1024,
    mb: 1024 * 1024,
    gb: 1024 * 1024 * 1024,
  };

  const match = limit.toLowerCase().match(/^(\d+(?:\.\d+)?)\s*([a-z]+)?$/);

  if (!match) {
    throw new Error(`Invalid limit format: ${limit}`);
  }

  const value = parseFloat(match[1]);
  const unit = match[2] || 'b';

  if (!units[unit]) {
    throw new Error(`Unknown unit: ${unit}`);
  }

  return Math.floor(value * units[unit]);
}

// Format bytes to human-readable string
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// Middleware to limit query string complexity
export const queryComplexityLimit = (options: {
  maxDepth?: number;
  maxKeys?: number;
} = {}) => {
  const {
    maxDepth = 5,      // Maximum nesting depth
    maxKeys = 50,      // Maximum number of keys
  } = options;

  return async (ctx: Context, next: Next) => {
    const query = ctx.request.query;

    // Count keys
    const keyCount = countKeys(query);
    if (keyCount > maxKeys) {
      ctx.throw(400, `Query string too complex. Maximum ${maxKeys} keys allowed.`);
    }

    // Check depth
    const depth = getDepth(query);
    if (depth > maxDepth) {
      ctx.throw(400, `Query string too deeply nested. Maximum depth is ${maxDepth}.`);
    }

    await next();
  };
};

// Count total keys in nested object
function countKeys(obj: any, count = 0): number {
  if (typeof obj !== 'object' || obj === null) {
    return count;
  }

  const keys = Object.keys(obj);
  count += keys.length;

  for (const key of keys) {
    count = countKeys(obj[key], count);
  }

  return count;
}

// Get maximum nesting depth of object
function getDepth(obj: any, currentDepth = 0): number {
  if (typeof obj !== 'object' || obj === null) {
    return currentDepth;
  }

  const depths = Object.values(obj).map(value => getDepth(value, currentDepth + 1));
  return Math.max(currentDepth, ...depths);
}

// Middleware to limit array sizes in request body
export const arrayLengthLimit = (maxLength = 1000) => {
  return async (ctx: Context, next: Next) => {
    const body = ctx.request.body;

    if (body) {
      checkArrayLengths(body, maxLength);
    }

    await next();
  };
};

// Recursively check array lengths in object
function checkArrayLengths(obj: any, maxLength: number, path = 'body'): void {
  if (Array.isArray(obj)) {
    if (obj.length > maxLength) {
      throw new Error(`Array at ${path} exceeds maximum length of ${maxLength}.`);
    }
    obj.forEach((item, index) => checkArrayLengths(item, maxLength, `${path}[${index}]`));
  } else if (typeof obj === 'object' && obj !== null) {
    for (const [key, value] of Object.entries(obj)) {
      checkArrayLengths(value, maxLength, `${path}.${key}`);
    }
  }
}
