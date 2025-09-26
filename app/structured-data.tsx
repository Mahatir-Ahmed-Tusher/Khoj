export default function StructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "খোঁজ",
    "alternateName": "Khoj",
    "url": "https://khoj-bd.com",
    "description": "বাংলা ভাষায় সত্যতা যাচাইয়ের জন্য AI-চালিত প্ল্যাটফর্ম",
    "inLanguage": "bn-BD",
    "publisher": {
      "@type": "Organization",
      "name": "খোঁজ টিম",
      "url": "https://khoj-bd.com",
      "logo": {
        "@type": "ImageObject",
        "url": "https://khoj-bd.com/khoj-logo.png"
      }
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://khoj-bd.com/factcheck-detail?query={search_term_string}",
      "query-input": "required name=search_term_string"
    },
    "mainEntity": {
      "@type": "SoftwareApplication",
      "name": "খোঁজ ফ্যাক্টচেকার",
      "applicationCategory": "Fact Checking Application",
      "operatingSystem": "Web Browser",
      "description": "AI-powered Bengali fact checking platform",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "BDT"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  );
}
