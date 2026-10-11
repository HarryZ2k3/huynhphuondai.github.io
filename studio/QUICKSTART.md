# Portfolio Studio: Quick Guide

Open the Portfolio Studio desktop shortcut, then use http://localhost:5174.
Keep its terminal running. All edits stay private until you review and publish.

## Update Your Introduction
1. Choose **Edit introduction** on Overview, or **Profile > Introduction**.
2. Edit your headline, homepage summary, portrait, or personal introduction.
3. Set the About page heading and introduction, then update biography paragraphs.
4. Wait for **Saved locally**, then **Preview > Open preview**.

Blank About heading and introduction fields use your name and homepage summary.

## Replace or Hide Your CV
1. Open **Profile > CV & career**.
2. Beside **Public CV (PDF)**, choose and upload your PDF. Use **View PDF** to check it.
3. Set the CV button label and **Show CV download**. Below are experience,
   education, skills, languages, and qualifications; use arrows to reorder entries.
4. Preview. Then **Review & publish**, approve the PDF privacy check, and confirm.

PDFs are not redacted. Remove private addresses, phone numbers, and referee details
before uploading. Hiding/removing the link does not delete the old PDF or Git history.
Studio replaces the PDF; it does not edit the PDF's contents or generate it from your profile.

## Change Page Text and Appearance
1. Open **Page text** and choose Home, Work, Writing, Photos, About, or Contact.
2. Navigation edits menu labels; Footer edits the tagline and link visibility;
   Search & sharing sets the title suffix, description, and sharing image.
3. Open **Appearance** for accent, heading style, article text size, animations,
   and homepage section visibility. Reduced-motion preferences always take priority.
4. To preview several changed entries together, select them on **Overview**,
   then choose **Preview**. Unselected drafts are not included.

Menu labels do not change URLs. These controls edit the existing layout, not arbitrary
code or new page types. Visitors retain their own light/dark mode preference.

## Write and Publish an Article
1. Open **Writing > New writing**. Enter a title, write, and set the date and section.
2. Insert photos with the image toolbar button. Wait for **Saved locally**.
3. Preview, then check **Ready for publication** when the article is ready.
4. Choose **Review & publish**, inspect the files, then **Publish reviewed changes**.
5. Follow **Check deployment**. A pushed commit is not a completed deployment.

Future dates do not schedule publication. GitHub must successfully deploy each update.

## Manage Photos and Project Images
1. Use **Photos > Upload photos**, then create or open an album.
2. Add photographs, describe them with alt text and captions, pick a cover,
   and use the arrow buttons to reorder. Preview and publish the selected album.
3. For project images, open **Work**, select a project, and use **Add screenshot**.

Uploads support JPEG, PNG, WebP, and AVIF up to 20 MB and 40 megapixels. Studio
converts images to WebP. Keep original photographs separately.

## Unpublish or Undo Local Edits
- Published entry: **Prepare unpublish > Review & publish > Publish reviewed changes**.
- Private draft: **Discard local draft**. On a published entry, this discards only
  unpublished edits, not the public page. It also cancels a prepared unpublish.
- Removing an album or article does not delete its images, Git history, or cached copies.

## Backup and Troubleshoot
- **Export private backup** downloads your drafts and uploads. Store it outside the
  repository. Restore is manual; retain the private data directory printed at startup.
- **Not saved**: keep the tab open and resolve the error before closing it.
- **Ready for publication**: check that setting in the article editor.
- GitHub authentication error: WSL Git needs a working GitHub credential helper.
- Local and GitHub differ / uncommitted files: sync or commit reviewed code changes
  first. Do not discard unknown changes or blindly retry a failed push.
- Failed deployment: check GitHub Actions before retrying. Your content may already
  be committed even when the previous public website is still showing.

Studio is local-only. Do not expose port 5174 to the internet. The public website
stays online on GitHub Pages after your computer is switched off.
