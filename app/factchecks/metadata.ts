import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ফ্যাক্টচেক সমূহ - খোঁজ | যাচাইকৃত তথ্য ও দাবি",
  description: "সব ফ্যাক্টচেক রিপোর্ট দেখুন। যাচাইকৃত তথ্য, সত্যতা যাচাই এবং মিথ্যা তথ্য খন্ডন।",
  keywords: [
    "ফ্যাক্টচেক", "fact check", "যাচাইকৃত তথ্য", "সত্যতা যাচাই", "মিথ্যা তথ্য", 
    "খোঁজ", "তথ্য যাচাই", "দাবি যাচাই", "বাংলা ফ্যাক্টচেকার"
  ].join(", "),
  openGraph: {
    title: "ফ্যাক্টচেক সমূহ - খোঁজ | যাচাইকৃত তথ্য ও দাবি",
    description: "সব ফ্যাক্টচেক রিপোর্ট দেখুন। যাচাইকৃত তথ্য, সত্যতা যাচাই এবং মিথ্যা তথ্য খন্ডন।",
    images: ['/khoj-banner.png'],
    url: 'https://khoj-bd.com/factchecks',
  },
  twitter: {
    card: 'summary_large_image',
    title: "ফ্যাক্টচেক সমূহ - খোঁজ | যাচাইকৃত তথ্য ও দাবি",
    description: "সব ফ্যাক্টচেক রিপোর্ট দেখুন। যাচাইকৃত তথ্য, সত্যতা যাচাই এবং মিথ্যা তথ্য খন্ডন।",
    images: ['/khoj-banner.png'],
  },
  alternates: {
    canonical: '/factchecks',
  },
};
