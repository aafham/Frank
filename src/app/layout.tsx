import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PwaRegister } from "@/components/pwa-register";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const siteUrl = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://frank.vercel.app"),
);

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "FRANK | Premium Minimal Streetwear",
  description:
    "FRANK creates timeless everyday clothing with premium quality, minimalist aesthetics, and quiet confidence.",
  applicationName: "FRANK",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/icon.svg", type: "image/svg+xml" }],
  },
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "FRANK",
    title: "FRANK | Premium Minimal Streetwear",
    description:
      "A luxury editorial commerce experience for timeless everyday clothing.",
    images: ["/images/frank-hero.png"],
  },
  twitter: {
    card: "summary_large_image",
    title: "FRANK | Premium Minimal Streetwear",
    description:
      "Timeless everyday clothing with premium quality and minimalist aesthetics.",
    images: ["/images/frank-hero.png"],
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
      className={`${geistSans.variable} ${geistMono.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <PwaRegister />
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
