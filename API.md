# API Documentation

Market MiniApp provides a RESTful API for managing both blog content and real estate listings. All endpoints follow Strapi's REST API conventions.

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

## Apartments

### List Apartments

```http
GET /api/apartments
```

**Query Parameters:**

- `sort` - Sort by field (e.g., `price:asc`, `createdAt:desc`)
- `filters` - Filter results (see Filtering section)
- `populate` - Include relations (e.g., `populate=*` for all)
- `pagination[page]` - Page number (default: 1)
- `pagination[pageSize]` - Items per page (default: 25)

**Example:**

```bash
# Get all published apartments with agent and city
curl "http://localhost:1337/api/apartments?populate[agent]=*&populate[city]=*"

# Get apartments sorted by price ascending
curl "http://localhost:1337/api/apartments?sort=price:asc"

# Get apartments in a specific city
curl "http://localhost:1337/api/apartments?filters[city][slug][$eq]=san-francisco&populate=*"

# Get apartments with 2+ bedrooms under $3000
curl "http://localhost:1337/api/apartments?filters[bedrooms][$gte]=2&filters[price][$lt]=3000&populate=*"
```

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "title": "Modern 2BR Apartment in Downtown",
        "description": "Beautiful modern apartment with city views",
        "slug": "modern-2br-apartment-in-downtown",
        "price": 2500.00,
        "address": "123 Main Street, Unit 4B",
        "bedrooms": 2,
        "bathrooms": 2,
        "area": 1200.50,
        "createdAt": "2025-01-10T00:00:00.000Z",
        "updatedAt": "2025-01-10T12:00:00.000Z",
        "publishedAt": "2025-01-10T10:00:00.000Z"
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

### Get Single Apartment

```http
GET /api/apartments/:id
```

**Example:**

```bash
# Get apartment by ID with all relations and images
curl "http://localhost:1337/api/apartments/1?populate=*"
```

**Response:**

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "title": "Modern 2BR Apartment in Downtown",
      "description": "Beautiful modern apartment with city views, hardwood floors, and stainless steel appliances",
      "slug": "modern-2br-apartment-in-downtown",
      "price": 2500.00,
      "address": "123 Main Street, Unit 4B",
      "bedrooms": 2,
      "bathrooms": 2,
      "area": 1200.50,
      "images": {
        "data": [
          {
            "id": 1,
            "attributes": {
              "name": "living_room.jpg",
              "url": "/uploads/apt_living_123.jpg",
              "mime": "image/jpeg",
              "width": 1920,
              "height": 1080
            }
          }
        ]
      },
      "agent": {
        "data": {
          "id": 1,
          "attributes": {
            "name": "Sarah Johnson",
            "email": "sarah@realestate.com",
            "phone": "+1-555-0123"
          }
        }
      },
      "city": {
        "data": {
          "id": 1,
          "attributes": {
            "name": "San Francisco",
            "slug": "san-francisco",
            "country": "United States"
          }
        }
      },
      "createdAt": "2025-01-10T00:00:00.000Z",
      "updatedAt": "2025-01-10T12:00:00.000Z",
      "publishedAt": "2025-01-10T10:00:00.000Z"
    }
  }
}
```

### Create Apartment

```http
POST /api/apartments
```

**Authentication:** Required

**Request Body:**

```json
{
  "data": {
    "title": "Luxury 3BR Condo",
    "description": "Spacious luxury condo with panoramic views",
    "price": 3500,
    "address": "456 Park Avenue",
    "bedrooms": 3,
    "bathrooms": 2,
    "area": 1800,
    "agent": 1,
    "city": 1
  }
}
```

**Example:**

```bash
curl -X POST http://localhost:1337/api/apartments \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "Luxury 3BR Condo",
      "description": "Spacious luxury condo with panoramic views",
      "price": 3500,
      "address": "456 Park Avenue",
      "bedrooms": 3,
      "bathrooms": 2,
      "area": 1800,
      "agent": 1,
      "city": 1
    }
  }'
```

### Update Apartment

```http
PUT /api/apartments/:id
```

**Authentication:** Required

**Request Body:**

```json
{
  "data": {
    "price": 2800,
    "description": "Updated description with new features"
  }
}
```

**Example:**

```bash
curl -X PUT http://localhost:1337/api/apartments/1 \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "price": 2800
    }
  }'
```

### Delete Apartment

```http
DELETE /api/apartments/:id
```

**Authentication:** Required

**Example:**

```bash
curl -X DELETE http://localhost:1337/api/apartments/1 \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

## Agents

### List Agents

```http
GET /api/agents
```

**Example:**

```bash
# Get all agents with their apartment listings
curl "http://localhost:1337/api/agents?populate[apartments][populate]=city"
```

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "Sarah Johnson",
        "email": "sarah@realestate.com",
        "phone": "+1-555-0123",
        "bio": "Licensed real estate agent with 10+ years of experience",
        "createdAt": "2025-01-10T00:00:00.000Z",
        "updatedAt": "2025-01-10T00:00:00.000Z"
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

### Get Single Agent

```http
GET /api/agents/:id
```

