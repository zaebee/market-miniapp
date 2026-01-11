import { createStrapi, Core } from '@strapi/strapi';
import fs from 'fs';
import path from 'path';

let instance: Core.Strapi | undefined;

export async function setupStrapi() {
  if (!instance) {
    instance = await createStrapi({
      appDir: process.cwd(),
      distDir: path.join(process.cwd(), 'dist'), 
    });

    await instance.load();
    await instance.server.mount();
  }
  return instance;
}

export async function cleanupStrapi() {
  if (!instance) return;

  const dbSettings = instance.config.get('database.connection.connection') as any;

  await instance.destroy();
  
  // Cleanup test database file if using sqlite
  if (dbSettings && dbSettings.filename) {
    const dbPath = dbSettings.filename;
    if (fs.existsSync(dbPath)) {
      await fs.promises.unlink(dbPath);
    }
  }
  
  instance = undefined;
}
