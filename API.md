# API Documentation

Market MiniApp provides a RESTful API for managing blog content. All endpoints follow Strapi's REST API conventions.

## Base URL

```
http://localhost:1337/api
```

## Authentication

Most GET endpoints are public. Create, update, and delete operations require authentication.

### Obtaining an API Token

1. Log in to the admin panel at `http://localhost:1337/admin`
2. Navigate to Settings > API Tokens
3. Create a new API token with appropriate permissions
4. Use the token in your requests:

```bash
curl -H "Authorization: Bearer YOUR_API_TOKEN" http://localhost:1337/api/articles
```

## Response Format

All responses follow this structure:

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "field1": "value1",
      "field2": "value2",
      "createdAt": "2025-01-10T00:00:00.000Z",
      "updatedAt": "2025-01-10T00:00:00.000Z",
      "publishedAt": "2025-01-10T00:00:00.000Z"
    }
  },
  "meta": {}
}
```

Collections return an array:

```json
{
  "data": [
    {
      "id": 1,
      "attributes": { ... }
    },
    {
      "id": 2,
      "attributes": { ... }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 2
    }
  }
}
```

## Articles

### List Articles

```http
GET /api/articles
```

**Query Parameters:**

- `sort` - Sort by field (e.g., `title:asc`, `createdAt:desc`)
- `filters` - Filter results (see Filtering section)
- `populate` - Include relations (e.g., `populate=*` for all)
- `pagination[page]` - Page number (default: 1)
- `pagination[pageSize]` - Items per page (default: 25)

**Example:**

```bash
# Get all articles with author and category
curl "http://localhost:1337/api/articles?populate[author]=*&populate[category]=*"

# Get articles sorted by creation date
curl "http://localhost:1337/api/articles?sort=createdAt:desc"

# Get paginated articles
curl "http://localhost:1337/api/articles?pagination[page]=1&pagination[pageSize]=10"
```

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Getting Started with Strapi",
        "description": "Learn how to build modern APIs with Strapi",
        "slug": "getting-started-with-strapi",
        "createdAt": "2025-01-10T00:00:00.000Z",
        "updatedAt": "2025-01-10T00:00:00.000Z",
        "publishedAt": "2025-01-10T00:00:00.000Z"
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

### Get Single Article

```http
GET /api/articles/:id
```

**Example:**

```bash
# Get article by ID with all relations
curl "http://localhost:1337/api/articles/1?populate=*"
```

**Response:**

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "title": "Getting Started with Strapi",
      "description": "Learn how to build modern APIs with Strapi",
      "slug": "getting-started-with-strapi",
      "cover": {
        "data": {
          "id": 1,
          "attributes": {
            "name": "cover.jpg",
            "url": "/uploads/cover_123.jpg",
            "mime": "image/jpeg"
          }
        }
      },
      "author": {
        "data": {
          "id": 1,
          "attributes": {
            "name": "John Doe",
            "email": "john@example.com"
          }
        }
      },
      "category": {
        "data": {
          "id": 1,
          "attributes": {
            "name": "Technology",
            "slug": "technology"
          }
        }
      },
      "blocks": [
        {
          "id": 1,
          "__component": "shared.rich-text",
          "body": "# Introduction\n\nThis is the article content..."
        }
      ]
    }
  }
}
```

### Create Article

```http
POST /api/articles
```

**Authentication:** Required

**Request Body:**

```json
{
  "data": {
    "title": "My New Article",
    "description": "Article description",
    "slug": "my-new-article",
    "author": 1,
    "category": 1,
    "blocks": [
      {
        "__component": "shared.rich-text",
        "body": "# Article Content"
      }
    ]
  }
}
```

**Example:**

```bash
curl -X POST http://localhost:1337/api/articles \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "My New Article",
      "description": "Article description",
      "slug": "my-new-article"
    }
  }'
```

### Update Article

```http
PUT /api/articles/:id
```

**Authentication:** Required

**Request Body:**

```json
{
  "data": {
    "title": "Updated Title",
    "description": "Updated description"
  }
}
```

**Example:**

```bash
curl -X PUT http://localhost:1337/api/articles/1 \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "Updated Title"
    }
  }'
```

### Delete Article

```http
DELETE /api/articles/:id
```

**Authentication:** Required

**Example:**

