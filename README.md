# Starter Flavor Theme - ShadCN

Tema WordPress moderno con design system shadcn/ui, costruito con vanilla CSS e JavaScript.

## Caratteristiche

- Design system shadcn/ui completo (colori, tipografia, spaziatura, ombre)
- Dark mode con toggle e rispetto delle preferenze di sistema
- Font Geist (il font ufficiale di Vercel/shadcn)
- Componenti: Card, Badge, Button, Input, Search Form
- Menu responsive con hamburger mobile
- Header sticky con hide-on-scroll
- Griglia post responsive (1/2/3 colonne)
- Template completi: index, single, page, archive, search, 404, comments
- Navigazione articoli (precedente/successivo)
- Paginazione stilizzata
- Stili prose per il contenuto degli articoli
- Supporto blocchi WordPress (alignwide, alignfull)
- Sidebar e widget personalizzati
- Accessibilita (skip links, aria labels, focus visible)
- Zero dipendenze JavaScript (vanilla JS)
- Zero dipendenze CSS (vanilla CSS con custom properties)

## Installazione

1. Scarica o clona questa repository
2. Copia la cartella nella directory `wp-content/themes/` di WordPress
3. Attiva il tema dal pannello di amministrazione WordPress

## Struttura

```
starter-flavor-shadcn/
├── style.css                    # Header tema WordPress
├── functions.php                # Configurazione tema
├── header.php                   # Header con navigazione
├── footer.php                   # Footer
├── index.php                    # Template principale
├── single.php                   # Articolo singolo
├── page.php                     # Pagina statica
├── archive.php                  # Archivi
├── search.php                   # Risultati ricerca
├── searchform.php               # Form di ricerca
├── 404.php                      # Pagina non trovata
├── comments.php                 # Commenti
├── sidebar.php                  # Sidebar
├── template-parts/
│   ├── content.php              # Card articolo
│   ├── content-none.php         # Nessun risultato
│   ├── content-page.php         # Contenuto pagina
│   └── content-search.php       # Risultato ricerca
└── assets/
    ├── css/
    │   └── shadcn.css           # Design system completo
    └── js/
        └── main.js              # Dark mode, menu mobile, scroll
```

## Requisiti

- WordPress 6.0+
- PHP 8.0+
