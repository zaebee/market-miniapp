import type { Context, Next } from 'koa';
import { validators, sanitizers } from '../../../middlewares/validation';

export default async (ctx: Context, next: Next) => {
  const { request } = ctx;
  const { body } = request;

  // Only validate on create and update
  if (ctx.request.method !== 'POST' && ctx.request.method !== 'PUT') {
    return await next();
  }

  const data = body?.data || body;

  // Validate required fields for apartment creation
  if (ctx.request.method === 'POST') {
    const requiredFields = ['title', 'price', 'address'];
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
  if (data.title && !validators.isLength(data.title, 1, 200)) {
    ctx.throw(400, 'Title must be between 1 and 200 characters.');
  }

  // Validate address length
  if (data.address && !validators.isLength(data.address, 1, 500)) {
    ctx.throw(400, 'Address must be between 1 and 500 characters.');
  }

  // Validate description length (if provided)
  if (data.description && !validators.isLength(data.description, 0, 5000)) {
    ctx.throw(400, 'Description must not exceed 5000 characters.');
  }

  // Validate price (must be positive number)
  if (data.price !== undefined && data.price !== null) {
    const price = Number(data.price);
    if (isNaN(price) || price < 0) {
      ctx.throw(400, 'Price must be a positive number.');
    }
    if (price > 1000000000) {
      ctx.throw(400, 'Price value is unreasonably high.');
    }
  }

  // Validate bedrooms (must be non-negative integer)
  if (data.bedrooms !== undefined && data.bedrooms !== null) {
    const bedrooms = Number(data.bedrooms);
    if (!Number.isInteger(bedrooms) || bedrooms < 0) {
      ctx.throw(400, 'Bedrooms must be a non-negative integer.');
    }
    if (bedrooms > 100) {
      ctx.throw(400, 'Bedrooms value is unreasonably high.');
    }
  }

  // Validate bathrooms (must be non-negative integer)
  if (data.bathrooms !== undefined && data.bathrooms !== null) {
    const bathrooms = Number(data.bathrooms);
    if (!Number.isInteger(bathrooms) || bathrooms < 0) {
      ctx.throw(400, 'Bathrooms must be a non-negative integer.');
    }
    if (bathrooms > 100) {
      ctx.throw(400, 'Bathrooms value is unreasonably high.');
    }
  }

  // Validate area (must be positive number)
  if (data.area !== undefined && data.area !== null) {
    const area = Number(data.area);
    if (isNaN(area) || area < 0) {
      ctx.throw(400, 'Area must be a positive number.');
    }
    if (area > 1000000) {
      ctx.throw(400, 'Area value is unreasonably high.');
    }
  }

  // Validate agent relation (must be a valid ID)
  if (data.agent !== undefined && data.agent !== null) {
    if (typeof data.agent === 'object' && data.agent.id) {
      // Relation object format
      if (!validators.isPositiveInt(data.agent.id)) {
        ctx.throw(400, 'Invalid agent ID.');
      }
    } else if (!validators.isPositiveInt(data.agent)) {
      // Direct ID format
      ctx.throw(400, 'Invalid agent ID.');
    }
  }

  // Validate city relation (must be a valid ID)
  if (data.city !== undefined && data.city !== null) {
    if (typeof data.city === 'object' && data.city.id) {
      // Relation object format
      if (!validators.isPositiveInt(data.city.id)) {
        ctx.throw(400, 'Invalid city ID.');
      }
    } else if (!validators.isPositiveInt(data.city)) {
      // Direct ID format
      ctx.throw(400, 'Invalid city ID.');
    }
  }

  await next();
};
