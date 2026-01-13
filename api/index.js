const strapi = require('@strapi/strapi');
const path = require('path');

const app = strapi.createStrapi({ distDir: path.join(__dirname, '..', 'dist') });
module.exports = app.load().then(() => app.server.httpServer);