**Example:**

```bash
# Get agent with avatar and all apartments
curl "http://localhost:1337/api/agents/1?populate=*"
```

**Response:**

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "name": "Sarah Johnson",
      "email": "sarah@realestate.com",
      "phone": "+1-555-0123",
      "bio": "Licensed real estate agent with 10+ years of experience in residential properties",
      "avatar": {
        "data": {
          "id": 1,
          "attributes": {
            "url": "/uploads/agent_sarah_123.jpg",
            "name": "agent_sarah.jpg"
          }
        }
      },
      "apartments": {
        "data": [
          {
            "id": 1,
            "attributes": {
              "title": "Modern 2BR Apartment in Downtown",
              "price": 2500
            }
          },
          {
            "id": 2,
            "attributes": {
              "title": "Luxury 3BR Condo",
              "price": 3500
            }
          }
        ]
      },
      "createdAt": "2025-01-10T00:00:00.000Z",
      "updatedAt": "2025-01-10T00:00:00.000Z"
    }
  }
}
```

### Create Agent

```http
POST /api/agents
```

**Authentication:** Required

**Request Body:**

```json
{
  "data": {
    "name": "Michael Chen",
    "email": "michael@realestate.com",
    "phone": "+1-555-0456",
    "bio": "Specializing in urban properties and first-time homebuyers"
  }
}
```

**Example:**

```bash
curl -X POST http://localhost:1337/api/agents \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "name": "Michael Chen",
      "email": "michael@realestate.com",
      "phone": "+1-555-0456",
      "bio": "Specializing in urban properties and first-time homebuyers"
    }
  }'
```

### Update Agent

```http
PUT /api/agents/:id
```

**Authentication:** Required

**Request Body:**

```json
{
  "data": {
    "phone": "+1-555-0789",
    "bio": "Updated agent biography."
  }
}
```

**Example:**

```bash
curl -X PUT http://localhost:1337/api/agents/1 \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "phone": "+1-555-0789"
    }
  }'
```

### Delete Agent

```http
DELETE /api/agents/:id
```

**Authentication:** Required

**Example:**

```bash
curl -X DELETE http://localhost:1337/api/agents/1 \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

## Cities

### List Cities

```http
GET /api/cities
```

**Example:**

```bash
# Get all cities
curl "http://localhost:1337/api/cities"

# Get cities with apartment count
curl "http://localhost:1337/api/cities?populate[apartments][fields][0]=id"
```

**Response:**

```json
{
  "data": [
    {
      "id": 1,
      "attributes": {
        "name": "San Francisco",
        "slug": "san-francisco",
        "country": "United States",
        "region": "California",
        "description": "A vibrant city known for tech innovation and cultural diversity",
        "createdAt": "2025-01-10T00:00:00.000Z",
        "updatedAt": "2025-01-10T00:00:00.000Z"
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

### Get Single City

```http
GET /api/cities/:id
```

**Example:**

```bash
# Get city with all its apartments
curl "http://localhost:1337/api/cities/1?populate[apartments][populate]=agent"
```

**Response:**

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "name": "San Francisco",
      "slug": "san-francisco",
      "country": "United States",
      "region": "California",
      "description": "A vibrant city known for tech innovation, cultural diversity, and iconic landmarks",
      "image": {
        "data": {
          "id": 1,
          "attributes": {
            "url": "/uploads/sf_skyline_123.jpg",
            "name": "sf_skyline.jpg"
          }
        }
      },
      "apartments": {
        "data": [
          {
            "id": 1,
            "attributes": {
              "title": "Modern 2BR Apartment in Downtown",
              "price": 2500
            }
          },
          {
            "id": 3,
            "attributes": {
              "title": "Cozy Studio in Mission District",
              "price": 1800
            }
          }
        ]
      },
      "createdAt": "2025-01-10T00:00:00.000Z",
      "updatedAt": "2025-01-10T00:00:00.000Z"
    }
  }
}
```

### Create City

```http
POST /api/cities
```

**Authentication:** Required

**Request Body:**

```json
{
  "data": {
    "name": "New York",
    "slug": "new-york",
    "country": "United States",
    "region": "New York",
    "description": "The city that never sleeps"
  }
}
```

**Example:**

```bash
curl -X POST http://localhost:1337/api/cities \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "name": "New York",
      "slug": "new-york",
      "country": "United States",
      "region": "New York",
      "description": "The city that never sleeps"
    }
  }'
```

### Update City

```http
PUT /api/cities/:id
```

**Authentication:** Required

**Request Body:**

```json
{
  "data": {
    "description": "An updated description for the city."
  }
}
```

**Example:**

```bash
curl -X PUT http://localhost:1337/api/cities/1 \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "description": "An updated description for the city."
    }
  }'
```

### Delete City

```http
DELETE /api/cities/:id
```

**Authentication:** Required

**Example:**

```bash
curl -X DELETE http://localhost:1337/api/cities/1 \
  -H "Authorization: Bearer YOUR_API_TOKEN"
```

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

## Internationalization (i18n)

