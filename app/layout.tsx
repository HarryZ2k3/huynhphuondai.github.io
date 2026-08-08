import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Harry Huynh | Information Technology Engineer",
  description:
    "Professional portfolio for Harry Huynh, an Information Technology Engineer focused on reliable systems and practical support.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
