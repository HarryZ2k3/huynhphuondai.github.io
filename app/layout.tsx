import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Harry Huynh | Personal Website",
  description:
    "Personal website and portfolio for Harry Huynh, an Information Technology Engineer sharing work, writing, and personal moments.",
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
