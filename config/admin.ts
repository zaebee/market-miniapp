import { StrapiEnv } from '../src/types';

export default ({ env }: { env: StrapiEnv }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET', 'temp-admin-jwt-secret-miniapp'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT', 'temp-api-token-salt-miniapp'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT', 'temp-transfer-token-salt-miniapp'),
    },
  },
  secrets: {
    encryptionKey: env('ENCRYPTION_KEY', 'temp-encryption-key-miniapp'),
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
  locales: ['en', 'ru', 'pl', 'vi', 'th'],
});
