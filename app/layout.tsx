import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";

// convex client context
import { ConvexClientProvider } from "./ConvexClientProvider";

export const metadata: Metadata = {
  title: "খোঁজ - বাংলা ভাষার প্রথম এআই-চালিত ফ্যাক্টচেকিং প্ল্যাটফর্ম, First AI-powered Fact Checking Platform in Bengali",
  description: "বাংলা ভাষায় সত্যতা যাচাইয়ের জন্য AI-চালিত প্ল্যাটফর্ম",
  keywords: "fact checking, bengali, AI, khoj, সত্যতা যাচাই, বাংলা",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Tiro+Bangla&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-tiro-bangla">
        <Providers>
          <Navbar />
          <ConvexClientProvider>{children}</ConvexClientProvider>
        </Providers>
      </body>
    </html>
  );
}
