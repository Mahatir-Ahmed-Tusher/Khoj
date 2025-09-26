import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ব্লগ - খোঁজ | ডিজিটাল সাক্ষরতা ও তথ্য যাচাই",
  description: "ডিজিটাল সাক্ষরতা, তথ্য যাচাই, মিথ্যা তথ্য প্রতিরোধ এবং বিজ্ঞান সম্পর্কে ব্লগ পোস্ট।",
  keywords: [
    "ব্লগ", "blog", "ডিজিটাল সাক্ষরতা", "তথ্য যাচাই", "মিথ্যা তথ্য", "বিজ্ঞান", 
    "খোঁজ", "শিক্ষামূলক", "তথ্য", "সাক্ষরতা"
  ].join(", "),
  openGraph: {
    title: "ব্লগ - খোঁজ | ডিজিটাল সাক্ষরতা ও তথ্য যাচাই",
    description: "ডিজিটাল সাক্ষরতা, তথ্য যাচাই, মিথ্যা তথ্য প্রতিরোধ এবং বিজ্ঞান সম্পর্কে ব্লগ পোস্ট।",
    images: ['/blog-icon.png'],
    url: 'https://khoj-bd.com/blog',
  },
  twitter: {
    card: 'summary_large_image',
    title: "ব্লগ - খোঁজ | ডিজিটাল সাক্ষরতা ও তথ্য যাচাই",
    description: "ডিজিটাল সাক্ষরতা, তথ্য যাচাই, মিথ্যা তথ্য প্রতিরোধ এবং বিজ্ঞান সম্পর্কে ব্লগ পোস্ট।",
    images: ['/blog-icon.png'],
  },
  alternates: {
    canonical: '/blog',
  },
};
