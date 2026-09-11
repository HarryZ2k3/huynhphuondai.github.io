import type { Metadata } from "next";
import { MotionController } from "@/components/MotionController";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { assetPath, siteUrl } from "@/lib/site";
import { getAppearance, getProfile } from "@/lib/content";
import "./globals.css";

const profile = getProfile();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${profile.name} | IT Engineer & Writer`,
    template: `%s | ${profile.name}`,
  },
  description:
    profile.hero.summary,
  openGraph: {
    title: "Harry Huynh | Personal Website",
    description:
      profile.hero.summary,
    type: "website",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Harry Huynh | Personal Website",
    description:
      profile.hero.summary,
  },
  icons: {
    icon: assetPath("/favicon.svg"),
    shortcut: assetPath("/favicon.svg"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-accent={getAppearance().accent} suppressHydrationWarning>
      <head><script dangerouslySetInnerHTML={{ __html: `try{var t=localStorage.getItem('portfolio-theme');document.documentElement.dataset.theme=t==='light'||t==='dark'?t:matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}catch(e){document.documentElement.dataset.theme=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'}` }} /></head>
      <body>
        <a className="skip-link" href="#main-content">Skip to content</a>
        <MotionController />
        <SiteHeader name={profile.name} />
        <main id="main-content" tabIndex={-1}>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
