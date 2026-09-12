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

## Safe Public Hosting With GitHub Pages

The safest public option for this site is GitHub Pages because the site exports to plain static files. Visitors receive
HTML, CSS, JavaScript, and images only. Your computer does not need to be exposed to the internet, and there is no login
or backend admin area to secure.

### One-Time GitHub Setup

1. Push this repository to GitHub.
2. Open the repository on GitHub.
3. Go to `Settings` -> `Pages`.
4. Under `Build and deployment`, set `Source` to `GitHub Actions`.
5. Save the setting if GitHub asks you to.

This repo already includes `.github/workflows/pages.yml`. After GitHub Pages is set to GitHub Actions, every push to
`main` runs validation, builds the static site, uploads `out/`, and publishes it.

For this repository, the public URL should be:

```text
https://harryz2k3.github.io/huynhphuondai.github.io/
```

### Publishing Updates

Edit content files, then run:

```powershell
pnpm run lint
pnpm run typecheck
pnpm run audit-images
pnpm run build
pnpm run test
```

Commit and push:

```powershell
git add .
git commit -m "Update personal site"
git push origin main
```

GitHub Actions will publish the update. Check the `Actions` tab if the site does not update after a few minutes.

### Safety Notes

- Do not put private keys, passwords, private addresses, or private client details in `content/` or `public/`.
- Keep personal photos intentional. Anything in `public/images/` can become visible online.
- Prefer GitHub Pages over router port forwarding. Port forwarding exposes your computer; GitHub Pages only serves the
  static website.
- If you add a custom domain later, configure it in GitHub Pages settings and keep HTTPS enabled.

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

## Personalizing the Design

- Add your confirmed biography, email, experience, and tools in `content/profile.json`.
- Set `resumeFile` to a public path such as `/documents/resume.pdf` only after adding a public-safe PDF. The download link is hidden when this field is absent.
- Set `portraitImage` to a real image path. The About page hides the starter portrait.
- Project `kind` distinguishes professional work, personal projects, and concept studies. Existing examples are labelled concept studies.
- Posts support `section: Technical`, `section: Essays`, or `section: Journal`. New posts start as drafts; set `draft: false` when ready to publish.
- Albums marked `sample: true` are labelled preview collections. Replace illustrations with your photographs and set `sample: false` when ready.
- Home shows two featured projects and the three latest published posts, including non-featured posts.
# Local Editing

Run `pnpm studio` in Ubuntu WSL, then open http://localhost:5174.
The private editor includes writing, photos, projects, profile, appearance,
and a separate review-and-publish step. See [Studio guide](studio/README.md)
for first-publication setup, privacy limits, and backup instructions.
The public site includes a persistent day/night toggle and remains fully static.