```bash
curl -X DELETE http://localhost:1337/api/articles/1 \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

## Authors

### List Authors

```http
GET /api/authors
```

**Example:**

```bash
# Get all authors with their articles
curl "http://localhost:1337/api/authors?populate[articles][fields][0]=title"
```

### Get Single Author

```http
GET /api/authors/:id
```

**Example:**

```bash
curl "http://localhost:1337/api/authors/1?populate=*"
```

**Response:**

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": {
        "data": {
          "id": 1,
          "attributes": {
            "url": "/uploads/avatar_123.jpg"
          }
        }
      },
      "articles": {
        "data": [
          {
            "id": 1,
            "attributes": {
              "title": "Getting Started with Strapi"
            }
          }
        ]
      }
    }
  }
}
```

### Create Author

```http
POST /api/authors
```

**Authentication:** Required

**Request Body:**

```json
{
  "data": {
    "name": "Jane Smith",
    "email": "jane@example.com"
  }
}
```

### Update Author

```http
PUT /api/authors/:id
```

**Authentication:** Required

### Delete Author

```http
DELETE /api/authors/:id
```

**Authentication:** Required

## Categories

### List Categories

```http
GET /api/categories
```

**Example:**

```bash
curl "http://localhost:1337/api/categories"
```

### Get Single Category

```http
GET /api/categories/:id
```

**Example:**

```bash
# Get category with all its articles
curl "http://localhost:1337/api/categories/1?populate[articles][populate]=*"
```

**Response:**

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "name": "Technology",
      "slug": "technology",
      "description": "Technology related articles",
      "articles": {
        "data": [
          {
            "id": 1,
            "attributes": {
              "title": "Getting Started with Strapi"
            }
          }
        ]
      }
    }
  }
}
```

### Create Category

```http
POST /api/categories
```

**Authentication:** Required

**Request Body:**

```json
{
  "data": {
    "name": "Programming",
    "slug": "programming",
    "description": "Programming tutorials and guides"
  }
}
```

### Update Category

```http
PUT /api/categories/:id
```

**Authentication:** Required

### Delete Category

```http
DELETE /api/categories/:id
```

**Authentication:** Required

## Global Settings

### Get Global Settings

```http
GET /api/global
```

**Example:**

```bash
curl "http://localhost:1337/api/global?populate=*"
```

**Response:**

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "siteName": "My Blog",
      "siteDescription": "A blog about technology and programming",
      "favicon": {
        "data": {
          "id": 1,
          "attributes": {
            "url": "/uploads/favicon.png"
          }
        }
      },
      "defaultSeo": {
        "id": 1,
        "metaTitle": "My Blog - Technology & Programming",
        "metaDescription": "Learn about technology and programming"
      }
    }
  }
}
```

### Update Global Settings

```http
PUT /api/global
```

**Authentication:** Required

**Request Body:**

```json
{
  "data": {
    "siteName": "Updated Blog Name",
    "siteDescription": "Updated description"
  }
}
```

## About Page

### Get About Page

```http
GET /api/about
```

**Example:**

```bash
curl "http://localhost:1337/api/about?populate=*"
```

**Response:**

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "title": "About Us",
      "blocks": [
        {
          "id": 1,
          "__component": "shared.rich-text",
          "body": "# About Our Blog\n\nWe are passionate about..."
        },
        {
          "id": 2,
          "__component": "shared.quote",
          "title": "Our Mission",
          "body": "To share knowledge and inspire learning"
        }
      ]
    }
  }
}
```

### Update About Page

```http
PUT /api/about
```

**Authentication:** Required

## Filtering

Filter results using the `filters` parameter.

### Basic Filters

```bash
# Articles with specific title
curl "http://localhost:1337/api/articles?filters[title][$eq]=Getting Started"

# Articles containing word in title
curl "http://localhost:1337/api/articles?filters[title][$contains]=Strapi"

# Articles by specific author
curl "http://localhost:1337/api/articles?filters[author][id][$eq]=1"

