# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a personal portfolio website for Jorge Miguel Silva (jorgemfs.com), built with Jekyll and hosted on GitHub Pages. The main site (`index.html`) uses Tailwind CSS (via CDN) with dark mode support, while subpages use different styling approaches.

## Development Commands

```bash
# Local preview - serves static files via Python's HTTP server
python3 -m http.server

# For Jekyll processing (if needed)
bundle exec jekyll serve
```

The site auto-deploys via GitHub Pages when changes are pushed to the `master` branch.

## Architecture

### Main Site (`index.html`)
- Single-page portfolio with sections: hero, about, projects, publications, portfolio, skills, resume, contact
- Uses **Tailwind CSS via CDN** with dark mode (`darkMode: 'class'`)
- Vendor libraries in `assets/vendor/`: AOS (animations), Isotope (portfolio filtering), Typed.js, GLightbox, PureCounter
- Theme toggle persists via localStorage
- Mobile-responsive sidebar navigation

### Jekyll Structure
- `_config.yml` - Jekyll configuration (kramdown markdown, rouge highlighter, jekyll-feed plugin)
- `_layouts/` - Three layout templates with different styling:
  - `page.html` - Bootstrap 5-based layout for standalone pages (e.g., federated-learning pages)
  - `post.html` - Custom CSS layout with Literata/Inter fonts for blog essays
  - `blog.html` - Blog listing page with post cards, same styling as post.html
- `_includes/figure.html` - Reusable figure component: `{% include figure.html path="img/file.webp" alt="..." caption="..." %}`
- `_posts/` - Blog posts in markdown with YAML frontmatter

### Federated Learning Pages
Multi-page documentation section using `page.html` layout:
- `federated-learning-main.md` - Main overview
- `federated-learning-ops.md` - Operations guide
- `federated-learning-green.md` - Green computing aspects
- `federated-learning-threats.md` - Security threats

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
- Store in `assets/img/`, portfolio images in `assets/img/portfolio/`
- Use WebP format when possible
- Hero images display prominently at the top of posts

### Email Obfuscation
Email addresses use CSS-based obfuscation: `<span data-text="email@domain.com"></span>`
