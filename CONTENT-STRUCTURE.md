# Content Structure Documentation

This document provides detailed information about the content types, components, and data models in Market MiniApp.

## Table of Contents

1. [Content Types Overview](#content-types-overview)
2. [Collection Types](#collection-types)
3. [Single Types](#single-types)
4. [Shared Components](#shared-components)
5. [Relationships](#relationships)
6. [Content Workflows](#content-workflows)
7. [Best Practices](#best-practices)

## Content Types Overview

Market MiniApp has 8 content types split between blog and real estate features:

**Collection Types** (multiple entries):

Blog:
- Articles - Blog posts
- Authors - Content creators
- Categories - Content organization

Real Estate:
- Apartments - Property listings
- Agents - Real estate agents
- Cities - Location directory

**Single Types** (one entry only):
- Global - Site-wide settings
- About - About page content

## Collection Types

### Articles

Blog posts with rich content support and relationships to authors and categories.

#### Schema Location
`src/api/article/content-types/article/schema.json`

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | String | Yes | Article title (max 255 characters) |
| description | Text | Yes | Article summary/excerpt |
| slug | UID | Yes | URL-friendly identifier (auto-generated from title) |
| cover | Media | No | Cover image for the article |
| author | Relation | No | Reference to Author (many-to-one) |
| category | Relation | No | Reference to Category (many-to-one) |
| blocks | Dynamic Zone | No | Content blocks (media, quotes, rich text, sliders) |

#### Draft & Publish

Articles support the draft/publish workflow:
- **Draft**: Article is not publicly visible
- **Published**: Article is visible via API

#### Example JSON Structure

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "title": "Getting Started with Strapi",
      "description": "Learn how to build modern APIs with Strapi headless CMS",
      "slug": "getting-started-with-strapi",
      "cover": {
        "data": {
          "id": 1,
          "attributes": {
            "name": "cover.jpg",
            "url": "/uploads/cover_abc123.jpg",
            "width": 1920,
            "height": 1080
          }
        }
      },
      "author": {
        "data": {
          "id": 1,
          "attributes": {
            "name": "John Doe"
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
          "body": "# Introduction\n\nThis is the article content in markdown..."
        },
        {
          "id": 2,
          "__component": "shared.quote",
          "title": "Important Note",
          "body": "Strapi is the leading open-source headless CMS."
        },
        {
          "id": 3,
          "__component": "shared.media",
          "file": {
            "data": {
              "id": 2,
              "attributes": {
                "url": "/uploads/diagram.png"
              }
            }
          }
        }
      ],
      "createdAt": "2025-01-10T00:00:00.000Z",
      "updatedAt": "2025-01-10T12:00:00.000Z",
      "publishedAt": "2025-01-10T10:00:00.000Z"
    }
  }
}
```

#### Creating Articles

**Via Admin Panel:**
1. Navigate to Content Manager > Articles
2. Click "Create new entry"
3. Fill in title and description (required)
4. Slug is auto-generated from title
5. Add cover image
6. Select author and category
7. Add content blocks (optional)
8. Click "Save" (draft) or "Publish"

**Via API:**

```bash
curl -X POST http://localhost:1337/api/articles \
  -H "Authorization: Bearer YOUR_TOKEN" \
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

### Authors

Content creator profiles with relationships to their articles.

#### Schema Location
`src/api/author/content-types/author/schema.json`

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | Author's full name |
| email | Email | No | Contact email address |
| avatar | Media | No | Profile picture |
| articles | Relation | No | Reference to Articles (one-to-many) |

#### Example JSON Structure

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
            "url": "/uploads/avatar_john.jpg",
            "name": "avatar_john.jpg"
          }
        }
      },
      "articles": {
        "data": [
          {
            "id": 1,
            "attributes": {
              "title": "Getting Started with Strapi",
              "slug": "getting-started-with-strapi"
            }
          },
          {
            "id": 2,
            "attributes": {
              "title": "Advanced Strapi Techniques",
              "slug": "advanced-strapi-techniques"
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

#### Creating Authors

**Via Admin Panel:**
1. Navigate to Content Manager > Authors
2. Click "Create new entry"
3. Enter name (required)
4. Add email (optional)
5. Upload avatar image (optional)
6. Click "Save"

**Via API:**

```bash
curl -X POST http://localhost:1337/api/authors \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "name": "Jane Smith",
      "email": "jane@example.com"
    }
  }'
```

### Categories

Content organization taxonomy with relationships to articles.

#### Schema Location
`src/api/category/content-types/category/schema.json`

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | Category name |
| slug | UID | Yes | URL-friendly identifier (auto-generated from name) |
| description | Text | No | Category description |
| articles | Relation | No | Reference to Articles (one-to-many) |

#### Example JSON Structure

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "name": "Technology",
      "slug": "technology",
      "description": "Articles about technology, programming, and software development",
      "articles": {
        "data": [
          {
            "id": 1,
            "attributes": {
              "title": "Getting Started with Strapi"
            }
          },
          {
            "id": 3,
            "attributes": {
              "title": "Building Modern APIs"
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

#### Creating Categories

**Via Admin Panel:**
1. Navigate to Content Manager > Categories
2. Click "Create new entry"
3. Enter name (required)
4. Slug is auto-generated from name
5. Add description (optional)
6. Click "Save"

**Via API:**

```bash
curl -X POST http://localhost:1337/api/categories \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "name": "Programming",
      "slug": "programming",
      "description": "Programming tutorials and guides"
    }
  }'
```

### Apartments

Real estate property listings with detailed specifications and relationships to agents and cities.

#### Schema Location
`src/api/apartment/content-types/apartment/schema.json`

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | String | Yes | Property title/headline |
| description | Text | No | Detailed property description |
| slug | UID | No | URL-friendly identifier (auto-generated from title) |
| price | Decimal | Yes | Rental/sale price |
| address | String | Yes | Full street address |
| bedrooms | Integer | No | Number of bedrooms (min: 0) |
| bathrooms | Integer | No | Number of bathrooms (min: 0) |
| area | Decimal | No | Square footage/area (min: 0) |
| images | Media (multiple) | No | Property photos |
| agent | Relation | Yes | Reference to Agent (many-to-one) |
| city | Relation | Yes | Reference to City (many-to-one) |

#### Draft & Publish

Apartments support the draft/publish workflow:
- **Draft**: Listing is not publicly visible
- **Published**: Listing is visible via API

#### Example JSON Structure

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
              "url": "/uploads/apt_living_room.jpg",
              "width": 1920,
              "height": 1080
            }
          },
          {
            "id": 2,
            "attributes": {
              "url": "/uploads/apt_kitchen.jpg",
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
            "email": "sarah@realestate.com"
          }
        }
      },
      "city": {
        "data": {
          "id": 1,
          "attributes": {
            "name": "San Francisco",
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

#### Creating Apartments

**Via Admin Panel:**
1. Navigate to Content Manager > Apartments
2. Click "Create new entry"
3. Fill in title, price, and address (required)
4. Select agent and city (required)
5. Add description, bedrooms, bathrooms, area (optional)
6. Upload property images (optional)
7. Click "Save" (draft) or "Publish"

**Via API:**

```bash
curl -X POST http://localhost:1337/api/apartments \
  -H "Authorization: Bearer YOUR_TOKEN" \
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

### Agents

Real estate agent profiles with contact information and portfolio tracking.

#### Schema Location
`src/api/agent/content-types/agent/schema.json`

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | Agent's full name |
| email | Email | Yes | Contact email address (must be unique) |
| phone | String | Yes | Phone number |
| avatar | Media (image) | No | Profile photo |
| bio | Text | No | Agent biography |
| apartments | Relation | No | Reference to Apartments (one-to-many) |

#### Example JSON Structure

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
            "url": "/uploads/agent_sarah.jpg",
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

#### Creating Agents

**Via Admin Panel:**
1. Navigate to Content Manager > Agents
2. Click "Create new entry"
3. Enter name, email, and phone (required)
4. Add bio (optional)
5. Upload avatar image (optional)
6. Click "Save"

**Via API:**

```bash
curl -X POST http://localhost:1337/api/agents \
  -H "Authorization: Bearer YOUR_TOKEN" \
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

### Cities

Geographic location directory with country/region organization.

#### Schema Location
`src/api/city/content-types/city/schema.json`

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | String | Yes | City name |
| slug | UID | No | URL-friendly identifier (auto-generated from name) |
| country | String | Yes | Country name |
| region | String | No | State/province/region |
| description | Text | No | City description |
| image | Media (image) | No | City photo |
| apartments | Relation | No | Reference to Apartments (one-to-many) |

#### Example JSON Structure

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
            "url": "/uploads/sf_skyline.jpg",
            "name": "sf_skyline.jpg"
          }
        }
      },
      "apartments": {
        "data": [
          {
            "id": 1,
            "attributes": {
              "title": "Modern 2BR Apartment in Downtown"
            }
          },
          {
            "id": 3,
            "attributes": {
              "title": "Cozy Studio in Mission District"
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

#### Creating Cities

**Via Admin Panel:**
1. Navigate to Content Manager > Cities
2. Click "Create new entry"
3. Enter name and country (required)
4. Add slug (auto-generated), region, description (optional)
5. Upload city image (optional)
6. Click "Save"

**Via API:**

```bash
curl -X POST http://localhost:1337/api/cities \
  -H "Authorization: Bearer YOUR_TOKEN" \
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

## Single Types

### Global Settings

Site-wide configuration and default SEO settings. Only one entry exists.

#### Schema Location
`src/api/global/content-types/global/schema.json`

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| siteName | String | No | Website title |
| siteDescription | Text | No | Website description |
| favicon | Media | No | Site favicon (16x16 or 32x32 PNG) |
| defaultSeo | Component | No | Default SEO metadata (shared.seo) |

#### Example JSON Structure

```json
{
  "data": {
    "id": 1,
    "attributes": {
      "siteName": "My Tech Blog",
      "siteDescription": "A blog about technology, programming, and software development",
      "favicon": {
        "data": {
          "id": 1,
          "attributes": {
            "url": "/uploads/favicon.png",
            "name": "favicon.png"
          }
        }
      },
      "defaultSeo": {
        "id": 1,
        "metaTitle": "My Tech Blog - Programming & Technology",
        "metaDescription": "Learn about programming, technology, and software development",
        "shareImage": {
          "data": {
            "id": 2,
            "attributes": {
              "url": "/uploads/og_default.jpg"
            }
          }
        }
      },
      "createdAt": "2025-01-10T00:00:00.000Z",
      "updatedAt": "2025-01-10T12:00:00.000Z"
    }
  }
}
```

#### Updating Global Settings

**Via Admin Panel:**
1. Navigate to Content Manager > Global
2. Edit the single entry
3. Update fields as needed
4. Click "Save"

**Via API:**

```bash
curl -X PUT http://localhost:1337/api/global \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "siteName": "Updated Blog Name",
      "siteDescription": "Updated description"
    }
  }'
```

### About Page

About page content with dynamic blocks. Only one entry exists.

#### Schema Location
`src/api/about/content-types/about/schema.json`

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | String | No | Page title |
| blocks | Dynamic Zone | No | Content blocks (media, quotes, rich text, sliders) |

#### Example JSON Structure

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
          "body": "# About Our Blog\n\nWe are passionate about sharing knowledge..."
        },
        {
          "id": 2,
          "__component": "shared.quote",
          "title": "Our Mission",
          "body": "To inspire and educate developers worldwide"
        },
        {
          "id": 3,
          "__component": "shared.slider",
          "files": {
            "data": [
              {
                "id": 1,
                "attributes": {
                  "url": "/uploads/team1.jpg"
                }
              },
              {
                "id": 2,
                "attributes": {
                  "url": "/uploads/team2.jpg"
                }
              }
            ]
          }
        }
      ],
      "createdAt": "2025-01-10T00:00:00.000Z",
      "updatedAt": "2025-01-10T12:00:00.000Z"
    }
  }
}
```

#### Updating About Page

**Via Admin Panel:**
1. Navigate to Content Manager > About
2. Edit the single entry
3. Update title and blocks
4. Click "Save"

## Shared Components

Reusable content components used in dynamic zones.

### Media Component

Display images, videos, or files.

#### Schema Location
`src/components/shared/media.json`

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| file | Media | No | Image, video, or document file |

#### Usage

```json
{
  "__component": "shared.media",
  "file": {
    "data": {
      "id": 1,
      "attributes": {
        "url": "/uploads/image.jpg",
        "mime": "image/jpeg",
        "width": 1920,
        "height": 1080
      }
    }
  }
}
```

### Quote Component

Display highlighted quotes or important text blocks.

#### Schema Location
`src/components/shared/quote.json`

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| title | String | No | Quote title or attribution |
| body | Text | No | Quote text content |

#### Usage

```json
{
  "__component": "shared.quote",
  "title": "Steve Jobs",
  "body": "Design is not just what it looks like and feels like. Design is how it works."
}
```

### Rich Text Component

Markdown-enabled text content with formatting support.

#### Schema Location
`src/components/shared/rich-text.json`

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| body | Rich Text | No | Markdown formatted content |

#### Supported Markdown

- Headings: `# H1`, `## H2`, `### H3`
- Bold: `**bold**`
- Italic: `*italic*`
- Links: `[text](url)`
- Images: `![alt](url)`
- Lists: `-` or `1.`
- Code: `` `inline` `` or ` ```block``` `
- Blockquotes: `> quote`

#### Usage

```json
{
  "__component": "shared.rich-text",
  "body": "# Introduction\n\nThis is **bold** and this is *italic*.\n\n- List item 1\n- List item 2\n\n```javascript\nconst hello = 'world';\n```"
}
```

### Slider Component

Image gallery or carousel with multiple images.

#### Schema Location
`src/components/shared/slider.json`

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| files | Media (multiple) | No | Array of images for the slider |

#### Usage

```json
{
  "__component": "shared.slider",
  "files": {
    "data": [
      {
        "id": 1,
        "attributes": {
          "url": "/uploads/slide1.jpg"
        }
      },
      {
        "id": 2,
        "attributes": {
          "url": "/uploads/slide2.jpg"
        }
      },
      {
        "id": 3,
        "attributes": {
          "url": "/uploads/slide3.jpg"
        }
      }
    ]
  }
}
```

### SEO Component

Search engine optimization metadata.

#### Schema Location
`src/components/shared/seo.json`

#### Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| metaTitle | String | No | Page title for search engines (60-70 chars recommended) |
| metaDescription | Text | No | Page description for search engines (150-160 chars recommended) |
| shareImage | Media | No | Image for social media sharing (1200x630 recommended) |

#### Usage

```json
{
  "id": 1,
  "metaTitle": "Getting Started with Strapi - My Tech Blog",
  "metaDescription": "Learn how to build modern APIs with Strapi headless CMS in this comprehensive guide",
  "shareImage": {
    "data": {
      "id": 1,
      "attributes": {
        "url": "/uploads/og_strapi.jpg",
        "width": 1200,
        "height": 630
      }
    }
  }
}
```

## Relationships

### Blog Relationships

#### Article ↔ Author

**Type:** Many-to-One (many articles, one author)

An article can have one author, but an author can have many articles.

**Configuration:**
- Article side: `author` field (relation to Author)
- Author side: `articles` field (relation to Article)

**Querying:**

```bash
# Get article with author
curl "http://localhost:1337/api/articles/1?populate[author]=*"

# Get author with all articles
curl "http://localhost:1337/api/authors/1?populate[articles]=*"

# Get all articles by specific author
curl "http://localhost:1337/api/articles?filters[author][id][$eq]=1"
```

#### Article ↔ Category

**Type:** Many-to-One (many articles, one category)

An article can belong to one category, but a category can have many articles.

**Configuration:**
- Article side: `category` field (relation to Category)
- Category side: `articles` field (relation to Article)

**Querying:**

```bash
# Get article with category
curl "http://localhost:1337/api/articles/1?populate[category]=*"

# Get category with all articles
curl "http://localhost:1337/api/categories/1?populate[articles]=*"

# Get all articles in specific category
curl "http://localhost:1337/api/articles?filters[category][slug][$eq]=technology"
```

### Real Estate Relationships

#### Apartment ↔ Agent

**Type:** Many-to-One (many apartments, one agent)

An apartment must have one agent, and an agent can manage many apartments.

**Configuration:**
- Apartment side: `agent` field (relation to Agent, required)
- Agent side: `apartments` field (relation to Apartment)

**Querying:**

```bash
# Get apartment with agent
curl "http://localhost:1337/api/apartments/1?populate[agent]=*"

# Get agent with all apartments
curl "http://localhost:1337/api/agents/1?populate[apartments]=*"

# Get all apartments by specific agent
curl "http://localhost:1337/api/apartments?filters[agent][id][$eq]=1"
```

#### Apartment ↔ City

**Type:** Many-to-One (many apartments, one city)

An apartment must be located in one city, and a city can have many apartments.

**Configuration:**
- Apartment side: `city` field (relation to City, required)
- City side: `apartments` field (relation to Apartment)

**Querying:**

```bash
# Get apartment with city
curl "http://localhost:1337/api/apartments/1?populate[city]=*"

# Get city with all apartments
curl "http://localhost:1337/api/cities/1?populate[apartments]=*"

# Get all apartments in specific city
curl "http://localhost:1337/api/apartments?filters[city][slug][$eq]=san-francisco"

# Get all apartments with both agent and city
curl "http://localhost:1337/api/apartments?populate[agent]=*&populate[city]=*"
```

### Relationship Diagrams

#### Blog Relationships

```
┌─────────────┐
│   Author    │
│             │
│ - name      │
│ - email     │
│ - avatar    │
└──────┬──────┘
       │
       │ one-to-many
       │
       ▼
┌─────────────┐
│   Article   │◄─────────┐
│             │          │
│ - title     │          │
│ - slug      │          │ one-to-many
│ - content   │          │
└──────┬──────┘          │
       │                 │
       │ many-to-one     │
       │                 │
       ▼                 │
┌─────────────┐          │
│  Category   │──────────┘
│             │
│ - name      │
│ - slug      │
└─────────────┘
```

#### Real Estate Relationships

```
┌──────────────────────────────────────────┐
│              AGENT (1)                   │
│                                          │
│ - name (required)                       │
│ - email (required, unique)              │
│ - phone (required)                      │
│ - avatar (optional image)               │
│ - bio (optional text)                   │
│ - apartments (one-to-many)              │
└────────────────────┬─────────────────────┘
                     │
                     │ 1:N (Agent has many Apartments)
                     │
                     ▼
┌──────────────────────────────────────────┐
│            APARTMENT (N)                  │
│                                          │
│ - title (required)                      │
│ - description (optional)                │
│ - slug (optional, auto-generated)       │
│ - price (required)                      │
│ - address (required)                    │
│ - bedrooms (optional)                   │
│ - bathrooms (optional)                  │
│ - area (optional)                       │
│ - images (optional, multiple)           │
│ - agent (M:1 - REQUIRED)                │
│ - city (M:1 - REQUIRED)                 │
└────────────┬─────────────────────────────┘
             │
             │ M:1 (Many Apartments in one City)
             │
             ▼
       ┌─────────────────────────────────┐
       │          CITY (1)               │
       │                                 │
       │ - name (required)              │
       │ - slug (optional, auto-gen)    │
       │ - country (required)           │
       │ - region (optional)            │
       │ - description (optional)       │
       │ - image (optional)             │
       │ - apartments (one-to-many)     │
       └─────────────────────────────────┘
```

## Content Workflows

### Blog Workflows

#### Creating a Complete Blog Post

1. **Create Author** (if not exists)
2. **Create Category** (if not exists)
3. **Create Article**:
   - Add title and description
   - Link to author and category
   - Upload or select cover image
   - Add content blocks
4. **Save as Draft** for review
5. **Publish** when ready

#### Managing Article States

Articles support draft and publish states:

- **Draft**: Work in progress, not visible via API
- **Published**: Live and visible to the public

**Workflow:**
1. Create article (automatically draft)
2. Edit and refine content
3. Preview if needed
4. Publish when ready
5. Update and republish as needed
6. Unpublish to take offline (returns to draft)

### Real Estate Workflows

#### Creating a Complete Property Listing

1. **Create City** (if not exists):
   - Add city name and country
   - Optionally add region and description
   - Upload city image

2. **Create Agent** (if not exists):
   - Add name, email, and phone (all required)
   - Optionally add bio and avatar

3. **Create Apartment**:
   - Add title, price, and address (required)
   - Select agent and city (required)
   - Add bedrooms, bathrooms, and area (optional)
   - Upload property images (multiple)
   - Add detailed description

4. **Save as Draft** for review
5. **Publish** when ready to list

#### Managing Apartment Listing States

Apartments support draft and publish states:

- **Draft**: Listing is not publicly visible via API
- **Published**: Listing is live and searchable

**Workflow:**
1. Create apartment (automatically draft)
2. Add all property details and images
3. Verify agent and city assignments
4. Publish when listing is complete
5. Update details as needed and republish
6. Unpublish to take offline (returns to draft)

#### Location-Based Search Workflow

1. **Browse by City**:
   ```bash
   # Get all cities
   curl "http://localhost:1337/api/cities"

   # Get apartments in a specific city
   curl "http://localhost:1337/api/apartments?filters[city][slug][$eq]=san-francisco&populate=*"
   ```

2. **Filter by Price Range**:
   ```bash
   # Find apartments under $3000
   curl "http://localhost:1337/api/apartments?filters[price][$lt]=3000&populate=*"

   # Find apartments between $2000-$4000
   curl "http://localhost:1337/api/apartments?filters[price][$gte]=2000&filters[price][$lte]=4000&populate=*"
   ```

3. **Filter by Specifications**:
   ```bash
   # Find 2+ bedroom apartments
   curl "http://localhost:1337/api/apartments?filters[bedrooms][$gte]=2&populate=*"

   # Find apartments with 2 bathrooms in San Francisco
   curl "http://localhost:1337/api/apartments?filters[bathrooms][$eq]=2&filters[city][slug][$eq]=san-francisco&populate=*"
   ```

#### Agent Portfolio Management

1. **View Agent Listings**:
   ```bash
   # Get agent with all their apartments
   curl "http://localhost:1337/api/agents/1?populate[apartments][populate]=city"
   ```

2. **Assign Apartment to Different Agent**:
   ```bash
   curl -X PUT "http://localhost:1337/api/apartments/1" \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"data": {"agent": 2}}'
   ```

## Best Practices

### SEO Optimization

1. **Unique Titles**: Each article should have a unique, descriptive title
2. **Descriptive Slugs**: Use clear, keyword-rich slugs
3. **Meta Descriptions**: Write compelling 150-160 character descriptions
4. **Alt Text**: Add descriptive alt text to all images
5. **Share Images**: Use 1200x630 images for social sharing

### Content Organization

1. **Consistent Categories**: Use a limited, well-defined set of categories
2. **Author Profiles**: Keep author information complete and up-to-date
3. **Cover Images**: Use consistent aspect ratios (16:9 recommended)
4. **Content Blocks**: Use a mix of text, images, and quotes for engagement

### Performance

1. **Image Optimization**: Compress images before upload
2. **Pagination**: Use pagination for large article lists
3. **Selective Population**: Only populate needed relations
4. **Field Selection**: Request only required fields

### Data Integrity

1. **Required Fields**: Always fill required fields (title, description, slug)
2. **Unique Slugs**: Ensure article slugs are unique
3. **Relationships**: Link articles to authors and categories
4. **Validation**: Validate data before creating/updating

### Media Guidelines

1. **Cover Images**: 1920x1080 (16:9) or 1200x630 (og:image)
2. **Avatars**: 400x400 square images
3. **Favicon**: 32x32 PNG with transparency
4. **File Sizes**: Keep images under 500KB
5. **Formats**: Use WebP for best quality/size ratio, fallback to JPG/PNG

## Extending Content Types

### Adding New Fields

Use the Content-Type Builder in the admin panel:

1. Navigate to Content-Type Builder
2. Select the content type to modify
3. Click "Add another field"
4. Choose field type and configure
5. Click "Finish" and save

### Creating Custom Content Types

1. Navigate to Content-Type Builder
2. Click "Create new collection type"
3. Define fields and relationships
4. Configure advanced settings
5. Save and the API will be auto-generated

### Modifying Components

1. Navigate to Content-Type Builder
2. Go to "Components" section
3. Select component to edit
4. Add, remove, or modify fields
5. Save changes

## Next Steps

- Read [API.md](API.md) for API usage examples
- Check [SETUP.md](SETUP.md) for configuration details
- Explore the admin panel Content-Type Builder
- Start creating content!
