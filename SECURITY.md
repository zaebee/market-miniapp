# Security Policy

This document outlines the security measures implemented in the Market MiniApp API and provides guidance for secure deployment and usage.

## Security Features

### 1. Rate Limiting

The API implements comprehensive rate limiting to prevent abuse and ensure fair resource allocation.

#### Rate Limit Tiers

| Tier | Endpoint Type | Limit | Duration | Use Case |
|------|--------------|-------|----------|----------|
| General API | All public endpoints | 100 requests | 15 minutes | Standard API usage |
| Authentication | `/auth/*` endpoints | 5 requests | 15 minutes | Login, registration |
| Content Creation | POST/PUT/DELETE | 30 requests | 15 minutes | Creating/updating content |

#### Rate Limit Headers

All responses include rate limit information:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1609459200
```

#### Whitelisting

Local development IPs (`127.0.0.1`, `::1`) are automatically whitelisted.

#### Production Deployment

For production environments, replace the in-memory rate limiting store with Redis:

```typescript
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

const rateLimitConfig = rateLimit({
  driver: 'redis',
  db: redis,
  // ... other config
});
```

### 2. Input Validation and Sanitization

All user inputs are validated and sanitized to prevent injection attacks and data corruption.

#### Field Validation

**Apartment Endpoints** (`/api/apartments`):
- `title`: Required, 1-200 characters
- `price`: Required, positive number, max 1,000,000,000
- `address`: Required, 1-500 characters
- `description`: Optional, max 5,000 characters
- `bedrooms`: Non-negative integer, max 100
- `bathrooms`: Non-negative integer, max 100
- `area`: Positive number, max 1,000,000

**Agent Endpoints** (`/api/agents`):
- `name`: Required, 1-200 characters
- `email`: Required, valid email format, max 255 characters
- `phone`: Required, 1-50 characters, valid phone format
- `bio`: Optional, max 2,000 characters

**Article Endpoints** (`/api/articles`):
- `title`: Required, 1-300 characters
- `content`: Required, 1-50,000 characters
- `description`: Optional, max 1,000 characters
- `slug`: Optional, 1-200 characters, lowercase alphanumeric with hyphens only

#### Automatic Sanitization

All string inputs are automatically:
- Trimmed of leading/trailing whitespace
- Escaped to prevent XSS attacks
- Validated against maximum lengths

#### Query Parameter Validation

Query parameters are validated to prevent abuse:
- `page`: Positive integer only
- `pageSize`: Positive integer, max 100
- `sort`: Alphanumeric characters with `:`, `,`, `-` only

### 3. Security Headers

The API implements comprehensive security headers using Helmet.js and custom middleware.

#### Implemented Headers

| Header | Purpose | Configuration |
|--------|---------|---------------|
| `Content-Security-Policy` | Prevents XSS, injection attacks | Restrictive default sources |
| `Strict-Transport-Security` | Enforces HTTPS | Max-age: 1 year, includeSubDomains |
| `X-Content-Type-Options` | Prevents MIME sniffing | nosniff |
| `X-Frame-Options` | Prevents clickjacking | DENY |
| `X-XSS-Protection` | Legacy XSS protection | Enabled |
| `Referrer-Policy` | Controls referrer information | strict-origin-when-cross-origin |
| `Permissions-Policy` | Disables unnecessary browser features | Restricts geolocation, camera, etc. |
| `Cross-Origin-Opener-Policy` | Isolates browsing context | same-origin |
| `Cross-Origin-Resource-Policy` | Prevents resource leakage | same-origin |
| `Cross-Origin-Embedder-Policy` | Controls cross-origin embedding | require-corp |

### 4. CORS Configuration

Cross-Origin Resource Sharing (CORS) is configured with security in mind.

#### Configuration

- **Allowed Origins**: Configured via `ALLOWED_ORIGINS` environment variable
- **Allowed Methods**: GET, POST, PUT, DELETE, PATCH, OPTIONS
- **Credentials**: Supported for authenticated requests
- **Preflight Cache**: 10 minutes

#### Environment Variables

```bash
# Development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:1337

