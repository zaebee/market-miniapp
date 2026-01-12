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

  // Validate required fields for article creation
  if (ctx.request.method === 'POST') {
    const requiredFields = ['title', 'content'];
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

  // Validate title length
  if (data.title && !validators.isLength(data.title, 1, 300)) {
    ctx.throw(400, 'Title must be between 1 and 300 characters.');
  }

  // Validate content length
  if (data.content && !validators.isLength(data.content, 1, 50000)) {
    ctx.throw(400, 'Content must be between 1 and 50000 characters.');
  }

  // Validate description length (if provided)
  if (data.description && !validators.isLength(data.description, 0, 1000)) {
    ctx.throw(400, 'Description must not exceed 1000 characters.');
  }

  // Validate slug format (if provided) - must be URL-safe
  if (data.slug) {
    if (!validators.isLength(data.slug, 1, 200)) {
      ctx.throw(400, 'Slug must be between 1 and 200 characters.');
    }
    // Only allow lowercase letters, numbers, and hyphens
    if (!/^[a-z0-9-]+$/.test(data.slug)) {
      ctx.throw(400, 'Slug must contain only lowercase letters, numbers, and hyphens.');
    }
  }

  // Validate author relation (if provided)
  if (data.author !== undefined && data.author !== null) {
    if (typeof data.author === 'object' && data.author.id) {
      if (!validators.isPositiveInt(data.author.id)) {
        ctx.throw(400, 'Invalid author ID.');
      }
    } else if (!validators.isPositiveInt(data.author)) {
      ctx.throw(400, 'Invalid author ID.');
    }
  }

  // Validate category relation (if provided)
  if (data.category !== undefined && data.category !== null) {
    if (typeof data.category === 'object' && data.category.id) {
      if (!validators.isPositiveInt(data.category.id)) {
        ctx.throw(400, 'Invalid category ID.');
      }
    } else if (!validators.isPositiveInt(data.category)) {
      ctx.throw(400, 'Invalid category ID.');
    }
  }

  await next();
};
