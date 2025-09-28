import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { GlobalErrorHandler, initializeAppSync } from "@/shared/components";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shopify Smart Pricing - Increase Your Store Revenue",
  description: "AI-powered pricing optimization for Shopify stores. Increase revenue with smart pricing strategies, dynamic pricing, and automated price adjustments.",
};

// Initialize the application and validate environment variables
const isInitialized = initializeAppSync();
if (!isInitialized) {
  console.error('❌ Application failed to initialize - check environment variables');
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalErrorHandler>
          {children}
        </GlobalErrorHandler>
      </body>
    </html>
  );
}
