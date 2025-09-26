import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "খোঁজ চ্যাট - AI-চালিত বাংলা চ্যাটবট | Khoj Chat",
  description: "বাংলা ভাষায় AI-চালিত চ্যাটবট। যেকোনো প্রশ্নের উত্তর পান। তথ্য যাচাই, প্রশ্নোত্তর এবং সহায়তা।",
  keywords: [
    "খোঁজ চ্যাট", "Khoj Chat", "বাংলা চ্যাটবট", "AI চ্যাটবট", "বাংলা AI", 
    "চ্যাটবট", "প্রশ্নোত্তর", "তথ্য যাচাই", "AI সহায়তা", "খোঁজ"
  ].join(", "),
  openGraph: {
    title: "খোঁজ চ্যাট - AI-চালিত বাংলা চ্যাটবট",
    description: "বাংলা ভাষায় AI-চালিত চ্যাটবট। যেকোনো প্রশ্নের উত্তর পান।",
    images: ['/khoj-chat-logo.png'],
    url: 'https://khoj-bd.com/khoj-chat',
  },
  twitter: {
    card: 'summary_large_image',
    title: "খোঁজ চ্যাট - AI-চালিত বাংলা চ্যাটবট",
    description: "বাংলা ভাষায় AI-চালিত চ্যাটবট। যেকোনো প্রশ্নের উত্তর পান।",
    images: ['/khoj-chat-logo.png'],
  },
  alternates: {
    canonical: '/khoj-chat',
  },
};
