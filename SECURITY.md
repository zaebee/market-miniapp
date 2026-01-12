# Security Policy

## Security Hardening Measures

This project implements several security measures to protect the application and its data.

### 1. Security Headers
We use `strapi::security` which includes [Helmet.js](https://helmetjs.github.io/) to set various HTTP headers to help protect the app from some well-known web vulnerabilities.

### 2. CORS Configuration
CORS is configured via `strapi::cors` to restrict which domains can access the API.

### 3. Rate Limiting (Planned)
Rate limiting is being implemented to prevent brute-force attacks and DDoS.

### 4. Input Validation
All incoming data is validated against the defined schemas.

## Reporting a Vulnerability

If you discover a security vulnerability within this project, please report it via an issue in this repository or contact the maintainers directly.
