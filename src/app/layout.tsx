import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
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

const siteUrl = new URL("https://frnkplus.vercel.app");

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "FRNK+ | Premium Minimal Streetwear",
  description:
    "FRNK+ creates premium minimal streetwear with dark essentials, smart silhouettes, and quiet confidence.",
  applicationName: "FRNK+",
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
    siteName: "FRNK+",
    title: "FRNK+ | Premium Minimal Streetwear",
    description:
      "A premium minimal streetwear experience in black, dark brown, and white.",
    images: ["/images/frnkplus-black-studio.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "FRNK+ | Premium Minimal Streetwear",
    description:
      "Premium minimal streetwear with dark essentials and smart silhouettes.",
    images: ["/images/frnkplus-black-studio.jpg"],
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
        <Analytics />
      </body>
    </html>
  );
}
