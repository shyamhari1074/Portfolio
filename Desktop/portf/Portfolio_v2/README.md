# Shyam Hari — Portfolio

Vite + React + Three.js + GSAP. Deploys to Vercel with no extra config (`vercel.json` only redirects the old `/public/resume.pdf` URL).

```bash
npm install
npm run dev      # local dev
npm run build    # production build into dist/
```

## Where things live
- `src/data.js` — all copy: projects, skills, experience, services, links. Edit here.
- `src/Intro.jsx` — GSAP intro (plays once per session, skipped for reduced motion).
- `src/Hero.jsx` — particle portrait. Samples `public/portrait.jpg` at runtime, so swapping the photo updates the hero.
- `src/styles.css` — design tokens at the top (`:root`), speckled graphite grain on `body::after`.
- `public/` — `portrait.jpg`, `about.png`, `resume.pdf`.

## To finish
- In `src/data.js`, four projects have a `// candidate:` repo comment. Confirm each and add `github: '...'` to show its link.
- Services are placeholders.
