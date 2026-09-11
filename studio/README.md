# Portfolio Studio

This is a local-only editor, separate from the static GitHub Pages website.

## Open

In Ubuntu WSL:

```sh
cd ~/projects/personal-portfolio
pnpm install
pnpm studio
```

Open http://localhost:5174. Keep the terminal running. Ctrl+C stops Studio.
The repository also includes Open Portfolio Studio.cmd for this computer's
Ubuntu/user/project paths. Open it from Windows Explorer. If the browser opens
before Studio is ready, refresh after the terminal prints the URL.

The public development site is a separate process: `pnpm dev` at
http://localhost:5173. Both listeners bind to loopback, not your LAN.
Do not forward their ports or expose either development server to the internet.

## Everyday use

1. Writing > New writing. Write with the formatting toolbar, set the section,
   description, date and tags. Changes autosave after a second. Resolve any
   "Not saved" message before closing the window.
2. Photos > Upload photos adds private uploads. New album lets you select them,
   describe each photograph, choose a cover, and reorder the collection.
3. Work edits project case studies. Profile edits the homepage introduction,
   biography, experience, education, links and portrait. Appearance changes the
   accent and homepage section visibility. Visitors choose their own night mode.
4. Save, then Preview. This builds an isolated copy of the actual website,
   including the current entry (or selected entries on Overview), outside Git.
   Open preview when the build completes. Other local drafts are not included.
5. For an article you intend to publish, uncheck "Keep as private draft".
   Review & publish lists the exact files, then requires a separate confirmation.
   A new upload becomes public only when referenced by selected content.
6. After pushing, check the linked GitHub Actions deployment. "Commit pushed"
   does NOT mean the website is live yet.

## First publication

Studio deliberately refuses to publish while the source checkout is dirty.
Review the website implementation changes, commit them and push main using your
normal Git workflow first. Do not blindly stage private files. GitHub Pages
must be configured to deploy using the repository's GitHub Actions workflow.

Your WSL Git installation needs a configured user.name/user.email and working
GitHub credentials (SSH or a credential helper). Studio does not store tokens or
provide a GitHub login page. If local main and GitHub differ, sync them manually.
Publishing builds in a separate clone, commits only reviewed content and uploads,
and pushes without force. The source checkout is fast-forwarded only if unchanged.
Failed attempts retain their private clone for manual diagnosis. Never blindly
retry a push after a network error: check GitHub first because it may have arrived.

## Privacy and limits

- Drafts and original uploaded PDFs are under
  ~/.local/share/portfolio-studio/<project-id>/, NOT in the Git repository.
  The exact directory is printed when Studio starts. It also holds previews.
- Export private backup downloads drafts and uploaded files in one JSON file.
  Keep it outside the repository and back it up to a safe disk. Automatic save
  also preserves one previous drafts.json. Backup restore is manual in this
  first version; keep the entire private directory for the simplest recovery.
- This editor has no remote access or accounts. Other software/users with access
  to your computer can potentially read local data. Do not use it on a shared PC.
- Upload limit: 20 MB per file, 40 megapixels per decoded image. Images become
  metadata-stripped WebP, at most 2200 pixels per side. Keep original photographs
  separately. Upload JPEG, PNG, WebP or AVIF; no videos, animated GIFs or SVG uploads.
- PDF files are not sanitized or redacted. Review phone/address/referee details
  yourself before explicitly approving publication. Never upload someone else's
  confidential information.
- The rich-text editor supports paragraphs, headings, emphasis, lists, quotes,
  links, code and images. It is not a page builder. Advanced Markdown/raw HTML
  can normalize during editing; Tiptap's Markdown integration is still beta.
  Source Git history remains the recovery path for existing public content.
- Existing page URLs cannot be renamed in Studio, avoiding broken incoming links.
  Do not move or rename content files outside Studio while editing them.
- Private uploads are retained even after publication; media deletion and backup
  restore UI are not included yet. Referenced published images are never deleted
  automatically when a page is unpublished.
- Unpublish removes a page on the next deployment; it does not erase Git history,
  cached copies, or previously published media. A future date does not schedule
  publication: a successful deployment is required.
- GitHub Pages serves static files only: no server-side forms, private reader
  accounts, native comments or automatic scheduled publishing in this version.
  Your computer can be off after GitHub successfully deploys.
- No deployment-success claim is made automatically. The Actions link is the
  source of truth until automatic deployment tracking is added.

## Verification

```sh
pnpm test:studio
pnpm typecheck
pnpm lint
pnpm build
```

For isolated UI tests, set STUDIO_DATA_DIR to a temporary directory outside the
repository, STUDIO_PORT to a free port, and STUDIO_DISABLE_PUBLISH=1.
