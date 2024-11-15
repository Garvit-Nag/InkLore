import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "InkLore - Weaving the Magic of Words",
  description: "AI Story Generator",
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