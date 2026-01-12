# Security Implementation Guide

This document provides guidance for developers working with the security features implemented in the Market MiniApp API.

## Overview

The following security features have been implemented:

1. **Rate Limiting**: Prevent abuse and DoS attacks
2. **Input Validation**: Validate all inputs to prevent injection attacks
3. **Input Sanitization**: Clean user inputs to prevent XSS
4. **Security Headers**: Comprehensive HTTP security headers
5. **CORS Configuration**: Restricted cross-origin access
6. **Request Size Limits**: Prevent resource exhaustion

## Using Custom Validators in API Endpoints

Custom validators have been created for the following content types:
- Apartment (`src/api/apartment/policies/validate-apartment.ts`)
- Agent (`src/api/agent/policies/validate-agent.ts`)
- Article (`src/api/article/policies/validate-article.ts`)

### Applying Validators to Routes

To apply validation to your API routes, update the route configuration:

**Example: Apply validation to apartment routes**

Edit `src/api/apartment/routes/apartment.ts`:

```typescript
import { factories } from '@strapi/strapi';

export default factories.createCoreRouter('api::apartment.apartment', {
  config: {
    create: {
      policies: ['api::apartment.validate-apartment'],
    },
    update: {
      policies: ['api::apartment.validate-apartment'],
    },
  },
});
```

This applies the `validate-apartment` policy to create and update operations.

### Creating Custom Validators

To create a new validator for other content types:

1. Create a new policy file in `src/api/{content-type}/policies/validate-{content-type}.ts`

2. Use this template:

```typescript
import type { Context, Next } from 'koa';
import { validators } from '../../../middlewares/validation';

export default async (ctx: Context, next: Next) => {
  const { request } = ctx;
  const { body } = request;

  // Only validate on create and update
  if (ctx.request.method !== 'POST' && ctx.request.method !== 'PUT') {
    return await next();
  }

  const data = body?.data || body;

  // Validate required fields
  if (ctx.request.method === 'POST') {
    const requiredFields = ['field1', 'field2'];
    const missing: string[] = [];

    for (const field of requiredFields) {
      if (!validators.isRequired(data[field])) {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      ctx.throw(400, `Missing required fields: ${missing.join(', ')}`);
    }
  }

  // Add your custom validation logic here
  // Example: Validate email
  if (data.email && !validators.isEmail(data.email)) {
    ctx.throw(400, 'Invalid email format.');
  }

  await next();
};
```

3. Register the policy in your routes configuration (as shown above)

## Available Validation Utilities

Import from `src/middlewares/validation.ts`:

### Validators

```typescript
import { validators } from '../middlewares/validation';

// Email validation
validators.isEmail('test@example.com'); // true

// URL validation
validators.isUrl('https://example.com'); // true

// Phone validation (international)
validators.isPhone('+1234567890'); // true

// Numeric validation
validators.isNumeric('123'); // true

// Positive integer validation
validators.isPositiveInt(42); // true

// Decimal validation
validators.isDecimal('123.45'); // true

// String length validation
validators.isLength('hello', 1, 10); // true

// Required field validation
validators.isRequired('value'); // true
```

### Sanitizers

```typescript
import { sanitizers } from '../middlewares/validation';

// Escape HTML
sanitizers.escapeHtml('<script>alert("xss")</script>');
// Returns: '&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;'

// Strip HTML tags
sanitizers.stripHtml('<p>Hello</p>');
// Returns: 'Hello'

// Trim whitespace
sanitizers.trim('  hello  ');
// Returns: 'hello'

// Normalize email
sanitizers.normalizeEmail('Test.User@Example.COM');
// Returns: 'testuser@example.com'

// Sanitize entire object
const sanitized = sanitizers.sanitizeObject({
  name: '  John  ',
  bio: '<script>alert("xss")</script>',
}, {
  escapeHtml: true,
  trim: true,
});
```

## Configuring Rate Limiting

Rate limiting is configured in `config/middlewares.ts`. Three tiers are available:

