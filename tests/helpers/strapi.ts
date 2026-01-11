import { createStrapi } from '@strapi/strapi';
import fs from 'fs';
import path from 'path';

let instance;

export async function setupStrapi() {
  if (!instance) {
    // Set test database to avoid overwriting development data
    process.env.DATABASE_CLIENT = 'sqlite';
    process.env.DATABASE_FILENAME = '.tmp/test.db';
    process.env.PORT = '1338'; // Use a different port for testing
    
    // Auth secrets
    process.env.APP_KEYS = 'testKey1,testKey2';
    process.env.API_TOKEN_SALT = 'testApiTokenSalt';
    process.env.ADMIN_JWT_SECRET = 'testAdminJwtSecret';
    process.env.TRANSFER_TOKEN_SALT = 'testTransferTokenSalt';
    process.env.JWT_SECRET = 'testJwtSecret';
    process.env.ENCRYPTION_KEY = 'testEncryptionKey123456789012345678901234'; // 24+ chars

    instance = await createStrapi({
      appDir: process.cwd(),
      distDir: process.cwd() + '/dist', 
    });

    await instance.load();
    await instance.server.mount();
  }
  return instance;
}

export async function cleanupStrapi() {
  if (!instance) return;

  const dbSettings = instance.config.get('database.connection.connection');

  // Close server
  await instance.server.httpServer.close();

  // Close database connection
  await instance.db.connection.destroy();
  
  // Cleanup test database file if using sqlite
  if (dbSettings && dbSettings.filename) {
    const dbPath = dbSettings.filename;
    if (fs.existsSync(dbPath)) {
      fs.unlinkSync(dbPath);
    }
  }
  
  instance = null;
}
