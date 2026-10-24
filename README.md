# Mohammed Shabeeb R A — Software Engineer Portfolio

A fast, dependency-free personal portfolio site. Plain HTML, CSS and JavaScript — no build step.

## Structure

```
Portfolio/
├── index.html                 # Main site: the "Terminal" edition
├── styles.css                 # Dark IDE look, left rail nav, lime + magenta accents
├── script.js                  # Theme toggle, mobile nav, scroll effects, animations
├── assets/
│   ├── Mohammed-Shabeeb-RA-CV.pdf   # Linked from the "Download CV" buttons
│   └── profile.jpg                  # Hero portrait
└── light/                     # Light edition: same content, different design
    ├── index.html             # Points at ../assets/
    ├── styles.css             # Clean teal design, top navigation
    └── script.js
```

## Two editions

- **Terminal edition** (root `index.html`, the main site): dark IDE aesthetic, fixed left rail, monospace labels, lime and magenta accents, dark by default with a light toggle.
- **Light edition** (`light/index.html`): clean teal design, top navigation, light by default with a dark toggle. Open it at `/light/` when serving the root folder.

Each edition remembers its own theme choice. Both share `assets/`, so deploy the whole folder together. To publish only one edition, make that folder the site root and copy `assets/` next to it.

## Run locally

Open `index.html` directly in a browser, or serve the folder:

```bash
python -m http.server 8080
```

Then visit <http://localhost:8080>.

## Customise

- **Content** — edit the text in `index.html`. Sections are marked with `<!-- ==== NAME ==== -->` comments.
- **Colours / fonts** — change the CSS variables at the top of each edition's `styles.css` (root: `:root` is dark, `[data-theme="light"]` is light; light: `:root` is light, `[data-theme="dark"]` is dark).
- **CV** — replace `assets/Mohammed-Shabeeb-RA-CV.pdf` with a newer file of the same name.
- **Links** — LinkedIn, email and phone appear in the hero and the Contact section.

## Before you publish

1. Replace every `https://YOUR-DOMAIN.example` with your real site URL. It appears in `index.html`, `light/index.html`, `sitemap.xml` and `robots.txt` (canonical link, Open Graph URL and image, JSON-LD).
2. The social preview image is `assets/og-image.png` (1200 × 630). Regenerate it if you change your name, title or photo.
3. Favicons live in `assets/` (`favicon.svg`, `favicon-32.png`, `favicon.ico`, `apple-touch-icon.png`, `icon-512.png`).

## Deploy

Any static host works. Two quick options:

**GitHub Pages** — full walkthrough in [DEPLOY.md](DEPLOY.md)

1. Create a repository (for example `shabeeb-portfolio`) and push this folder to it.
2. In the repository settings, open **Pages** and set the source to the `main` branch, root folder.
3. The site goes live at `https://<username>.github.io/<repo>/`.

**Netlify / Vercel / Cloudflare Pages**

Drag and drop the folder, or connect the repository. No build command, output directory is the project root.
