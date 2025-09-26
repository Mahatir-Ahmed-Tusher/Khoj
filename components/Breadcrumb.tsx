'use client';

import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": item.href ? `https://khoj-bd.com${item.href}` : undefined
    }))
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }}
      />
      <nav className={`flex items-center space-x-2 text-sm text-gray-600 ${className}`} aria-label="Breadcrumb">
        <Link href="/" className="flex items-center hover:text-gray-900 transition-colors">
          <Home className="h-4 w-4" />
          <span className="ml-1 font-tiro-bangla">হোম</span>
        </Link>
        
        {items.map((item, index) => (
          <div key={index} className="flex items-center space-x-2">
            <ChevronRight className="h-4 w-4 text-gray-400" />
            {item.href ? (
              <Link 
                href={item.href} 
                className="hover:text-gray-900 transition-colors font-tiro-bangla"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-gray-900 font-medium font-tiro-bangla">
                {item.label}
              </span>
            )}
          </div>
        ))}
      </nav>
    </>
  );
}
