import request from 'supertest';
import { setupStrapi, cleanupStrapi } from '../helpers/strapi';

describe('Strapi Application', () => {
  beforeAll(async () => {
    await setupStrapi();
  }, 60000);

  afterAll(async () => {
    await cleanupStrapi();
  });

  it('should define the strapi global', () => {
    expect(strapi).toBeDefined();
  });

  it('should return 204 for health check', async () => {
    await request(strapi.server.httpServer)
      .get('/_health')
      .expect(204);
  });

  describe('Content Type Endpoints', () => {
    const collectionTypes = ['articles', 'authors', 'categories', 'apartments', 'agents', 'cities'];
    const singleTypes = ['about', 'global'];

    collectionTypes.forEach(type => {
      it(`should have endpoint for ${type}`, async () => {
        const res = await request(strapi.server.httpServer).get(`/api/${type}`);
        // Expecting != 404 (could be 200 or 403 depending on permissions)
        expect(res.status).not.toBe(404);
      });
    });

    singleTypes.forEach(type => {
      it(`should have endpoint for ${type}`, async () => {
        const res = await request(strapi.server.httpServer).get(`/api/${type}`);
        expect(res.status).not.toBe(404);
      });
    });
  });
});
