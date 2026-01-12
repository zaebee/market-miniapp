import type { Context, Next } from 'koa';
import { validators } from '../../../middlewares/validation';

export default async (ctx: Context, next: Next) => {
  const { request } = ctx;
  const { body } = request;

  // Only validate on create and update
  if (ctx.request.method !== 'POST' && ctx.request.method !== 'PUT') {
    return await next();
  }

  const data = body?.data || body;

  // Validate required fields for agent creation
  if (ctx.request.method === 'POST') {
    const requiredFields = ['name', 'email', 'phone'];
    const missing: string[] = [];

    for (const field of requiredFields) {
      if (!validators.isRequired(data[field])) {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      ctx.throw(400, `Missing required fields: ${missing.join(', ')}`);
    }
  }

  // Validate name length
  if (data.name && !validators.isLength(data.name, 1, 200)) {
    ctx.throw(400, 'Name must be between 1 and 200 characters.');
  }

  // Validate email format
  if (data.email) {
    if (!validators.isEmail(data.email)) {
      ctx.throw(400, 'Invalid email format.');
    }
    if (!validators.isLength(data.email, 1, 255)) {
      ctx.throw(400, 'Email must not exceed 255 characters.');
    }
  }

  // Validate phone format
  if (data.phone) {
    // Basic phone validation (can be customized based on region requirements)
    if (!validators.isLength(data.phone, 1, 50)) {
      ctx.throw(400, 'Phone must be between 1 and 50 characters.');
    }
    // Check for basic phone format (digits, spaces, dashes, parentheses, plus)
    if (!/^[0-9\s\-\(\)\+]+$/.test(data.phone)) {
      ctx.throw(400, 'Phone contains invalid characters.');
    }
  }

  // Validate bio length (if provided)
  if (data.bio && !validators.isLength(data.bio, 0, 2000)) {
    ctx.throw(400, 'Bio must not exceed 2000 characters.');
  }

  await next();
};
