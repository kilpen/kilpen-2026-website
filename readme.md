# KilPen Technical Services Website

Corporate website for KilPen Technical Services - IT with Aloha.

## Tech Stack

- [Hugo](https://gohugo.io/) - Static site generator (standard build, v0.153+)
- Self-contained custom theme: templates in `layouts/`, styles in `assets/css/main.css`, behavior in `assets/js/site.js`
- No Node, Tailwind, theme submodules, or remote Hugo modules

## Layout

- `content/english/` — all page and blog content (Markdown)
- `layouts/` — templates, partials, and shortcodes (notice, button, accordion, tabs, etc.)
- `assets/css/main.css` — the design system; brand tokens (logo crimson/black/gray) at the top in `:root`
- `assets/images/` — site images, mounted to `/images/...` via `hugo.toml`
- `config/_default/` — menus, params (contact form webhook, Plausible), languages

## Development

```bash
# Run development server
hugo server

# Build for production
hugo --minify
```

## Deployment

Pushes to `main` deploy automatically to GitHub Pages at [kilpen.com](https://kilpen.com)
via `.github/workflows/hugo.yml`.
