# Starter Flavor Theme - ShadCN

Template HTML con design system shadcn/ui, vanilla CSS modulare e JavaScript.

## Preview

Apri `index.html` nel browser per vedere la homepage.

## Template

| File | Descrizione |
|------|-------------|
| `index.html` | Homepage / Blog con griglia di card |
| `single.html` | Articolo singolo con stili prose |
| `page.html` | Pagina statica (es. Chi sono) |
| `archive.html` | Archivio con filtri e ricerca |
| `404.html` | Pagina errore 404 |

## CSS Modulare

Ogni componente ha il suo foglio di stile:

```
assets/css/
├── variables.css    # Design tokens shadcn (colori HSL, spacing, radius, ombre)
├── reset.css        # CSS reset
├── typography.css   # Heading, text utilities
├── layout.css       # Container, grid, utilities
├── navbar.css       # Header, nav desktop, menu mobile
├── buttons.css      # Button (default, secondary, outline, ghost, destructive, link)
├── cards.css        # Card post con thumbnail, meta, excerpt
├── badges.css       # Badge (default, secondary, outline, destructive)
├── forms.css        # Input, textarea, search form
├── pagination.css   # Paginazione numerata
├── prose.css        # Stili per contenuto articoli (headings, code, blockquote, table)
└── footer.css       # Footer con griglia
```

## JavaScript

`assets/js/main.js` — Dark mode, menu mobile, header hide-on-scroll. Zero dipendenze.
