# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Jorge Miguel Silva (jorgemfs.com), built with Jekyll and hosted on GitHub Pages. The site uses the iPortfolio Bootstrap template as a foundation.

## Development Commands

```bash
# Local preview - serves static files via Python's HTTP server
python3 -m http.server

# For Jekyll processing (if needed)
bundle exec jekyll serve
```

The site auto-deploys via GitHub Pages when changes are pushed to the `master` branch.

## Architecture

### Jekyll Structure
- `_config.yml` - Jekyll configuration (kramdown markdown, rouge highlighter, jekyll-feed plugin)
- `_layouts/` - Three layout templates:
  - `page.html` - Bootstrap-based layout for standalone pages (e.g., federated-learning)
  - `post.html` - Clean, typography-focused layout for blog essays
  - `blog.html` - Blog listing page with post cards
- `_includes/figure.html` - Reusable figure component with optional caption
- `_posts/` - Blog posts in markdown with YAML frontmatter

### Main Site
- `index.html` - Single-page portfolio with sections: hero, about, publications, portfolio, resume, contact
- Uses Bootstrap and vendor libraries from `assets/vendor/`
- Custom styles in `assets/css/style.css`

### Blog System
- Posts use layout: `post` with frontmatter: title, date, categories, hero_image, hero_alt
- Blog index at `blog/index.md` uses layout: `blog`
- Typography uses Literata (serif) for content, Inter (sans-serif) for UI

### Analytics
All layouts include Plausible analytics snippet (privacy-friendly, no cookies).

## Content Conventions

### Blog Posts
Posts go in `_posts/` with filename format: `YYYY-MM-DD-title-slug.md`

Required frontmatter:
```yaml
---
layout: post
title: Post Title
date: YYYY-MM-DD
categories: [Category]
hero_image: /assets/img/image.webp  # optional
hero_alt: Image description          # optional
---
```

### Images
- Store in `assets/img/`
- Use WebP format when possible
- Hero images display prominently at the top of posts
