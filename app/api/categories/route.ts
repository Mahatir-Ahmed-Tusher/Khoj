import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Define the categories for Mukti Corner
    const categories = [
      {
        id: "general",
        name: "একাত্তোর",
        description: "বাংলাদেশের মুক্তিযুদ্ধ সম্পর্কে সাধারণ প্রশ্ন"
      },
      {
        id: "genocide",
        name: "গণহত্যা",
        description: "১৯৭১ সালের গণহত্যা সম্পর্কে বিস্তারিত তথ্য",
        subcategories: [
          {"id": "statistical", "name": "স্ট্যাটিস্টিক্যাল প্রমাণ"},
          {"id": "historical", "name": "ঐতিহাসিক প্রমাণ"}
        ]
      },
      {
        id: "rape",
        name: "ধর্ষণ",
        description: "পাকিস্তানি সেনাবাহিনীর দ্বারা সংঘটিত ধর্ষণের বিবরণ"
      },
      {
        id: "muktibahini",
        name: "মুক্তিবাহিনী",
        description: "মুক্তিবাহিনীর গঠন, নেতৃত্ব ও যুদ্ধের বিবরণ"
      },
      {
        id: "international",
        name: "আন্তর্জাতিক প্রতিক্রিয়া",
        description: "ভারত, জাতিসংঘ ও অন্যান্য দেশের ভূমিকা"
      },
      {
        id: "leaders",
        name: "নেতৃবৃন্দ",
        description: "শেখ মুজিবুর রহমান, জিয়াউর রহমান ও অন্যান্য নেতাদের ভূমিকা"
      }
    ]

    return NextResponse.json({
      categories: categories
    })

  } catch (error) {
    console.error('Categories API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}
