# Emerging Patterns site

Static source for the field guide. See the [project README](../README.md) for GitHub Pages deployment and editorial notes.

Requires Node.js 22 or newer; no dependencies to install.

```sh
npm run dev
npm run build
npm run check
```

Edit chapters in `content/patterns.mjs`, templates in `scripts/build.mjs`, and styles and browser behavior in `assets/`. The build writes `dist/`.

Set `BASE_PATH=/emerging-patterns/` on build, check, and dev commands to emulate the GitHub Pages project URL. The default is `/`.