| Tier | Limit | Duration | Use Case |
|------|-------|----------|----------|
| `api` | 100 requests | 15 minutes | General API usage |
| `auth` | 5 requests | 15 minutes | Authentication endpoints |
| `contentCreation` | 30 requests | 15 minutes | Creating/updating content |

### Applying Rate Limits to Specific Routes

To apply stricter rate limits to specific routes, create a custom middleware:

```typescript
// src/api/{content-type}/middlewares/rate-limit.ts
import rateLimit from 'koa-ratelimit';

const db = new Map();

export default rateLimit({
  driver: 'memory',
  db,
  duration: 60000, // 1 minute
  max: 10, // 10 requests per minute
  id: (ctx) => ctx.ip,
});
```

Then apply it in your routes:

```typescript
export default factories.createCoreRouter('api::content-type.content-type', {
  config: {
    create: {
      middlewares: ['api::content-type.rate-limit'],
    },
  },
});
```

## CORS Configuration

CORS is configured in `src/middlewares/cors-config.ts` and controlled via environment variables.

### Development

In development, all localhost origins are automatically allowed.

### Production

Set the `ALLOWED_ORIGINS` environment variable:

```bash
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### Testing CORS

```bash
# Test with cURL
curl -H "Origin: http://localhost:3000" \
     -H "Access-Control-Request-Method: GET" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS http://localhost:1337/api/apartments
```

## Security Headers

Security headers are automatically applied to all responses. Key headers include:

- `Content-Security-Policy`: Prevents XSS and injection attacks
- `Strict-Transport-Security`: Enforces HTTPS
- `X-Frame-Options`: Prevents clickjacking
- `X-Content-Type-Options`: Prevents MIME sniffing
- `Permissions-Policy`: Restricts browser features

### Customizing Security Headers

Edit `src/middlewares/security-headers.ts` to modify the security headers configuration.

## Request Size Limits

Default limits are configured in `config/middlewares.ts`:

```typescript
{
  jsonLimit: '10mb',
  formLimit: '10mb',
  textLimit: '1mb',
  maxFileSize: 52428800, // 50MB
}
```

### Customizing Limits

Update the configuration in `config/middlewares.ts` or override for specific routes.

## Testing Security Features

Run the security tests:

```bash
npm run test -- tests/integration/security.test.ts
npm run test -- tests/unit/validation.test.ts
```

## Production Considerations

### 1. Redis for Rate Limiting

Replace in-memory rate limiting with Redis in production:

```typescript
// src/middlewares/rate-limit.ts
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

const rateLimitConfigs = {
  api: rateLimit({
    driver: 'redis',
    db: redis,
    // ... rest of config
  }),
};
```

### 2. Environment Variables

Ensure all security-related environment variables are set:

```bash
NODE_ENV=production
ALLOWED_ORIGINS=https://yourdomain.com
APP_KEYS=your-secure-keys
JWT_SECRET=your-secure-secret
```

### 3. HTTPS Only

Always use HTTPS in production. The `Strict-Transport-Security` header is already configured to enforce this.

### 4. Regular Updates

Keep dependencies updated:

```bash
npm audit
npm audit fix
```

## Common Issues

### Issue: Rate Limit Too Strict

**Solution**: Adjust the rate limit configuration in `src/middlewares/rate-limit.ts`:

```typescript
max: 200, // Increase from 100
duration: 15 * 60 * 1000, // Keep 15 minutes
```

### Issue: CORS Blocking Requests

**Solution**: Check that your origin is in `ALLOWED_ORIGINS` and that `NODE_ENV` is set correctly.

### Issue: Validation Too Strict

**Solution**: Update the specific validator in `src/api/{content-type}/policies/validate-{content-type}.ts`.

### Issue: Request Size Limit Exceeded

**Solution**: Increase limits in `config/middlewares.ts` for the `request-limits` middleware.

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Helmet.js Documentation](https://helmetjs.github.io/)
- [Koa Rate Limit](https://github.com/koajs/ratelimit)
- [Validator.js](https://github.com/validatorjs/validator.js)

## Support

For security issues, please refer to `SECURITY.md` for the vulnerability reporting process.
