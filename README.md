# Harry Huynh Personal Website

Static personal website and Information Technology Engineering portfolio. There is no login page, no admin panel, and no
database. The Git repository is the CMS: content lives in files, and a build turns those files into static HTML.

## Run Locally

```powershell
pnpm install
pnpm run build
pnpm run host
```

Open `http://localhost:5173` on this computer. For another device on the same network, use this computer's local IP
address with port `5173` after allowing that port through the firewall.

For development:

```powershell
pnpm run dev
```

## Content

- Profile and personal details: `content/profile.json`
- Work case studies: `content/projects/*.md`
- Blog posts: `content/blog/*.md`
- Photo album metadata: `content/albums/*.json`
- Images and photos: `public/images/`

The placeholder SVGs are intentionally simple. Replace them with your real portrait, project screenshots, and photos when
you are ready.

## Create New Content

```powershell
pnpm new-post "My Post Title"
pnpm new-project "My Project Title"
pnpm new-album "My Album Title"
```

Then edit the generated file, add any images under `public/images`, and run:

```powershell
pnpm run audit-images
pnpm run build
```

## Publishing

Local hosting does not require any external service:

```powershell
pnpm run host
```

This repo also includes `.github/workflows/pages.yml`. If you later enable GitHub Pages and push to `main`, the workflow
builds the same static site and publishes the `out/` folder. For a project repository, it automatically sets the base path
to the repository name.

## Validation

```powershell
pnpm run lint
pnpm run typecheck
pnpm run audit-images
pnpm run test
```

The build generates:

- `public/sitemap.xml`
- `public/robots.txt`
- `public/rss.xml`
- `public/.nojekyll`
