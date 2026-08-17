import type { Metadata } from "next";
import { MotionController } from "@/components/MotionController";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { assetPath, siteUrl } from "@/lib/site";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Harry Huynh | Personal Website",
    template: "%s | Harry Huynh",
  },
  description:
    "Personal website and portfolio for Harry Huynh, an Information Technology Engineer sharing work, writing, and photography.",
  openGraph: {
    title: "Harry Huynh | Personal Website",
    description:
      "Systems work, writing, photography, and a file-based personal archive maintained through Git.",
    type: "website",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Harry Huynh | Personal Website",
    description:
      "Systems work, writing, photography, and a file-based personal archive maintained through Git.",
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
    <html lang="en">
      <body>
        <MotionController />
        <SiteHeader />
        <main id="top">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
