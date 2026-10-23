# Emerging Patterns

A static, book-style field guide to working with coding agents. The proof of concept includes an overview and six individually addressable chapters, full-text chapter search, a responsive contents panel, section navigation, and copyable examples.

## Run locally

Requires Node.js 22 or newer. No dependency installation is needed.

```sh
npm run dev
```

Open http://localhost:4321. After an edit, run `npm run build` and refresh the browser; the development server serves the generated files without caching them. It does not watch source files automatically.

```sh
npm run build
npm run check
```

The check validates generated page metadata, local links, anchors, search URLs, and the 404 page at nested missing URLs. It does not replace browser testing.

## GitHub Pages

The site deploys to https://mimoo.github.io/emerging-patterns/ through `.github/workflows/pages.yml`. Pushes to `main` build, check, and deploy `site/dist/`. Pull requests build and check without publishing. You can also deploy manually from the Actions tab.

In the repository's **Settings → Pages**, select **GitHub Actions** as the publishing source. The workflow uses GitHub's official [Pages actions](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages) and obtains the base path from `configure-pages`, so it also supports a custom domain or a renamed repository.

To verify the repository subpath locally:

```sh
BASE_PATH=/emerging-patterns/ npm run build
BASE_PATH=/emerging-patterns/ npm run check
BASE_PATH=/emerging-patterns/ npm run dev
```

Open http://localhost:4321/emerging-patterns/. `BASE_PATH` defaults to `/` for root hosting. Use the same value for building, checking, and serving. Normal page links are relative; the custom 404 page uses the configured absolute base path so assets and recovery links work at any URL depth. Generated output includes `.nojekyll` and requires no server-side runtime.

## Edit the book

- `site/content/patterns.mjs` — chapter titles, descriptions, sections, examples, and sources.
- `site/scripts/build.mjs` — shared layout and static page generation.
- `site/assets/style.css` — design and responsive layout.
- `site/assets/app.js` — search, mobile navigation, and code copying.
- `site/dist/` — generated static output; upload to a static host.

Each chapter has a stable URL under `/patterns/<slug>/`. Reading and navigation work without JavaScript; search, copy buttons, and the mobile menu use JavaScript. Fonts load from Google Fonts with local serif/sans-serif fallbacks. All chapter data is baked into HTML, and search runs entirely in the browser.

The `site/` directory is tracked as ordinary source files in this repository. Root scripts are convenience wrappers; the same npm commands work from inside `site/`. Generated files and local Sites hosting metadata are ignored.

## Editorial status

This is an initial draft, not a collection of validated best practices. pstack and jev are named as proposed references and need concrete examples from the author. CLI commands are explicitly illustrative, not claimed pstack syntax. The Lean example illustrates a proof workflow and has not been checked with a Lean toolchain. The prompt-length chapter presents the link to The Bitter Lesson as an interpretation, not a conclusion of the essay.

AGENTS.md, Claude Code, and Lean chapters link to primary documentation. Claude compatibility is version-sensitive; check the linked source when revising it.
