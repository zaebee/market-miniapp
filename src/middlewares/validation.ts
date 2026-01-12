import validator from 'validator';
import type { Context, Next } from 'koa';

// Default export for Strapi middleware registration
export default (config: any = {}, { strapi }: any) => {
  const middleware = config.middleware;

  if (middleware === 'validateQueryParams') {
    return validateQueryParams();
  }

  if (middleware === 'sanitizeBody') {
    return sanitizeBody();
  }

  if (middleware === 'validateRequiredFields') {
    return validateRequiredFields(config.fields || []);
  }

  if (middleware === 'validateEmailField') {
    return validateEmailField(config.fieldName);
  }

  if (middleware === 'validateNumericFields') {
    return validateNumericFields(config.fields || {});
  }

  // Default to sanitizeBody
  return sanitizeBody();
};

// Input sanitization utilities
export const sanitizers = {
  // Escape HTML to prevent XSS
  escapeHtml: (input: string): string => {
    if (typeof input !== 'string') return input;
    return validator.escape(input);
  },

  // Remove all HTML tags
  stripHtml: (input: string): string => {
    if (typeof input !== 'string') return input;
    return validator.stripLow(input.replace(/<[^>]*>/g, ''));
  },

  // Trim whitespace
  trim: (input: string): string => {
    if (typeof input !== 'string') return input;
    return validator.trim(input);
  },

  // Normalize email
  normalizeEmail: (email: string): string => {
    if (typeof email !== 'string') return email;
    const normalized = validator.normalizeEmail(email);
    return normalized || email;
  },

  // Sanitize all string fields in an object recursively
  sanitizeObject: (obj: any, options: { escapeHtml?: boolean; trim?: boolean } = {}): any => {
    const { escapeHtml = true, trim = true } = options;

    // Handle strings directly
    if (typeof obj === 'string') {
      let sanitizedValue = obj;
      if (trim) sanitizedValue = sanitizers.trim(sanitizedValue);
      if (escapeHtml) sanitizedValue = sanitizers.escapeHtml(sanitizedValue);
      return sanitizedValue;
    }

    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map(item => sanitizers.sanitizeObject(item, options));
    }

    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      if (typeof value === 'string') {
        let sanitizedValue = value;
        if (trim) sanitizedValue = sanitizers.trim(sanitizedValue);
        if (escapeHtml) sanitizedValue = sanitizers.escapeHtml(sanitizedValue);
        sanitized[key] = sanitizedValue;
      } else if (typeof value === 'object' && value !== null) {
        sanitized[key] = sanitizers.sanitizeObject(value, options);
      } else {
        sanitized[key] = value;
      }
    }
    return sanitized;
  },
};

// Validation utilities
export const validators = {
  // Validate email
  isEmail: (email: string): boolean => {
    return validator.isEmail(email);
  },

  // Validate URL
  isUrl: (url: string): boolean => {
    return validator.isURL(url);
  },

  // Validate phone number (international format)
  isPhone: (phone: string): boolean => {
    return validator.isMobilePhone(phone, 'any', { strictMode: false });
  },

  // Validate numeric value
  isNumeric: (value: string): boolean => {
    return validator.isNumeric(value);
  },

  // Validate positive integer
  isPositiveInt: (value: any): boolean => {
    return validator.isInt(String(value), { min: 0 });
  },

  // Validate decimal number
  isDecimal: (value: string): boolean => {
    return validator.isDecimal(value);
  },

  // Validate string length
  isLength: (str: string, min: number, max: number): boolean => {
    return validator.isLength(str, { min, max });
  },

  // Validate required field
  isRequired: (value: any): boolean => {
    if (value === null || value === undefined) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
  },
};

// Middleware to validate query parameters
export const validateQueryParams = () => {
  return async (ctx: Context, next: Next) => {
    const { query } = ctx;

    // Validate pagination parameters
    if (query.page && !validators.isPositiveInt(query.page)) {
      ctx.throw(400, 'Invalid page parameter. Must be a positive integer.');
    }

    if (query.pageSize && !validators.isPositiveInt(query.pageSize)) {
      ctx.throw(400, 'Invalid pageSize parameter. Must be a positive integer.');
    }

    // Limit pageSize to prevent excessive data retrieval
    if (query.pageSize && parseInt(String(query.pageSize)) > 100) {
      ctx.throw(400, 'pageSize parameter cannot exceed 100.');
    }

    // Validate sort parameter (must be alphanumeric with optional : and -)
    if (query.sort && !/^[a-zA-Z0-9_:,-]+$/.test(String(query.sort))) {
      ctx.throw(400, 'Invalid sort parameter format.');
    }

    await next();
  };
};

// Middleware to sanitize request body
export const sanitizeBody = () => {
  return async (ctx: Context, next: Next) => {
    if (ctx.request.body && typeof ctx.request.body === 'object') {
      ctx.request.body = sanitizers.sanitizeObject(ctx.request.body, {
        escapeHtml: true,
        trim: true,
      });
    }
    await next();
  };
};

// Middleware to validate required fields in request body
export const validateRequiredFields = (fields: string[]) => {
  return async (ctx: Context, next: Next) => {
    const body = ctx.request.body || {};
    const missing: string[] = [];

    for (const field of fields) {
      if (!validators.isRequired(body[field])) {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      ctx.throw(400, `Missing required fields: ${missing.join(', ')}`);
    }

    await next();
  };
};

// Middleware to validate email field in request body
export const validateEmailField = (fieldName = 'email') => {
  return async (ctx: Context, next: Next) => {
    const body = ctx.request.body || {};
    const email = body[fieldName];

    if (email && !validators.isEmail(email)) {
      ctx.throw(400, `Invalid ${fieldName} format.`);
    }

    await next();
  };
};

// Middleware to validate numeric fields
export const validateNumericFields = (fields: { [key: string]: { min?: number; max?: number } }) => {
  return async (ctx: Context, next: Next) => {
    const body = ctx.request.body || {};

    for (const [field, constraints] of Object.entries(fields)) {
      const value = body[field];

      if (value !== undefined && value !== null) {
        const numValue = Number(value);

        if (isNaN(numValue)) {
          ctx.throw(400, `Field ${field} must be a valid number.`);
        }

        if (constraints.min !== undefined && numValue < constraints.min) {
          ctx.throw(400, `Field ${field} must be at least ${constraints.min}.`);
        }

        if (constraints.max !== undefined && numValue > constraints.max) {
          ctx.throw(400, `Field ${field} must not exceed ${constraints.max}.`);
        }
      }
    }

    await next();
  };
};
