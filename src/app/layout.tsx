import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JOULERY | Creative Handcrafted Items",
  description: "Exclusive collection of handwoven necklaces and bracelets. Crafted in the Philippines for the love of the game.",
  keywords: ["handcrafted jewelry", "philippines jewelry", "handwoven necklace", "artisan bracelets", "joulery", "creative handcrafted items"],
  authors: [{ name: "Joulery" }],
  openGraph: {
    title: "JOULERY | Creative Handcrafted Items",
    description: "Exclusive collection of handwoven necklaces and bracelets from the Philippines.",
    url: "https://joulery.com",
    siteName: "JOULERY",
    images: [
      {
        url: "/images/aquamarine.png",
        width: 1200,
        height: 630,
        alt: "JOULERY Creative Handcrafted Items",
      },
    ],
    locale: "en_PH",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "JOULERY | Creative Handcrafted Items",
    description: "Exclusive collection of handwoven necklaces and bracelets from the Philippines.",
    images: ["/images/aquamarine.png"],
  },
  icons: {
    icon: "/images/aquamarine-nobg.ico",
    apple: "/images/aquamarine-nobg.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
