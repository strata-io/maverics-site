# Maverics.ai Static Site

Static site for [maverics.ai](https://www.maverics.ai) built with Gatsby, Decap CMS, and deployed via Netlify. Replaces the WordPress site with a Git-managed workflow.

## Quick Start (Docker)

```bash
docker-compose up --build
```

Site: http://localhost:8000
CMS: http://localhost:8000/admin/

## Quick Start (Local)

```bash
nvm use
npm install --legacy-peer-deps
npm start
```

## Stack

- **Framework:** Gatsby 4 + React 18
- **CMS:** Decap CMS (Git-based, no database)
- **Styling:** Bulma CSS + SASS
- **Deployment:** Netlify (auto-builds on push to `main`)
- **Code highlighting:** Prism.js

## Blog Workflow

1. Create a new `.md` file in `src/pages/blog/` or use the CMS at `/admin/`
2. Add frontmatter (title, author, date, category, tags, featured image)
3. Write content in Markdown
4. Commit and push — Netlify rebuilds automatically

### Blog Post Template

```markdown
---
templateKey: blog-post
title: "Your Post Title"
date: 2026-04-08T00:00:00.000Z
author: Nick Gamb
authorImage: /img/authors/nick-gamb.jpg
description: "Short description for SEO"
featuredpost: true
featuredimage: /img/blog/your-image.png
category: Agentic Identity
tags:
  - MCP
  - OAuth
---

Your markdown content here...
```

## Project Structure

```
src/
├── cms/              # Decap CMS preview templates
├── components/       # React components
├── img/              # Source images
├── pages/            # Markdown content + page components
│   ├── blog/         # Blog posts (markdown)
│   ├── solutions/    # Solution pages
│   └── labs/         # Sandbox page
├── style/            # SASS stylesheets
└── templates/        # Page templates (blog-post, index, etc.)
static/
├── admin/config.yml  # CMS configuration
└── img/              # Static images (uploads, avatars)
```

## Commands

| Command | Description |
|---------|-------------|
| `npm start` | Start dev server (port 8000) |
| `npm run build` | Production build to `public/` |
| `npm run serve` | Serve production build locally |
| `npm run clean` | Clear Gatsby cache |

## Netlify Setup

1. Connect this repo to Netlify
2. Build command: `npm ci --legacy-peer-deps && npm run build`
3. Publish directory: `public`
4. Enable Netlify Identity + Git Gateway for CMS access

## Adding Images

- Place author avatars in `static/img/authors/`
- Place blog hero images in `static/img/blog/`
- Place feature icons in `static/img/features/`
- Reference as `/img/authors/nick-gamb.jpg` in frontmatter
