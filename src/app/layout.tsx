import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import "./globals.css";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Main title and description for SEO
  title: "Picme AI – Effortless Image Management with AI",
  description:
    "Picme AI is an advanced platform for effortless image management and organization. Harness the power of artificial intelligence to sort, tag, and search your photos with blazing speed and accuracy.",

  // Keywords relevant to your product
  keywords: [
    "Picme AI",
    "AI image management",
    "photo organization",
    "image search",
    "automatic photo tagging",
    "artificial intelligence",
    "Next.js",
    "TypeScript",
    "image platform",
    "picture management",
  ],

  // Canonical link to avoid duplicate content issues
  alternates: {
    canonical: "https://picme-ai.vercel.app/",
  },

  openGraph: {
    title: "Picme AI – Effortless Image Management with AI",
    description:
      "Say goodbye to cluttered photo libraries! Picme AI helps you organize and find your images using cutting-edge artificial intelligence.",
    url: "https://picme-ai.vercel.app/",
    siteName: "Picme AI",
    images: [
      {
        url: "https://picme-ai.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "Picme AI – Smart Image Management",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Picme AI – Effortless Image Management with AI",
    description:
      "Harness the power of AI to manage, tag & search your photo collection instantly.",
    images: ["https://picme-ai.vercel.app/og-image.png"],
  },

  authors: [{ name: "Adarsh Chaudhary", url: "https://adarshchaudhary.com" }],
  creator: "Adarsh Chaudhary",
  publisher: "Picme AI",

  themeColor: "#18181B",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
      >
        <Toaster richColors />
        {children}
      </body>
    </html>
  );
}
