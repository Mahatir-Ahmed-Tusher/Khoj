'use client';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQSchemaProps {
  faqs: FAQItem[];
}

export default function FAQSchema({ faqs }: FAQSchemaProps) {
  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqData) }}
    />
  );
}

// Common FAQs for the site
export const commonFAQs: FAQItem[] = [
  {
    question: "খোঁজ কি?",
    answer: "খোঁজ হল বাংলা ভাষার প্রথম AI-চালিত ফ্যাক্টচেকিং প্ল্যাটফর্ম। আমরা মিথ্যা তথ্য প্রতিরোধ এবং সত্যতা যাচাইয়ের জন্য কাজ করি।"
  },
  {
    question: "খোঁজ কিভাবে কাজ করে?",
    answer: "খোঁজ AI প্রযুক্তি ব্যবহার করে তথ্যের সত্যতা যাচাই করে। আমরা বিভিন্ন উৎস থেকে তথ্য সংগ্রহ করে বিশ্লেষণ করি।"
  },
  {
    question: "খোঁজ কি বিনামূল্যে?",
    answer: "হ্যাঁ, খোঁজ সম্পূর্ণ বিনামূল্যে ব্যবহার করা যায়।"
  },
  {
    question: "মিথবাস্টিং কি?",
    answer: "মিথবাস্টিং হল বৈজ্ঞানিক দাবি, কুসংস্কার এবং অপবিজ্ঞান সম্পর্কে সঠিক তথ্য প্রদান করা।"
  },
  {
    question: "খোঁজ চ্যাট কি?",
    answer: "খোঁজ চ্যাট হল AI-চালিত বাংলা চ্যাটবট যা যেকোনো প্রশ্নের উত্তর দিতে পারে।"
  }
];
