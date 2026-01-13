const strapi = require('@strapi/strapi');

const app = strapi.createStrapi({ distDir: './dist' });
module.exports = app.load().then(() => app.server.httpServer);