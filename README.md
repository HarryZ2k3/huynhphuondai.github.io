# Harry Huynh Personal Website

Local-first personal website and IT engineering portfolio. It has no ChatGPT
sign-in gate and no external hosting dependency by default.

## Run Locally

```powershell
pnpm install
pnpm run build
pnpm run host
```

Open `http://localhost:5173` on this computer. For another device on the same
network, use this computer's local IP address with port `5173`.

## Content

- Main profile, work, gallery, and blog content lives in `app/page.tsx`.
- Personal photos can be added under `public/gallery/`.
- Styling and animations live in `app/globals.css`.
- Smooth section movement and active navigation live in `app/MotionController.tsx`.

## Notes

The site is designed to be hosted from this machine. Publishing it to any
external service should be an intentional separate step.
