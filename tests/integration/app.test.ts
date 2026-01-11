import request from 'supertest';
import { setupStrapi, cleanupStrapi } from '../helpers/strapi';
import { Core } from '@strapi/strapi';

describe('Strapi Application', () => {
  let strapiInstance: Core.Strapi;

  beforeAll(async () => {
    strapiInstance = (await setupStrapi()) as Core.Strapi;
  }, 60000);

  afterAll(async () => {
    await cleanupStrapi();
  });

  it('should define the strapi instance', () => {
    expect(strapiInstance).toBeDefined();
  });

  it('should return 204 for health check', async () => {
    await request(strapiInstance.server.httpServer)
      .get('/_health')
      .expect(204);
  });

  describe('Content Type Endpoints', () => {
    const collectionTypes = ['articles', 'authors', 'categories', 'apartments', 'agents', 'cities'];
    const singleTypes = ['about', 'global'];
    const allTypes = [...collectionTypes, ...singleTypes];

    allTypes.forEach(type => {
      it(`should have endpoint for ${type}`, async () => {
        const res = await request(strapiInstance.server.httpServer).get(`/api/${type}`);
        // Expecting != 404 (could be 200 or 403 depending on permissions)
        expect(res.status).not.toBe(404);
      });
    });
  });
});