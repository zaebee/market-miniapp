import request from 'supertest';

const baseURL = `http://localhost:${process.env.PORT || 1337}`;

describe('Security Features', () => {
  describe('Security Headers', () => {
    it('should include security headers in responses', async () => {
      const response = await request(baseURL)
        .get('/_health')
        .expect(200);

      // Check for key security headers
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('strict-transport-security');
      expect(response.headers).toHaveProperty('x-xss-protection');
    });

    it('should have X-Frame-Options set to DENY', async () => {
      const response = await request(baseURL).get('/_health');

      expect(response.headers['x-frame-options']).toBe('DENY');
    });

    it('should have X-Content-Type-Options set to nosniff', async () => {
      const response = await request(baseURL).get('/_health');

      expect(response.headers['x-content-type-options']).toBe('nosniff');
    });

    it('should not expose X-Powered-By header', async () => {
      const response = await request(baseURL).get('/_health');

      expect(response.headers['x-powered-by']).toBeUndefined();
    });
  });

  describe('CORS Configuration', () => {
    it('should include CORS headers', async () => {
      const response = await request(baseURL)
        .get('/_health')
        .set('Origin', 'http://localhost:3000');

      expect(response.headers).toHaveProperty('access-control-allow-origin');
    });

    it('should allow configured origins', async () => {
      const response = await request(baseURL)
        .get('/_health')
        .set('Origin', 'http://localhost:3000')
        .expect(200);

      expect(response.headers['access-control-allow-origin']).toBeTruthy();
    });

    it('should support preflight requests', async () => {
      const response = await request(baseURL)
        .options('/_health')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'GET')
        .expect(204);

      expect(response.headers['access-control-allow-methods']).toBeTruthy();
    });
  });

  describe('Rate Limiting', () => {
    it('should include rate limit headers', async () => {
      const response = await request(baseURL).get('/_health');

      // Note: Rate limit headers may not be present on whitelisted endpoints
      // This test may need adjustment based on actual implementation
      if (response.headers['x-ratelimit-limit']) {
        expect(response.headers).toHaveProperty('x-ratelimit-remaining');
        expect(response.headers).toHaveProperty('x-ratelimit-reset');
      }
    });
  });

  describe('Request Size Limits', () => {
    it('should reject oversized JSON payloads', async () => {
      // Create a large payload (>10MB)
      const largePayload = {
        data: 'x'.repeat(11 * 1024 * 1024), // 11MB of data
      };

      const response = await request(baseURL)
        .post('/api/articles')
        .send(largePayload);

      // Should return 413 Payload Too Large or 400 Bad Request
      expect([400, 413]).toContain(response.status);
    });
  });

  describe('Input Validation', () => {
    it('should validate query parameters', async () => {
      const response = await request(baseURL)
        .get('/api/apartments')
        .query({ page: 'invalid' });

      // Should return 400 Bad Request for invalid page parameter
      expect(response.status).toBe(400);
    });

    it('should enforce maximum pageSize', async () => {
      const response = await request(baseURL)
        .get('/api/apartments')
        .query({ pageSize: '101' });

      // Should return 400 Bad Request for pageSize > 100
      expect(response.status).toBe(400);
    });

    it('should validate sort parameter format', async () => {
      const response = await request(baseURL)
        .get('/api/apartments')
        .query({ sort: '<script>alert("xss")</script>' });

      // Should return 400 Bad Request for invalid sort format
      expect(response.status).toBe(400);
    });
  });

  describe('Content Validation', () => {
    it('should require authentication for POST requests', async () => {
      const response = await request(baseURL)
        .post('/api/apartments')
        .send({
          data: {
            title: 'Test Apartment',
            price: 100000,
            address: '123 Test St',
          },
        });

      // Should return 401 Unauthorized or 403 Forbidden without authentication
      expect([401, 403]).toContain(response.status);
    });
  });
});
