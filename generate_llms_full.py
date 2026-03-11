#!/usr/bin/env python3
"""
generate_llms_full.py — Generate llms-full.txt for jorgemfs.com

Crawls all content pages, strips HTML to clean Markdown, and concatenates
them into a single llms-full.txt file that LLM agents can ingest in one request.

Usage:
    pip install requests beautifulsoup4 markdownify
    python generate_llms_full.py

Output:
    llms-full.txt in the current directory

To keep it updated, run this script after publishing new content,
or add it as a post-build hook in your static site generator.
"""

from typing import Optional

import requests
from bs4 import BeautifulSoup
from markdownify import markdownify as md
from datetime import datetime, timezone
import re
import sys
import time

# ─────────────────────────────────────────────
# CONFIGURATION — edit these when you add pages
# ─────────────────────────────────────────────

SITE_URL = "https://jorgemfs.com"

# All content pages to include, in display order.
# Add new pages here as you publish them.
PAGES = [
    # ── Core pages ──
    {"url": "/en/", "title": "Homepage (EN)", "section": "About"},
    {"url": "/pt/", "title": "Homepage (PT)", "section": "About"},
    {"url": "/cv.html", "title": "Curriculum Vitae", "section": "About"},

    # ── Essays (EN) ──
    {"url": "/essays/2025/12/28/against-the-quiet-empire.html", "title": "Against the Quiet Empire", "section": "Essays"},
    {"url": "/essays/2025/11/14/the-kingdom-of-lesser-thrones.html", "title": "The Kingdom of Lesser Thrones", "section": "Essays"},

    # ── Ensaios (PT) ──
    {"url": "/ensaios/2025/12/28/contra-o-imperio-silencioso.html", "title": "Contra o Império Silencioso", "section": "Ensaios (PT)"},
    {"url": "/ensaios/2025/11/14/o-reino-dos-tronos-menores.html", "title": "O Reino dos Tronos Menores", "section": "Ensaios (PT)"},

    # ── Research guides ──
    {"url": "/federated-learning/", "title": "Federated Learning Guide", "section": "Research"},

    # ── Tools ──
    {"url": "/vcfx/", "title": "VCFX — VCF Manipulation Toolkit", "section": "Tools"},
]

# CSS selectors to remove (navigation, footers, scripts, etc.)
REMOVE_SELECTORS = [
    "nav", "header", "footer",
    ".navbar", ".nav-menu", ".sidebar",
    ".social-links", ".back-to-top",
    "script", "style", "noscript",
    ".breadcrumbs", ".pagination",
    "#preloader", ".loading",
    "[class*='cookie']",
    "[class*='share']",
]

# ─────────────────────────────────────────────
# EXTRACTION
# ─────────────────────────────────────────────

def fetch_page(url: str) -> Optional[str]:
    """Fetch a page and return its HTML, or None on failure."""
    try:
        resp = requests.get(url, timeout=15, headers={
            "User-Agent": "llms-full-generator/1.0 (jorgemfs.com; generating llms-full.txt)"
        })
        resp.raise_for_status()
        return resp.text
    except Exception as e:
        print(f"  ⚠ Failed to fetch {url}: {e}", file=sys.stderr)
        return None


def html_to_clean_markdown(html: str) -> str:
    """Convert HTML to clean Markdown, removing nav/chrome/scripts."""
    soup = BeautifulSoup(html, "html.parser")

    # Remove unwanted elements
    for selector in REMOVE_SELECTORS:
        for el in soup.select(selector):
            el.decompose()

    # Try to find main content area
    main = (
        soup.find("main")
        or soup.find("article")
        or soup.find(id="main")
        or soup.find(class_="content")
        or soup.find("body")
    )

    if main is None:
        main = soup

    # Convert to markdown
    content = md(str(main), heading_style="ATX", bullets="-", strip=["img"])

    # Clean up excessive whitespace
    content = re.sub(r"\n{4,}", "\n\n\n", content)
    content = re.sub(r"[ \t]+\n", "\n", content)
    content = content.strip()

    return content


# ─────────────────────────────────────────────
# GENERATION
# ─────────────────────────────────────────────

def generate_llms_full() -> str:
    """Generate the complete llms-full.txt content."""
    timestamp = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")

    parts = []

    # Header
    parts.append(f"""# Jorge Miguel Silva — Full Site Content

> This file contains the complete text content of jorgemfs.com, formatted as
> clean Markdown for consumption by LLM agents. Generated on {timestamp}.
> For a curated index, see /llms.txt instead.

---
""")

    current_section = None
    success_count = 0
    fail_count = 0

    for page in PAGES:
        url = SITE_URL + page["url"]
        title = page["title"]
        section = page["section"]

        # Section header
        if section != current_section:
            parts.append(f"\n---\n\n## {section}\n")
            current_section = section

        print(f"  Fetching: {title} ({url})...")

        html = fetch_page(url)
        if html is None:
            fail_count += 1
            parts.append(f"\n### {title}\n\n*Source: {url}*\n\n> ⚠ Could not fetch this page.\n")
            continue

        content = html_to_clean_markdown(html)
        success_count += 1

        parts.append(f"\n### {title}\n\n*Source: {url}*\n\n{content}\n")

        # Be polite to your own server
        time.sleep(0.5)

    # Footer
    parts.append(f"""
---

*Generated by generate_llms_full.py on {timestamp}.*
*{success_count} pages fetched successfully, {fail_count} failed.*
*Source: https://jorgemfs.com | Contact: jorge.miguel.ferreira.silva@ua.pt*
""")

    return "\n".join(parts)


# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────

if __name__ == "__main__":
    print("Generating llms-full.txt for jorgemfs.com...")
    print()

    content = generate_llms_full()

    output_path = "llms-full.txt"
    with open(output_path, "w", encoding="utf-8") as f:
        f.write(content)

    # Stats
    lines = content.count("\n")
    chars = len(content)
    words = len(content.split())
    print()
    print(f"✓ Written to {output_path}")
    print(f"  {lines} lines, {words} words, {chars} characters")
    print(f"  Estimated tokens: ~{words // 3 * 4} (rough)")
    print()
    print("Next steps:")
    print("  1. Copy llms-full.txt to the root of your site")
    print("  2. Run this script again whenever you publish new content")
    print("  3. Or add it as a post-build hook in Jekyll/Hugo/etc.")
