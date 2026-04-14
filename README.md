# Maverics.ai Website

Static site for [maverics.ai](https://www.maverics.ai) built with Gatsby + React, Decap CMS, and deployed via Netlify.

## Get the Site Running

Pick whichever option fits your setup. Option A requires nothing beyond Docker. Option B is a full local Node.js environment.

### Option A: Docker (fastest — no Node.js needed)

1. **Install Docker Desktop** if you don't have it: https://www.docker.com/products/docker-desktop/
2. Open a terminal and clone the repo:
   ```bash
   git clone https://github.com/strata-io/maverics-site
   cd maverics-site
   ```
3. Start the site:
   ```bash
   docker-compose up --build
   ```
4. Open http://localhost:8000 — that's the full site running on your machine.

That's it. Docker handles Node.js, dependencies, everything.

### Option B: Local Development (full setup)

#### Prerequisites

You need **Node.js 20** and **npm**. The easiest way is through nvm:

**Install nvm** (if you don't have it):
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
```
Close and reopen your terminal, then:

```bash
nvm install 20
nvm use 20
```

Verify it worked:
```bash
node --version   # should show v20.x.x
npm --version    # should show 10.x.x
```

#### One-time setup

1. **Install Claude Desktop** (or Claude Code) if you don't have it
2. Open a terminal and clone the repo:
   ```bash
   git clone https://github.com/strata-io/maverics-site
   cd maverics-site
   ```
3. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```

#### Start the dev server

**From the terminal:**
```bash
npm start
```

**From Claude Desktop:**
1. Open Claude Desktop, click **Code**, set the folder to the cloned repo
2. Tell Claude: *"Run the dev server"*

Either way, open http://localhost:8000 — that's the full site running on your machine.

---

## Write and Publish a Blog Post

You don't need to know Markdown, frontmatter, or Gatsby. Claude handles all of it.

1. **Open Claude Desktop**, click **Code**, set the folder to the cloned repo
2. **Tell Claude:**
   > "Let's write a new blog. Branch this repo and create a new blog following the format of the other blogs in the blog folder. Write a blog about [your topic/ideas here]."

   Claude creates the post — formatting, frontmatter, images, all of it.
3. **Preview locally** — tell Claude: *"Run the dev server"* and open http://localhost:8000 to see your post
4. **When you're happy**, tell Claude: *"Create a PR"*
5. **Every push to the branch generates a live Netlify preview link** — share it with anyone for peer review, no setup needed
6. **Post the PR in `#content-review-and-approvals`** for peer review
7. **Once approved, merge the PR.** Netlify rebuilds automatically. It's live.

That's it. No Google Docs, no copy-pasting, no WordPress.

---

## MCP Endpoint

The blog is available as an [MCP](https://modelcontextprotocol.io) (Model Context Protocol) endpoint. AI assistants like Claude can query blog content directly.

**Endpoint:** `https://www.maverics.ai/mcp`

**Tools available:**
| Tool | Description |
|------|-------------|
| `listBlogs` | List all blog posts with title, date, author, category, description, and URL |
| `getBlog` | Get the full content of a specific post by slug |

**Connect from Claude Desktop:**

Add this to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json`):
```json
{
  "mcpServers": {
    "maverics-blog": {
      "command": "npx",
      "args": ["mcp-remote@next", "https://www.maverics.ai/mcp"]
    }
  }
}
```

**Test with MCP Inspector:**
```bash
npx @modelcontextprotocol/inspector npx mcp-remote@next https://www.maverics.ai/mcp
```

The blog data is generated at build time — every new blog post merged to `main` is automatically available via MCP.

---

## Reference

### Stack

| Layer | Tool |
|-------|------|
| Framework | Gatsby 4 + React 18 |
| CMS | Decap CMS (Git-based, no database) |
| Styling | SASS (custom design system) |
| Deployment | Netlify (auto-builds on push to `main`) |
| Code highlighting | Prism.js |
| MCP Server | Netlify Function at `/mcp` |

### Commands

| Command | Description |
|---------|-------------|
| `npm start` | Dev server on port 8000 |
| `npm run build` | Production build to `public/` |
| `npm run serve` | Serve production build locally |
| `npm run clean` | Clear Gatsby cache |
| `npm run cms` | Decap CMS local proxy (port 8081) |

### Project Structure

```
src/
├── cms/              # Decap CMS preview templates
├── components/       # React components
├── pages/
│   ├── blog/         # Blog posts (Markdown)
│   ├── solutions/    # Solution pages
│   └── labs/         # Sandbox page
├── style/            # SASS stylesheets
└── templates/        # Page templates
static/
├── admin/config.yml  # CMS configuration
└── img/              # Static images (uploads, avatars)
```

### Blog Post Frontmatter

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
```

### Image Locations

| Type | Path | Reference in frontmatter |
|------|------|--------------------------|
| Author avatars | `static/img/authors/` | `/img/authors/nick-gamb.jpg` |
| Blog hero images | `static/img/blog/` | `/img/blog/your-image.png` |
| Feature icons | `static/img/features/` | `/img/features/icon.svg` |

### Using the CMS Locally

To use the CMS admin panel at `/admin/` during local development, you need **two terminals**:

```bash
# Terminal 1 — Gatsby dev server
npm start

# Terminal 2 — Decap CMS proxy
npm run cms
```

Then open http://localhost:8000/admin/ in your browser.