# Articles in specific category
curl "http://localhost:1337/api/articles?filters[category][name][$eq]=Technology"
```

### Filter Operators

- `$eq` - Equal
- `$ne` - Not equal
- `$lt` - Less than
- `$lte` - Less than or equal
- `$gt` - Greater than
- `$gte` - Greater than or equal
- `$in` - In array
- `$notIn` - Not in array
- `$contains` - Contains (case-sensitive)
- `$notContains` - Does not contain
- `$containsi` - Contains (case-insensitive)
- `$notContainsi` - Does not contain (case-insensitive)
- `$null` - Is null
- `$notNull` - Is not null
- `$between` - Between two values
- `$startsWith` - Starts with
- `$endsWith` - Ends with

### Complex Filters

```bash
# Multiple conditions (AND)
curl "http://localhost:1337/api/articles?\
filters[title][$contains]=Strapi&\
filters[category][name][$eq]=Technology"

# OR conditions
curl "http://localhost:1337/api/articles?\
filters[$or][0][title][$contains]=Strapi&\
filters[$or][1][title][$contains]=API"

# Date range
curl "http://localhost:1337/api/articles?\
filters[publishedAt][$gte]=2025-01-01&\
filters[publishedAt][$lte]=2025-12-31"
```

## Sorting

Sort results using the `sort` parameter.

```bash
# Sort by title ascending
curl "http://localhost:1337/api/articles?sort=title:asc"

# Sort by creation date descending
curl "http://localhost:1337/api/articles?sort=createdAt:desc"

# Multiple sort fields
curl "http://localhost:1337/api/articles?sort[0]=category.name:asc&sort[1]=title:asc"
```

## Pagination

Control pagination with `pagination` parameters.

```bash
# Page 2 with 10 items per page
curl "http://localhost:1337/api/articles?pagination[page]=2&pagination[pageSize]=10"

# Offset-based pagination
curl "http://localhost:1337/api/articles?pagination[start]=20&pagination[limit]=10"
```

## Population (Relations)

Include related data using the `populate` parameter.

```bash
# Populate all relations at first level
curl "http://localhost:1337/api/articles?populate=*"

# Populate specific relations
curl "http://localhost:1337/api/articles?populate[author]=*&populate[category]=*"

# Populate nested relations
curl "http://localhost:1337/api/articles?populate[author][populate][avatar]=*"

# Populate with specific fields
curl "http://localhost:1337/api/articles?\
populate[author][fields][0]=name&\
populate[author][fields][1]=email"

# Populate dynamic zones
curl "http://localhost:1337/api/articles?populate[blocks][populate]=*"
```

## Field Selection

Select specific fields to include in the response.

```bash
# Only return specific fields
curl "http://localhost:1337/api/articles?fields[0]=title&fields[1]=description"

# Combine with relations
curl "http://localhost:1337/api/articles?\
fields[0]=title&\
populate[author][fields][0]=name"
```

## File Upload

Upload files (images, videos, documents).

### Upload Single File

```bash
curl -X POST http://localhost:1337/api/upload \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -F "files=@/path/to/image.jpg"
```

**Response:**

```json
[
  {
    "id": 1,
    "name": "image.jpg",
    "url": "/uploads/image_123.jpg",
    "mime": "image/jpeg",
    "size": 123456,
    "width": 1920,
    "height": 1080
  }
]
```

### Upload and Link to Entry

```bash
# Upload and link to article cover
curl -X POST http://localhost:1337/api/upload \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -F "files=@/path/to/cover.jpg" \
  -F "ref=api::article.article" \
  -F "refId=1" \
  -F "field=cover"
```

## Error Responses

Errors follow this format:

```json
{
  "error": {
    "status": 400,
    "name": "ValidationError",
    "message": "Invalid request data",
    "details": {
      "errors": [
        {
          "path": ["title"],
          "message": "title is required"
        }
      ]
    }
  }
}
```

**Common Status Codes:**

- `200` - Success
- `201` - Created
- `204` - No Content (delete successful)
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Rate Limiting

The API does not enforce rate limiting by default. Configure rate limiting in production using middleware or reverse proxy.

## CORS

CORS is configured in `config/middlewares.ts`. Update settings for production:

```typescript
{
  name: 'strapi::cors',
  config: {
    origin: ['https://yourdomain.com'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
}
```

## Further Reading

- [Strapi REST API Documentation](https://docs.strapi.io/dev-docs/api/rest)
- [Query Parameters Guide](https://docs.strapi.io/dev-docs/api/rest/parameters)
- [Filters Reference](https://docs.strapi.io/dev-docs/api/rest/filters-locale-publication)
- [Population Guide](https://docs.strapi.io/dev-docs/api/rest/populate-select)