Apartments, Agents, and Cities support multiple languages (English and Russian). Strapi's i18n plugin manages translations.

### Default Locale

All content is created with a default locale (`en`). The API returns content in the default locale unless specified otherwise.

### Locale Query Parameter

Retrieve content in a specific locale using the `locale` parameter:

```bash
# Get apartments in Russian
curl "http://localhost:1337/api/apartments?locale=ru"

# Get specific apartment in Russian
curl "http://localhost:1337/api/apartments/1?locale=ru"

# Get agents in English (default)
curl "http://localhost:1337/api/agents?locale=en"

# Get cities in Russian with relations
curl "http://localhost:1337/api/cities?locale=ru&populate=*"
```

### Creating Localized Content

When creating content, specify the locale in the request:

```bash
# Create apartment in English (default)
curl -X POST http://localhost:1337/api/apartments \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "Modern Apartment",
      "description": "Beautiful modern apartment",
      "address": "123 Main St",
      "price": 2500,
      "bedrooms": 2,
      "locale": "en",
      "agent": 1,
      "city": 1
    }
  }'

# Create Russian translation
curl -X POST http://localhost:1337/api/apartments \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "Современная квартира",
      "description": "Красивая современная квартира",
      "address": "ул. Главная, 123",
      "price": 2500,
      "bedrooms": 2,
      "locale": "ru",
      "agent": 1,
      "city": 1
    }
  }'
```

### Localized Fields

**Agent:**
- `name` - Localized
- `bio` - Localized
- `email`, `phone`, `avatar` - Shared across locales

**City:**
- `name` - Localized
- `country` - Localized
- `region` - Localized
- `description` - Localized
- `image` - Shared across locales

**Apartment:**
- `title` - Localized
- `description` - Localized
- `address` - Localized
- `price`, `bedrooms`, `bathrooms`, `area`, `images` - Shared across locales
- Relations (`agent`, `city`) - Shared across locales

### Get All Localizations

Retrieve all localizations of an entry:

```bash
# Get apartment with all localizations
curl "http://localhost:1337/api/apartments/1?populate=localizations"
```

**Response:**

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "title": "Modern Apartment",
      "description": "Beautiful modern apartment",
      "locale": "en",
      "localizations": {
        "data": [
          {
            "id": 2,
            "attributes": {
              "title": "Современная квартира",
              "description": "Красивая современная квартира",
              "locale": "ru"
            }
          }
        ]
      }
    }
  }
}
```

### Update Localized Content

Update content in a specific locale:

```bash
# Update English version
curl -X PUT http://localhost:1337/api/apartments/1 \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "Updated Modern Apartment"
    }
  }'

# Update Russian version (use the localization ID)
curl -X PUT http://localhost:1337/api/apartments/2 \
  -H "Authorization: Bearer YOUR_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "Обновленная современная квартира"
    }
  }'
```

### Filter by Locale

Combine locale with other filters:

```bash
# Get Russian apartments in a specific city
curl "http://localhost:1337/api/apartments?locale=ru&filters[city][slug][$eq]=san-francisco"

# Get English agents who have apartments with 2+ bedrooms
curl "http://localhost:1337/api/agents?locale=en&filters[apartments][bedrooms][$gte]=2"
```

## Filtering

Filter results using the `filters` parameter.

### Basic Filters

**Blog Filters:**

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

**Real Estate Filters:**

```bash
# Apartments in a specific city
curl "http://localhost:1337/api/apartments?filters[city][slug][$eq]=san-francisco"

# Apartments by a specific agent
curl "http://localhost:1337/api/apartments?filters[agent][id][$eq]=1"

# Apartments with exact price
curl "http://localhost:1337/api/apartments?filters[price][$eq]=2500"

# Apartments with 2 bedrooms
curl "http://localhost:1337/api/apartments?filters[bedrooms][$eq]=2"

# Find agent by email
curl "http://localhost:1337/api/agents?filters[email][$eq]=sarah@realestate.com"

# Cities in a specific country
curl "http://localhost:1337/api/cities?filters[country][$eq]=United States"
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

**Blog Examples:**

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

**Real Estate Examples:**

```bash
# Price range with minimum bedrooms
curl "http://localhost:1337/api/apartments?\
filters[price][$gte]=2000&\
filters[price][$lte]=4000&\
filters[bedrooms][$gte]=2"

# Apartments in multiple cities (OR)
curl "http://localhost:1337/api/apartments?\
filters[$or][0][city][slug][$eq]=san-francisco&\
filters[$or][1][city][slug][$eq]=new-york"

# Large apartments (1500+ sqft) with 2+ bathrooms under $3500
curl "http://localhost:1337/api/apartments?\
filters[area][$gte]=1500&\
filters[bathrooms][$gte]=2&\
filters[price][$lt]=3500"

# Apartments by specific agent in a specific city
curl "http://localhost:1337/api/apartments?\
filters[agent][id][$eq]=1&\
filters[city][slug][$eq]=san-francisco&\
populate=*"

# Cities in specific region
curl "http://localhost:1337/api/cities?\
filters[country][$eq]=United States&\
filters[region][$eq]=California"
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