# Production
ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

#### Development Mode

In development (`NODE_ENV=development`), all `localhost` origins are automatically allowed for convenience.

#### Production Mode

In production (`NODE_ENV=production`), only explicitly allowed origins are permitted. Unauthorized origins receive a 403 Forbidden response.

### 5. Request Size Limits

Request size limits prevent resource exhaustion attacks.

#### Default Limits

| Content Type | Limit | Purpose |
|--------------|-------|---------|
| JSON Body | 10 MB | API requests |
| Form Data | 10 MB | Form submissions |
| Text Body | 1 MB | Text content |
| File Uploads | 50 MB | Media uploads |

#### Query Complexity Limits

- **Maximum Keys**: 50 keys per query
- **Maximum Depth**: 5 levels of nesting
- **Array Length**: 1,000 items maximum

### 6. Authentication and Authorization

The API uses Strapi's built-in `users-permissions` plugin for authentication.

#### Authentication Methods

- **JWT Tokens**: For API access
- **Session-based**: For admin panel

#### Best Practices

1. **Token Storage**: Store JWT tokens securely (HttpOnly cookies recommended)
2. **Token Expiration**: Tokens expire after 30 days by default
3. **HTTPS Only**: Always use HTTPS in production
4. **Password Requirements**: Enforce strong password policies

#### API Authentication

```http
GET /api/apartments
Authorization: Bearer <your-jwt-token>
```

### 7. Database Security

#### SQL Injection Prevention

- All queries use Strapi's ORM (parameterized queries)
- Direct SQL queries are avoided
- Input validation prevents malicious payloads

#### Data Encryption

- Passwords are hashed using bcrypt
- Admin JWT secrets are stored in environment variables
- API tokens use secure random generation

## Security Best Practices

### For Developers

1. **Environment Variables**: Never commit `.env` files
2. **Secrets Management**: Use secure secret management (e.g., AWS Secrets Manager)
3. **Dependencies**: Regularly update dependencies with `npm audit`
4. **Code Review**: Review security-sensitive code changes
5. **Logging**: Log security events (failed auth, rate limits exceeded)

### For Deployment

1. **HTTPS Only**: Always use HTTPS in production
2. **Environment Separation**: Use different secrets for dev/staging/prod
3. **Firewall**: Restrict database access to application servers only
4. **Monitoring**: Set up alerts for suspicious activity
5. **Backups**: Regular database backups with encryption

### For API Consumers

1. **Token Security**: Store tokens securely, never in localStorage
2. **HTTPS**: Only make API requests over HTTPS
3. **Error Handling**: Don't expose sensitive information in errors
4. **Rate Limits**: Implement client-side throttling
5. **Input Validation**: Validate data client-side as well

## Vulnerability Reporting

If you discover a security vulnerability, please email security@example.com with:

1. Description of the vulnerability
2. Steps to reproduce
3. Potential impact
4. Suggested fix (if any)

**Do not** create public GitHub issues for security vulnerabilities.

## Security Checklist for Production

- [ ] Set `NODE_ENV=production`
- [ ] Configure `ALLOWED_ORIGINS` with production domains only
- [ ] Use Redis for rate limiting instead of in-memory store
- [ ] Set strong `APP_KEYS` for session encryption
- [ ] Configure HTTPS with valid SSL certificate
- [ ] Set up database connection with authentication
- [ ] Enable database connection encryption (SSL/TLS)
- [ ] Configure firewall rules
- [ ] Set up monitoring and alerting
- [ ] Regular security updates (`npm audit fix`)
- [ ] Implement backup strategy
- [ ] Configure log rotation and retention
- [ ] Set up intrusion detection (optional)
- [ ] Perform security audit/penetration testing

## Compliance

This API implements security controls aligned with:

- **OWASP Top 10**: Protection against common web vulnerabilities
- **GDPR**: Data protection and privacy (see Privacy Policy)
- **PCI DSS**: If handling payment data (additional measures required)

## Updates and Maintenance

Security features are continuously updated. Check this document regularly for changes.

Last Updated: 2026-01-12
