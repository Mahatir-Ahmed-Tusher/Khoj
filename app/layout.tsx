import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar";
import StructuredData from "./structured-data";

// convex client context
import { ConvexClientProvider } from "./ConvexClientProvider";

export const metadata: Metadata = {
  title: "খোঁজ - বাংলা ভাষার প্রথম AI-চালিত ফ্যাক্টচেকিং প্ল্যাটফর্ম | Khoj",
  description:
    "খোঁজ - বাংলা ভাষার প্রথম AI-চালিত ফ্যাক্টচেকিং প্ল্যাটফর্ম। খবর, ছবি, লেখা এবং তথ্যের সত্যতা যাচাই করুন। অসত্য তথ্য প্রতিরোধ করুন।",
  keywords: [
    "খোঁজ",
    "Khoj",
    "বাংলা ফ্যাক্টচেকার",
    "Bengali AI fact checker",
    "AI Fact checker",
    "ফ্যাক্টচেকিং",
    "fact checking",
    "সত্যতা যাচাই",
    "অসত্য তথ্য",
    "misinformation",
    "বাংলা এআই",
    "Bengali AI",
    "খবর যাচাই",
    "news verification",
    "মিথবাস্টিং",
    "mythbusting",
    "ডিজিটাল সাক্ষরতা",
    "digital literacy",
    "তথ্য যাচাই",
    "information verification",
    "বাংলাদেশ",
    "Bangladesh",
    "সোশ্যাল মিডিয়া",
    "social media",
    "গুজব",
    "rumor",
  ].join(", "),
  authors: [{ name: "খোঁজ টিম", url: "https://khoj-bd.com" }],
  creator: "খোঁজ টিম",
  publisher: "খোঁজ",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://khoj-bd.com"),
  alternates: {
    canonical: "/",
    languages: {
      "bn-BD": "/",
      "en-US": "/en",
    },
  },
  openGraph: {
    title: "খোঁজ - বাংলা ভাষার প্রথম AI-চালিত ফ্যাক্টচেকিং প্ল্যাটফর্ম",
    description:
      "খোঁজ - বাংলা ভাষার প্রথম AI-চালিত ফ্যাক্টচেকিং প্ল্যাটফর্ম। খবর, ছবি, লেখা এবং তথ্যের সত্যতা যাচাই করুন।",
    url: "https://khoj-bd.com",
    siteName: "খোঁজ",
    images: [
      {
        url: "/khoj-banner.png",
        width: 1200,
        height: 630,
        alt: "খোঁজ - বাংলা ভাষার প্রথম AI-চালিত ফ্যাক্টচেকিং প্ল্যাটফর্ম",
      },
    ],
    locale: "bn_BD",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "খোঁজ - বাংলা ভাষার প্রথম AI-চালিত ফ্যাক্টচেকিং প্ল্যাটফর্ম",
    description:
      "খোঁজ - বাংলা ভাষার প্রথম AI-চালিত ফ্যাক্টচেকিং প্ল্যাটফর্ম। খবর, ছবি, লেখা এবং তথ্যের সত্যতা যাচাই করুন।",
    images: ["/khoj-banner.png"],
    creator: "@khoj_bd",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
    yahoo: "your-yahoo-verification-code",
  },
  category: "technology",
  classification: "Fact Checking Platform",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.ico", sizes: "16x16" },
      { url: "/favicon.ico", sizes: "32x32" },
    ],
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
  manifest: "/manifest.json",
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
        <StructuredData />
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
