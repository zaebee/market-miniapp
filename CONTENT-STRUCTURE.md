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

Market MiniApp has 5 content types:

**Collection Types** (multiple entries):
- Articles - Blog posts
- Authors - Content creators
- Categories - Content organization

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

### Article ↔ Author

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

### Article ↔ Category

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

### Relationship Diagram

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

## Content Workflows

### Creating a Complete Blog Post

1. **Create Author** (if not exists)
2. **Create Category** (if not exists)
3. **Upload Cover Image**
4. **Create Article**:
   - Add title and description
   - Link to author and category
   - Upload cover image
   - Add content blocks
5. **Save as Draft** for review
6. **Publish** when ready

### Managing Content States

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
