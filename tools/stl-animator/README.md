# STL Animator (Static GitHub Pages Tool)

This tool is deployed inside the personal site at:

- `https://<your-domain-or-username.github.io>/tools/stl-animator/`

It is integrated as a static frontend app (no backend runtime).

## GitHub Pages Notes

- GitHub Pages does not run Node/Express endpoints.
- This embedded version is configured for **client-side upload workflow**.
- Server-only reload/API flow is disabled in this static deployment.

Use the **Upload Model** button to load local STL/GLB files in-browser.

## Build/Update Workflow

This website repo stores the built frontend files directly in:

- `tools/stl-animator/index.html`
- `tools/stl-animator/assets/*`

To update from the separate STL Animator project:

1. Build/export the frontend in the STL Animator repo (the `server/public/` output).
2. Copy only static build files into `tools/stl-animator/` in this repo.
3. Ensure asset references in `tools/stl-animator/index.html` remain relative (`./assets/...`).
4. Keep server/API-dependent features disabled for GitHub Pages static hosting.
