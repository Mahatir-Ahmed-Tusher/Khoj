"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Footer from "@/components/Footer";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";
import { getLatestArticles } from "@/lib/data";
import {
  visitTracker,
  isFirstVisit,
  isNewSession,
  hasSeenTour,
  markTourAsSeen,
} from "@/lib/visit-tracker";
import { ChevronUp, ChevronDown } from "lucide-react";
import {
  detectInputType,
  classifyQuery,
  getVerdictLabel,
  normalizeVerdict,
} from "@/lib/utils";
import ImageOptionsModal from "@/components/ImageOptionsModal";
// import FloatingBall from "@/components/FloatingBall"; // Disabled - Recent News FAB
import Toaster from "@/components/Toaster";

// Blog data
interface BlogPost {
  id: string;
  title: string;
  author: string;
  thumbnail: string;
  excerpt: string;
  tags: string[];
  publishDate: string;
  readTime: string;
  slug: string;
}

// All blog posts with proper date sorting
const allBlogs: BlogPost[] = [
  {
    id: "7",
    title: "কী কী আছে এই খোঁজ-এ?",
    author: "সাগর চন্দ্র দে",
    thumbnail: "https://i.postimg.cc/TwF5YmsF/Khoj-features.png",
    excerpt:
      "আজকের এই প্রযুক্তির যুগে চারপাশে তথ্যের অবিরাম স্রোত। কিন্তু সেই স্রোতের ভেতরে আসল তথ্য আর মিথ্যা আলাদা করা কি এত সহজ? ফেসবুকের নিউজফিড, হোয়াটসঅ্যাপ-টেলিগ্রামের গ্রুপ চ্যাট কিংবা বিভিন্ন নিউজ অ্যাপ—সবখানেই ভেসে বেড়ায় মিথ্যা খবর, গুজব আর অর্ধসত্য।",
    tags: ["খোঁজ", "এআই", "ফ্যাক্টচেকিং", "মিথবাস্টিং", "মুক্তিযুদ্ধ কর্নার"],
    publishDate: "২৭ সেপ্টেম্বর, ২০২৫",
    readTime: "১০ মিনিট",
    slug: "khoj-features-overview",
  },
  {
    id: "6",
    title:
      "হ্যাকেলের সেকেলে মতবাদ দিয়ে প্রজাতির বিবর্তনকে প্রশ্নবিদ্ধ করা যায়?",
    author: "মাহাথির আহমেদ তুষার",
    thumbnail: "https://i.postimg.cc/7LQDP7Kn/image.png",
    excerpt:
      "আপনার হাতে সময় থাকলে চলুন, একটা ব্যাপার নিয়ে আলোচনা করি। ধরুন, আপনি কোয়ান্টাম মেকানিক্স নিয়ে একটা বই লিখতে চান। সেক্ষেত্রে আপনাকে প্রথমেই যে কাজটা করতে হবে—পাঠকদের এটা দেখাতে হবে যে, এই বৈজ্ঞানিক তত্ত্বটির দীর্ঘ যাত্রাপথে বিজ্ঞানীরা পরমাণুর অভ্যন্তরের ক্ষুদ্র জগতটিকে কিভাবে দেখেছেন।",
    tags: ["বিবর্তন", "হ্যাকেল", "ভ্রূণতত্ত্ব", "বিজ্ঞান", "মিথবাস্টিং"],
    publishDate: "১৭ এপ্রিল, ২০২৫",
    readTime: "১৮ মিনিট",
    slug: "haeckel-evolution-theory-criticism",
  },
  {
    id: "4",
    title: "খোঁজ, বাংলা ভাষার প্রথম এআই-চালিত ফ্যাক্টচেকারের অভিনব যাত্রা",
    author: "খোঁজ টিম",
    thumbnail: "https://i.postimg.cc/FFPY2NBX/image.png",
    excerpt:
      "আজকের এই প্রযুক্তির যুগে চারপাশে তথ্যের স্রোত বয়ে চলেছে। কিন্তু তার ভেতরে আসলটা কোথায়, মিথ্যাটা কোথায়, সে পার্থক্য করা কি সহজ? ফেসবুকের নিউজ ফিড, হোয়াটসঅ্যাপ-টেলিগ্রামের গ্রুপ চ্যাট, কিংবা নিউজ অ্যাপ। সব জায়গায় মিথ্যা খবর, গুজব আর অর্ধসত্য ভেসে বেড়ায়।",
    tags: ["খোঁজ", "এআই", "ফ্যাক্টচেকিং", "ডিজিটাল সাক্ষরতা"],
    publishDate: "১৫ সেপ্টেম্বর, ২০২৫",
    readTime: "১২ মিনিট",
    slug: "khoj-ai-factchecker-journey",
  },
  {
    id: "2",
    title:
      'বাংলা ভাষায় প্রথম পূর্ণাঙ্গ এআই-ভিত্তিক ফ্যাক্টচেকিং প্ল্যাটফর্ম হিসেবে "খোঁজ" – একটি বিস্তারিত যাচাই',
    author: "খোঁজ টিম (মাহাথির আহমেদ তুষার, সাগর চন্দ্র দে, তানিয়া চৈতি)",
    thumbnail: "https://i.postimg.cc/jd1mpLff/Khoj-banner.png",
    excerpt:
      "খোঁজ টিম হিসেবে আমরা বাংলাদেশের ডিজিটাল ল্যান্ডস্কেপে মিথ্যা তথ্যের বিরুদ্ধে লড়াই করার জন্য প্রতিশ্রুতিবদ্ধ। বাংলা ভাষায় কনটেন্টের দ্রুত বৃদ্ধির সাথে সাথে, মিসইনফরমেশনও বাড়ছে – বিশেষ করে সোশ্যাল মিডিয়া, নিউজ পোর্টাল এবং ভাইরাল পোস্টগুলোতে।",
    tags: [
      "খোঁজ",
      "এআই",
      "ফ্যাক্টচেকিং",
      "যাচাই",
      "বাংলা ভাষা",
      "মিথ্যা তথ্য প্রতিরোধ",
      "ওপেন সোর্স",
    ],
    publishDate: "৫ সেপ্টেম্বর, ২০২৫",
    readTime: "১২ মিনিট",
    slug: "khoj-ai-factchecker-verification",
  },
  {
    id: "3",
    title: "জলবায়ু পরিবর্তন: বৈজ্ঞানিক তথ্য বনাম ভুল ধারণা",
    author: "সালেহা ভুইয়া",
    thumbnail: "https://i.postimg.cc/zGV717ND/Your-paragraph-text-5.png",
    excerpt:
      "জলবায়ু পরিবর্তন শুধু বৈজ্ঞানিক ইস্যু নয়—এটি একসাথে রাজনৈতিক, অর্থনৈতিক, সামাজিক ও নৈতিক ইস্যু। পৃথিবীর প্রতিটি মানুষের জীবনে এর প্রভাব রয়েছে, অথচ এখনো অনেকেই একে অবহেলা করে বা ভুল বোঝে।",
    tags: ["জলবায়ু পরিবর্তন", "পরিবেশ", "বিজ্ঞান", "ভুল ধারণা"],
    publishDate: "৫ আগস্ট, ২০২৫",
    readTime: "১০ মিনিট",
    slug: "climate-change-science-vs-misconceptions",
  },
  {
    id: "5",
    title: "অপবিজ্ঞানের যতো বই",
    author: "মাহাথির আহমেদ তুষার",
    thumbnail: "https://i.postimg.cc/kGM8vQvt/image.png",
    excerpt:
      "চলুন আজকে সিউডোসায়েন্স প্রচার করা কিছু বইয়ের সাথে আপনাদের পরিচয় করাই, যেগুলিতে বাংলা ভাষাভাষীদের মধ্যে প্রচলিত অনেক অপবিজ্ঞানের উৎস রয়েছে৷ অপবিজ্ঞানের উৎস সন্ধান করতে এ প্রবন্ধে আমরা বেছে নিয়েছি কিছু বইকে।",
    tags: ["অপবিজ্ঞান", "সিউডোসায়েন্স", "বিজ্ঞান", "বই রিভিউ", "মিথবাস্টিং"],
    publishDate: "২ ফেব্রুয়ারি, ২০২৫",
    readTime: "১৫ মিনিট",
    slug: "pseudoscience-books-review",
  },
];

// Function to parse Bengali date and convert to sortable format
const parseBengaliDate = (dateStr: string): Date => {
  // Convert Bengali date to JavaScript Date
  const dateMap: { [key: string]: string } = {
    জানুয়ারি: "January",
    ফেব্রুয়ারি: "February",
    মার্চ: "March",
    এপ্রিল: "April",
    মে: "May",
    জুন: "June",
    জুলাই: "July",
    আগস্ট: "August",
    সেপ্টেম্বর: "September",
    অক্টোবর: "October",
    নভেম্বর: "November",
    ডিসেম্বর: "December",
  };

  // Convert Bengali numbers to English
  const bengaliToEnglish: { [key: string]: string } = {
    "০": "0",
    "১": "1",
    "২": "2",
    "৩": "3",
    "৪": "4",
    "৫": "5",
    "৬": "6",
    "৭": "7",
    "৮": "8",
    "৯": "9",
  };

  // Extract day, month, year from Bengali date
  // Remove comma if present
  const cleanDateStr = dateStr.replace(",", "");
  const parts = cleanDateStr.split(" ");
  const day = parts[0]
    .split("")
    .map((char) => bengaliToEnglish[char] || char)
    .join("");
  const month = dateMap[parts[1]];
  const year = parts[2]
    .split("")
    .map((char) => bengaliToEnglish[char] || char)
    .join("");

  // Debug: Log the parsed date
  console.log(`Parsing: ${dateStr} -> ${month} ${day}, ${year}`);

  return new Date(`${month} ${day}, ${year}`);
};

// Get latest 4 blogs sorted by date (most recent first)
const latestBlogs = allBlogs
  .sort(
    (a, b) =>
      parseBengaliDate(b.publishDate).getTime() -
      parseBengaliDate(a.publishDate).getTime()
  )
  .slice(0, 4);

// Custom Image component with error handling
const SafeImage = ({
  src,
  alt,
  className,
  fill,
  width,
  height,
  ...props
}: any) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc("/khoj.png"); // Fallback to local image
    }
  };

  // If fill is true, don't use width/height
  if (fill) {
    return (
      <Image
        src={imgSrc}
        alt={alt}
        className={className}
        onError={handleError}
        fill
        {...props}
      />
    );
  }

  // Otherwise use width/height
  return (
    <Image
      src={imgSrc}
      alt={alt}
      className={className}
      onError={handleError}
      width={width || 400}
      height={height || 300}
      {...props}
    />
  );
};

// Lazy load heavy components
const FeatureWidget = dynamic(() => import("@/components/FeatureWidget"), {
  loading: () => (
    <div className="w-80 h-64 bg-gray-100 rounded-lg animate-pulse" />
  ),
});
const AIFactCheckWidget = dynamic(
  () => import("@/components/AIFactCheckWidget"),
  {
    ssr: false,
    loading: () => (
      <div className="w-80 h-64 bg-gray-100 rounded-lg animate-pulse" />
    ),
  }
);

export default function HomePage() {
  // Memoize expensive data operations
  const allFactChecks = useMemo(() => getLatestArticles(10), []);
  const latestArticles = useMemo(
    () => allFactChecks.slice(0, 3),
    [allFactChecks]
  );

  const [filter, setFilter] = useState("all");
  const [filteredArticles, setFilteredArticles] = useState(allFactChecks);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [isNewsCheckActive, setIsNewsCheckActive] = useState(false);
  const [isMythbustingActive, setIsMythbustingActive] = useState(false);
  const [isAIImageCheckActive, setIsAIImageCheckActive] = useState(false);
  const [isImageSearchActive, setIsImageSearchActive] = useState(false);
  const [isTextCheckActive, setIsTextCheckActive] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isAtTop, setIsAtTop] = useState(true);
  const [isClassifying, setIsClassifying] = useState(false);
  const [heroImageIndex, setHeroImageIndex] = useState(0);
  const [heroBgUrl, setHeroBgUrl] = useState<string>("/khoj.png");
  // Image upload / modal state
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  // Hero GIF popup state - DISABLED
  // const [showHeroGif, setShowHeroGif] = useState(false);
  // const [gifCountdown, setGifCountdown] = useState(5);
  // const [gifActive, setGifActive] = useState(false);
  // const countdownIntervalRef = useRef<number | undefined>(undefined);
  // const hideTimeoutRef = useRef<number | undefined>(undefined);
  // const hasStartedOnceRef = useRef(false);
  // const popupStartMsRef = useRef<number | undefined>(undefined);

  // Track visit and check if first visit
  useEffect(() => {
    // Track this page visit
    visitTracker.trackVisit("home");

    // Rotate hero background image on each visit/refresh
    const heroImages = ["khoj.png", "khoj-2.png", "khoj-3.png"];
    const randomIndex = Math.floor(Math.random() * heroImages.length);
    setHeroImageIndex(randomIndex);

    // Check if mobile device
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, [isMobile]);

  // Resolve hero background with external-first, local-fallback (desktop & mobile)
  useEffect(() => {
    const desktopMappings = [
      { ext: "https://i.postimg.cc/5t3nKt5G/khoj.png", local: "/khoj.png" },
      { ext: "https://i.postimg.cc/PrmHfBm3/khoj-2.png", local: "/khoj-2.png" },
      { ext: "https://i.postimg.cc/15B0ZdVP/khoj-3.png", local: "/khoj-3.png" },
    ];
    const mobileMappings = [
      {
        ext: "https://i.postimg.cc/90qP2XTH/khoj-mobile.png",
        local: "/khoj-mobile.png",
      },
      {
        ext: "https://i.postimg.cc/PrmHfBm3/khoj-2.png",
        local: "/khoj-mobile-2.png",
      },
    ];

    // Choose mapping based on viewport and selected index
    const mapping = isMobile
      ? mobileMappings[heroImageIndex % mobileMappings.length]
      : desktopMappings[heroImageIndex];

    // Show local immediately to avoid blank while we try external
    setHeroBgUrl(mapping.local);

    // Attempt to load external; if loaded quickly, swap in
    const externalImg = new window.Image();
    let didFinish = false;
    const timeoutId = window.setTimeout(() => {
      // If external is slow, we keep local. We don't change state here unless needed.
      if (!didFinish) {
        didFinish = true; // lock in
      }
    }, 2000); // 2s safety timeout

    externalImg.onload = () => {
      if (!didFinish) {
        didFinish = true;
        window.clearTimeout(timeoutId);
        setHeroBgUrl(mapping.ext);
      }
    };
    externalImg.onerror = () => {
      if (!didFinish) {
        didFinish = true;
        window.clearTimeout(timeoutId);
        setHeroBgUrl(mapping.local);
      }
    };
    externalImg.src = mapping.ext;

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [isMobile, heroImageIndex]);

  // Timed Hero GIF popup - DISABLED
  // useEffect(() => {
  //   const startPopupCycle = () => {
  //     if (window.innerWidth < 768) return; // do not show on mobile
  //     if (gifActive) return; // avoid overlapping
  //     // Clear any previous timers just in case
  //     if (countdownIntervalRef.current)
  //       window.clearInterval(countdownIntervalRef.current);
  //     if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current);
  //     setGifActive(true);
  //     setGifCountdown(5);
  //     setShowHeroGif(true);
  //     popupStartMsRef.current = Date.now();

  //     // (No on-screen timer) Keep internal countdown if needed in future
  //     if (countdownIntervalRef.current)
  //       window.clearInterval(countdownIntervalRef.current);

  //     // Hide after exactly 5s
  //     hideTimeoutRef.current = window.setTimeout(() => {
  //       setShowHeroGif(false);
  //       setGifActive(false);
  //       setGifCountdown(5);
  //       if (countdownIntervalRef.current)
  //         window.clearInterval(countdownIntervalRef.current);
  //       popupStartMsRef.current = undefined;
  //     }, 5000);
  //     // Extra safety: force hide a bit later in case browser throttles timers
  //     window.setTimeout(() => {
  //       setShowHeroGif(false);
  //       setGifActive(false);
  //     }, 6000);
  //   };

  //   // Show once on mount for desktop only
  //   if (!hasStartedOnceRef.current && window.innerWidth >= 768) {
  //     hasStartedOnceRef.current = true;
  //     startPopupCycle();
  //   }

  //   // Reappear every 2.5 minutes (desktop only)
  //   const reappearInterval = window.setInterval(() => {
  //     if (window.innerWidth >= 768) startPopupCycle();
  //   }, 150000);

  //   return () => {
  //     if (reappearInterval) window.clearInterval(reappearInterval);
  //     if (countdownIntervalRef.current)
  //       window.clearInterval(countdownIntervalRef.current);
  //     if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current);
  //   };
  // }, [gifActive]);

  // Track scroll position
  useEffect(() => {
    const handleScroll = () => {
      const currentPosition = window.pageYOffset;
      setScrollPosition(currentPosition);
      setIsAtTop(currentPosition < 100); // Consider "at top" if within 100px of top
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  // Auto-slide carousel - optimized with useCallback
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % latestArticles.length);
  }, [latestArticles.length]);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000); // 5 seconds
    return () => clearInterval(interval);
  }, [nextSlide]);

  const handleFilterChange = useCallback(
    (newFilter: string) => {
      setFilter(newFilter);
      if (newFilter === "all") {
        setFilteredArticles(allFactChecks);
      } else {
        const filtered = allFactChecks.filter(
          (article) => article.verdict === newFilter
        );
        setFilteredArticles(filtered);
      }
    },
    [allFactChecks]
  );

  const getFilterText = useCallback((filterValue: string) => {
    if (filterValue === "all") {
      return "সব";
    }
    return getVerdictLabel(filterValue);
  }, []);

  const getVerdictBadgeColor = useCallback((verdict: string) => {
    switch (normalizeVerdict(verdict)) {
      case "true":
        return "bg-green-600";
      case "false":
        return "bg-red-600";
      default:
        return "bg-yellow-600";
    }
  }, []);

  const getVerdictBadgeLabelEn = useCallback((verdict: string) => {
    switch (normalizeVerdict(verdict)) {
      case "true":
        return "TRUE";
      case "false":
        return "FALSE";
      default:
        return "UNVERIFIED";
    }
  }, []);

  // Memoize filter options to prevent recreation on every render
  const filterOptions = useMemo(
    () => [
      { value: "all", label: "সব", color: "bg-gray-100 text-gray-700" },
      { value: "true", label: "সত্য", color: "bg-green-100 text-green-700" },
      { value: "false", label: "অসত্য", color: "bg-red-100 text-red-700" },
      {
        value: "unverified",
        label: "বিভ্রান্তিকর",
        color: "bg-yellow-100 text-yellow-700",
      },
    ],
    [
      isNewsCheckActive,
      isMythbustingActive,
      isAIImageCheckActive,
      isImageSearchActive,
      isTextCheckActive,
    ]
  );

  const handleArticleClick = useCallback((slug: string) => {
    window.location.href = `/factchecks/${slug}`;
  }, []);

  const handleBlogClick = useCallback((slug: string) => {
    window.location.href = `/blog/${slug}`;
  }, []);

  const handleScrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  const handleScrollToBottom = useCallback(() => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: "smooth",
    });
  }, []);

  const handleNewsCheckClick = useCallback(() => {
    setIsNewsCheckActive(!isNewsCheckActive);
    if (isMythbustingActive) {
      setIsMythbustingActive(false);
    }
    if (isAIImageCheckActive) {
      setIsAIImageCheckActive(false);
    }
    if (isImageSearchActive) {
      setIsImageSearchActive(false);
    }
    if (isTextCheckActive) {
      setIsTextCheckActive(false);
    }
  }, [
    isNewsCheckActive,
    isMythbustingActive,
    isAIImageCheckActive,
    isImageSearchActive,
    isTextCheckActive,
  ]);

  const handleMythbustingClick = useCallback(() => {
    setIsMythbustingActive(!isMythbustingActive);
    if (isNewsCheckActive) {
      setIsNewsCheckActive(false);
    }
    if (isAIImageCheckActive) {
      setIsAIImageCheckActive(false);
    }
    if (isImageSearchActive) {
      setIsImageSearchActive(false);
    }
    if (isTextCheckActive) {
      setIsTextCheckActive(false);
    }
  }, [
    isMythbustingActive,
    isNewsCheckActive,
    isAIImageCheckActive,
    isImageSearchActive,
    isTextCheckActive,
  ]);

  const handleAIImageCheckClick = useCallback(() => {
    setIsAIImageCheckActive(!isAIImageCheckActive);
    if (isNewsCheckActive) {
      setIsNewsCheckActive(false);
    }
    if (isMythbustingActive) {
      setIsMythbustingActive(false);
    }
    if (isImageSearchActive) {
      setIsImageSearchActive(false);
    }
    if (isTextCheckActive) {
      setIsTextCheckActive(false);
    }
  }, [
    isAIImageCheckActive,
    isNewsCheckActive,
    isMythbustingActive,
    isImageSearchActive,
    isTextCheckActive,
  ]);

  const handleImageSearchClick = useCallback(() => {
    setIsImageSearchActive(!isImageSearchActive);
    if (isNewsCheckActive) {
      setIsNewsCheckActive(false);
    }
    if (isMythbustingActive) {
      setIsMythbustingActive(false);
    }
    if (isAIImageCheckActive) {
      setIsAIImageCheckActive(false);
    }
    if (isTextCheckActive) {
      setIsTextCheckActive(false);
    }
  }, [
    isImageSearchActive,
    isNewsCheckActive,
    isMythbustingActive,
    isAIImageCheckActive,
    isTextCheckActive,
  ]);

  const handleTextCheckClick = useCallback(() => {
    setIsTextCheckActive(!isTextCheckActive);
    if (isNewsCheckActive) {
      setIsNewsCheckActive(false);
    }
    if (isMythbustingActive) {
      setIsMythbustingActive(false);
    }
    if (isAIImageCheckActive) {
      setIsAIImageCheckActive(false);
    }
    if (isImageSearchActive) {
      setIsImageSearchActive(false);
    }
  }, [
    isTextCheckActive,
    isNewsCheckActive,
    isMythbustingActive,
    isAIImageCheckActive,
    isImageSearchActive,
  ]);

  const handleSearch = useCallback(
    async (query: string) => {
      // Check if any mode is manually activated by button click
      const hasActiveMode =
        isMythbustingActive ||
        isAIImageCheckActive ||
        isImageSearchActive ||
        isTextCheckActive ||
        isNewsCheckActive;

      // If a mode is manually active, use traditional routing
      if (hasActiveMode) {
        if (isMythbustingActive) {
          window.location.href = `/mythbusting?query=${encodeURIComponent(query)}`;
        } else if (isAIImageCheckActive) {
          window.location.href = `/image-check?query=${encodeURIComponent(query)}`;
        } else if (isImageSearchActive) {
          window.location.href = `/image-search?query=${encodeURIComponent(query)}`;
        } else if (isTextCheckActive) {
          sessionStorage.setItem("plagiarismText", query);
          window.location.href = `/plag-test`;
        } else if (isNewsCheckActive) {
          window.location.href = `/news-verification-v2?url=${encodeURIComponent(query)}`;
        }
        return;
      }

      // 🤖 INTELLIGENT AUTO-ROUTING (when no button is pressed)
      console.log("🤖 Using intelligent routing for query:", query);

      // Show loading animation for AI classification
      setIsClassifying(true);

      try {
        // Classify the query using AI
        const classification = await classifyQuery(query);
        console.log("📊 Classification result:", classification);

        // Route based on classification
        if (classification.type === "url") {
          // URL detected - go to news verification
          console.log("🔗 Routing to news verification (URL detected)");
          window.location.href = `/news-verification-v2?url=${encodeURIComponent(query.trim())}`;
        } else if (classification.type === "mythbusting") {
          // General belief/myth question - go to mythbusting
          console.log("🔍 Routing to mythbusting (myth/belief detected)");
          window.location.href = `/mythbusting?query=${encodeURIComponent(query)}`;
        } else if (classification.type === "factcheck") {
          // Specific event/news claim - go to AI factchecking
          console.log("✅ Routing to factcheck (specific event detected)");
          window.location.href = `/factcheck-detail?query=${encodeURIComponent(query)}`;
        } else {
          // Default fallback
          console.log("⚠️ Using default routing");
          window.location.href = `/factcheck-detail?query=${encodeURIComponent(query)}`;
        }
      } catch (error) {
        console.error("Classification failed, using default routing:", error);
        // Fallback to factcheck on error
        window.location.href = `/factcheck-detail?query=${encodeURIComponent(query)}`;
      } finally {
        // Hide loading animation
        setIsClassifying(false);
      }
    },
    [
      isMythbustingActive,
      isAIImageCheckActive,
      isImageSearchActive,
      isTextCheckActive,
      isNewsCheckActive,
    ]
  );

  // Start image upload simulation and store image data URL for downstream pages
  const startImageUpload = (file: File) => {
    setIsUploadingImage(true);
    setUploadProgress(0);
    setUploadedFile(null);

    // Simulate upload progress
    let progress = 0;
    const interval = window.setInterval(() => {
      // increment faster at first, then slow near the end
      progress += Math.round(Math.random() * 12) + 6;
      if (progress >= 95) progress = 95;
      setUploadProgress(progress);
    }, 250);

    // After a short delay, finish upload and read file as dataURL
    window.setTimeout(
      () => {
        window.clearInterval(interval);
        setUploadProgress(100);

        // Read file into data URL and store in sessionStorage for next pages
        const reader = new FileReader();
        reader.onload = () => {
          try {
            const dataUrl = reader.result as string;
            sessionStorage.setItem("khoj_uploaded_image_dataurl", dataUrl);
          } catch (e) {
            console.warn(
              "Could not persist uploaded image to sessionStorage",
              e
            );
          }

          setUploadedFile(file);
          setIsUploadingImage(false);
          setUploadProgress(0);
          setIsImageModalOpen(true);
        };
        reader.onerror = () => {
          setIsUploadingImage(false);
          setUploadProgress(0);

          alert("আপলোডে সমস্যা হয়েছে — অনুগ্রহ করে আবার চেষ্টা করুন।");
        };
        reader.readAsDataURL(file);
      },
      1500 + Math.random() * 800
    ); // total simulated upload time
  };

  const handleImageOptionSelect = (option: string) => {
    // When the user picks an option, route appropriately and use the stored image
    setIsImageModalOpen(false);
    const dataKey = "khoj_uploaded_image_dataurl";

    if (option === "Image search") {
      // Navigate to image search and keep image in sessionStorage
      window.location.href = "/image-search";
    } else if (option === "AI image detection") {
      window.location.href = "/image-check";
    } else if (option === "Photocard news verification") {
      // Map photocard option to a suitable route; fallback to image-check
      window.location.href = "/image-check";
    } else {
      // default fallback
      window.location.href = "/image-search";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* AI Classification Loading Overlay */}
      {isClassifying && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-8 shadow-2xl max-w-sm mx-4">
            <div className="text-center">
              {/* Spinning Circle Animation */}
              <div className="relative w-16 h-16 mx-auto mb-4">
                <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              </div>

              {/* Loading Text */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2 font-tiro-bangla">
                ফ্যাক্টচেকিং এ পাঠানো হচ্ছে...
              </h3>
              <p className="text-sm text-gray-600 font-tiro-bangla">
                একটু অপেক্ষা করুন...
              </p>

              {/* Progress Dots */}
              <div className="flex justify-center space-x-1 mt-4">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image upload progress overlay */}
      {isUploadingImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl p-6 shadow-2xl max-w-sm mx-4 text-center">
            <div className="relative w-20 h-20 mx-auto mb-4">
              <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
              <div
                className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"
                style={{ transform: "rotate(0deg)" }}
              ></div>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2 font-tiro-bangla">
              ছবি আপলোড হচ্ছে...
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              অনুগ্রহ করে অপেক্ষা করুন
            </p>
            <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 bg-blue-600"
                style={{
                  width: `${uploadProgress}%`,
                  transition: "width 200ms linear",
                }}
              />
            </div>
            <div className="mt-2 text-xs text-gray-600">{uploadProgress}%</div>
          </div>
        </div>
      )}

      {/* Hero Section with Grid Background */}
      <section className="hero-section relative bg-cover bg-center bg-no-repeat text-white py-6 md:py-10">
        {/* Grid Background - Behind the image */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
            backgroundSize: "50px 50px",
          }}
        ></div>

        {/* Main Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBgUrl})` }}
        ></div>

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-4 md:mb-5">
            <h1
              className="text-3xl md:text-5xl font-bold mb-3 font-tiro-bangla"
              style={{
                textShadow:
                  "0 0 4px rgba(255, 255, 255, 0.4), 0 0 8px rgba(255, 255, 255, 0.3)",
              }}
            >
              খোঁজ
            </h1>
            <p
              className="text-lg md:text-2xl text-white mb-4 md:mb-5 font-tiro-bangla cursor-pointer hover:text-blue-200 transition-colors duration-300 glow-text"
              style={{
                textShadow:
                  "0 0 8px rgba(255, 255, 255, 0.8), 0 0 16px rgba(255, 255, 255, 0.6), 0 0 24px rgba(255, 255, 255, 0.4), 0 0 32px rgba(255, 255, 255, 0.3)",
                animation: "glow 4s ease-in-out infinite alternate",
              }}
            >
              <Link
                href="/fact-checking-verification"
                className="hover:underline"
              >
                কৃত্রিম বুদ্ধিমত্তা চালিত প্রথম বাংলা ফ্যাক্টচেকিং প্ল্যাটফর্ম
              </Link>
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <SearchBar
              placeholder="আজকে কী ব্যাপারে যাচাই-বাচাই করতে চান?"
              className="mb-2 md:mb-3"
              data-tour="search-bar"
              dynamicPlaceholder={
                isNewsCheckActive
                  ? "যে খবরটা যাচাই করতে চান সেটার লিংক দিন..."
                  : isMythbustingActive
                    ? "যে ব্যাপারে মিথবাস্টিং করতে চান, সেটা লিখুন..."
                    : isAIImageCheckActive
                      ? "AI জেনারেটেড সনাক্ত আপলোড করুন..."
                      : isImageSearchActive
                        ? "ছবি সার্চ করতে আপলোড করুন..."
                        : isTextCheckActive
                          ? "লেখা চুরি হয়েছে কিনা তা যাচাই করুন এখানে..."
                          : undefined
              }
              isNewsCheckMode={isNewsCheckActive}
              onSearch={handleSearch}
            />

            {/* Floating Feature Buttons removed as features now auto-route via search bar */}

            <div className="mt-1 md:mt-2 text-center">
              <Link
                href="/khoj-chat"
                className="inline-block hover:opacity-90 transition-opacity duration-300"
              >
                <div className="inline-block p-2">
                  <Image
                    src="/khoj-chat-logo.png"
                    alt="খোঁজ চ্যাট"
                    width={80}
                    height={26}
                    className="mx-auto drop-shadow-[0_0_20px_rgba(59,130,246,0.6)] hover:drop-shadow-[0_0_30px_rgba(59,130,246,0.8)] transition-all duration-300 khoj-chat-icon"
                    style={{
                      filter:
                        "drop-shadow(0 0 15px rgba(59, 130, 246, 0.5)) drop-shadow(0 0 25px rgba(59, 130, 246, 0.3))",
                      animation: "float 4s ease-in-out infinite",
                    }}
                  />
                </div>
              </Link>
            </div>
          </div>
        </div>
        {/* Hero GIF Popup - DISABLED */}
        {/* 
        {showHeroGif && !isMobile && (
          <div className="pointer-events-auto absolute left-3 bottom-24 md:left-6 md:bottom-6 z-10">
            <div className="relative">
              <button
                aria-label="Close"
                onClick={() => {
                  setShowHeroGif(false);
                  setGifActive(false);
                  if (countdownIntervalRef.current)
                    window.clearInterval(countdownIntervalRef.current);
                  if (hideTimeoutRef.current)
                    window.clearTimeout(hideTimeoutRef.current);
                  popupStartMsRef.current = undefined;
                }}
                className="absolute -top-1.5 -right-1.5 bg-black/80 text-white text-[10px] md:text-xs w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center shadow-md hover:bg-black/90 transition-colors"
              >
                ×
              </button>
              <img
                src="/Loading%20Screens/pop-up.gif"
                alt="Promo"
                className="block w-44 h-auto md:w-72 select-none"
                draggable={false}
              />
            </div>
          </div>
        )}
        */}
        {/* Social Icons - Bottom Right of Hero (not fixed) */}
        <div className="pointer-events-auto absolute right-3 bottom-3 md:right-6 md:bottom-6 flex items-center gap-2 md:gap-3 z-10">
          <a
            href="https://www.facebook.com/profile.php?id=61580245735019"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Facebook"
            className="opacity-90 hover:opacity-100 transition-opacity"
          >
            <Image
              src="/socials/facebook.png"
              alt="Facebook"
              width={24}
              height={24}
              className="w-6 h-6 md:w-7 md:h-7"
            />
          </a>
          <a
            href="https://t.me/khojfact"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Telegram"
            className="opacity-90 hover:opacity-100 transition-opacity"
          >
            <Image
              src="/socials/telegram.png"
              alt="Telegram"
              width={24}
              height={24}
              className="w-6 h-6 md:w-7 md:h-7"
            />
          </a>
          <a
            href="https://www.youtube.com/@khoj-factchecker"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            className="opacity-90 hover:opacity-100 transition-opacity"
          >
            <Image
              src="/socials/youtube.png"
              alt="YouTube"
              width={24}
              height={24}
              className="w-6 h-6 md:w-7 md:h-7"
            />
          </a>
        </div>
      </section>

      {/* Recent Fact Checks */}
      <section className="pt-2 pb-6 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          {/* AI FactCheck Widget - Left Side */}
          <div className="hidden lg:block absolute -left-12 top-16 w-80">
            <AIFactCheckWidget />
          </div>

          {/* Right Widget - Fixed Position */}
          <div className="hidden lg:block absolute -right-12 top-16 w-80">
            <FeatureWidget />
          </div>

          {/* Mobile Widgets */}
          <div className="lg:hidden">
            <AIFactCheckWidget />
            <FeatureWidget />
          </div>

          {/* Main Content - Centered */}
          <div className="flex flex-col items-center max-w-4xl mx-auto">
            <div className="text-center mb-4 w-full">
              <h2 className="text-xl font-bold text-gray-900 mb-2 font-tiro-bangla">
                আমাদের সাম্প্রতিক ফ্যাক্টচেক সমূহ
              </h2>
              <p className="text-base text-gray-600 font-tiro-bangla">
                সর্বশেষ যাচাইকৃত দাবি এবং তথ্য
              </p>
            </div>

            {/* Filter Buttons */}
            <div className="flex justify-center mb-4 w-full">
              <div className="flex space-x-2 bg-white rounded-lg p-1 shadow-md">
                {filterOptions.map((filterOption) => (
                  <button
                    key={filterOption.value}
                    onClick={() => handleFilterChange(filterOption.value)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      filter === filterOption.value
                        ? filterOption.color
                        : "text-gray-600 hover:text-gray-800"
                    } font-tiro-bangla`}
                  >
                    {filterOption.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Hero Carousel */}
            <div className="mb-4 w-full">
              <div className="relative">
                {/* Main Carousel Container */}
                <div className="relative h-96 overflow-hidden">
                  <div className="flex items-center justify-center h-full">
                    {latestArticles.map((article, index) => (
                      <div
                        key={article.id}
                        className={`carousel-item absolute transition-all duration-1000 ease-in-out ${
                          index === currentSlide
                            ? "z-20 scale-100 opacity-100 transform translate-x-0"
                            : index ===
                                (currentSlide + 1) % latestArticles.length
                              ? "z-10 scale-75 opacity-60 transform translate-x-32" // Right side
                              : "z-10 scale-75 opacity-60 transform -translate-x-32" // Left side
                        }`}
                        style={{
                          left:
                            index === currentSlide
                              ? "50%"
                              : index ===
                                  (currentSlide + 1) % latestArticles.length
                                ? "70%"
                                : "30%",
                          transform:
                            index === currentSlide
                              ? "translateX(-50%)"
                              : index ===
                                  (currentSlide + 1) % latestArticles.length
                                ? "translateX(-50%) scale(0.75)"
                                : "translateX(-50%) scale(0.75)",
                        }}
                      >
                        <article className="bg-gray-900 rounded-xl overflow-hidden hover:shadow-2xl transition-all duration-300 h-full border border-gray-800 w-80">
                          {/* Thumbnail with Title Overlay */}
                          <div className="relative h-48 overflow-hidden">
                            <SafeImage
                              src={article.thumbnail || "/khoj.png"}
                              alt={article.title}
                              className="w-full h-full object-cover"
                              fill
                            />
                            {/* Dark Gradient Overlay for Title */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

                            {/* Verdict Badge - Top Right */}
                            <div className="absolute top-3 right-3">
                              <div
                                className={`${getVerdictBadgeColor(article.verdict)} text-white px-2 py-1 rounded-full text-xs font-bold`}
                              >
                                {getVerdictBadgeLabelEn(article.verdict)}
                              </div>
                            </div>

                            {/* Category Badge - Bottom Center */}
                            <div className="absolute bottom-16 left-1/2 transform -translate-x-1/2">
                              <div className="bg-blue-600 text-white px-3 py-1 rounded-lg text-xs font-medium">
                                ফ্যাক্টচেক
                              </div>
                            </div>

                            {/* Title Overlay - Bottom */}
                            <div className="absolute bottom-0 left-0 right-0 p-4">
                              <h3 className="text-white font-bold text-sm leading-tight drop-shadow-lg">
                                {article.title}
                              </h3>
                            </div>
                          </div>

                          {/* Content Below Thumbnail */}
                          <div className="p-4 bg-gray-900">
                            <p className="text-gray-300 mb-3 line-clamp-2 text-xs">
                              {article.summary}
                            </p>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-2 text-gray-400 text-xs">
                                <span>{article.author}</span>
                                <span>•</span>
                                <span>
                                  {new Date(
                                    article.publishedAt
                                  ).toLocaleDateString("bn-BD")}
                                </span>
                              </div>
                              <Link
                                href={`/factchecks/${article.slug}`}
                                className="text-blue-400 hover:text-blue-300 font-medium text-xs transition-colors"
                              >
                                আরও পড়ুন →
                              </Link>
                            </div>
                          </div>
                        </article>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Carousel Indicators */}
                <div className="flex justify-center mt-8 space-x-3">
                  {latestArticles.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`w-3 h-3 rounded-full transition-all duration-300 ${
                        index === currentSlide
                          ? "bg-blue-600 scale-125"
                          : "bg-gray-400 hover:bg-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-10 w-full max-w-6xl">
              {filteredArticles.map((article) => (
                <article
                  key={article.id}
                  className="article-card bg-white hover:shadow-md transition-shadow duration-200 cursor-pointer rounded-xl"
                  onClick={() => handleArticleClick(article.slug)}
                >
                  {/* Thumbnail */}
                  <div className="relative h-32 overflow-hidden">
                    <SafeImage
                      src={article.thumbnail || "/khoj.png"}
                      alt={article.title}
                      className="w-full h-full object-cover"
                      fill
                    />
                    {/* Verdict Badge - Top Right */}
                    <div className="absolute top-1 right-1">
                      <span
                        className={`inline-block px-1 py-0.5 rounded text-xs font-bold text-white ${getVerdictBadgeColor(
                          article.verdict
                        )}`}
                      >
                        {getVerdictBadgeLabelEn(article.verdict)}
                      </span>
                    </div>
                    {/* FACT CHECK Watermark */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-10">
                      <span className="text-white text-2xl font-bold">
                        FACT CHECK
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-2">
                    {/* Title */}
                    <h3 className="text-sm font-semibold text-gray-900 mb-1 font-tiro-bangla line-clamp-3 leading-tight">
                      {article.title}
                    </h3>

                    {/* Tags - Desktop Only */}
                    {article.tags && article.tags.length > 0 && (
                      <div className="flex space-x-1 mb-2 hidden md:flex">
                        {article.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-tiro-bangla"
                          >
                            {tag}
                          </span>
                        ))}
                        {article.tags.length > 2 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-tiro-bangla">
                            +{article.tags.length - 2}
                          </span>
                        )}
                      </div>
                    )}

                    {/* Preview - Desktop Only */}
                    <p className="text-gray-600 mb-2 line-clamp-1 hidden md:block font-tiro-bangla text-sm">
                      {article.summary}
                    </p>

                    {/* Date */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-tiro-bangla">
                        {new Date(article.publishedAt).toLocaleDateString(
                          "bn-BD"
                        )}
                      </span>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <div className="text-center mt-6 w-full space-y-4">
              <Link
                href="/factchecks"
                className="btn-primary inline-flex items-center"
              >
                সব ফ্যাক্টচেক দেখুন
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Blogs Section */}
      <section className="py-6 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2 font-tiro-bangla">
              আমাদের সাম্প্রতিক ব্লগ সমূহ
            </h2>
          </div>

          {/* Blog Grid */}
          <div className="grid grid-cols-2 gap-4 md:gap-6 max-w-6xl mx-auto">
            {latestBlogs.map((blog) => (
              <article
                key={blog.id}
                className="article-card bg-white hover:shadow-md transition-shadow duration-200 cursor-pointer rounded-xl"
                onClick={() => handleBlogClick(blog.slug)}
              >
                {/* Thumbnail */}
                <div className="relative h-32 overflow-hidden">
                  <SafeImage
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="w-full h-full object-cover"
                    fill
                  />
                  {/* Blog Badge */}
                  <div className="absolute top-1 right-1">
                    <span className="inline-block px-2 py-1 bg-blue-600 text-white text-xs font-bold rounded">
                      ব্লগ
                    </span>
                  </div>
                  {/* Read Time Badge */}
                  <div className="absolute top-1 left-1">
                    <span className="inline-block px-2 py-1 bg-black bg-opacity-70 text-white text-xs font-medium rounded">
                      {blog.readTime}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-2">
                  {/* Title */}
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 font-tiro-bangla line-clamp-3 leading-tight">
                    {blog.title}
                  </h3>

                  {/* Tags - Desktop Only */}
                  {blog.tags && blog.tags.length > 0 && (
                    <div className="flex space-x-1 mb-2 hidden md:flex">
                      {blog.tags.slice(0, 2).map((tag, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-tiro-bangla"
                        >
                          {tag}
                        </span>
                      ))}
                      {blog.tags.length > 2 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full font-tiro-bangla">
                          +{blog.tags.length - 2}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Preview - Desktop Only */}
                  <p className="text-gray-600 mb-2 line-clamp-1 hidden md:block font-tiro-bangla text-sm">
                    {blog.excerpt}
                  </p>

                  {/* Author and Date */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-tiro-bangla">
                      {blog.author}
                    </span>
                    <span className="text-xs text-gray-500 font-tiro-bangla">
                      {blog.publishDate}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="text-center mt-6">
            <Link href="/blog" className="btn-primary inline-flex items-center">
              সব ব্লগ পড়ুন
            </Link>
          </div>
        </div>
      </section>

      {/* User Invitation Section */}
      <section className="py-4 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-2 left-2 w-8 h-8 bg-blue-400 rounded-full"></div>
          <div className="absolute top-4 right-3 w-6 h-6 bg-purple-400 rounded-full"></div>
          <div className="absolute bottom-2 left-4 w-8 h-8 bg-pink-400 rounded-full"></div>
          <div className="absolute bottom-3 right-2 w-4 h-4 bg-indigo-400 rounded-full"></div>
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-3">
            {/* Left Side - Image */}
            <div className="flex-shrink-0">
              <SafeImage
                src="https://i.postimg.cc/VstfbHGq/Chat-GPT-Image-Sep-5-2025-08-04-10-PM.png"
                alt="Fact Check Illustration"
                className="w-40 h-40 object-contain"
                width={160}
                height={160}
              />
            </div>

            {/* Right Side - Content */}
            <div className="flex-1 text-center lg:text-left">
              {/* Main Heading */}
              <h2 className="text-base md:text-lg font-bold text-gray-900 mb-1 font-tiro-bangla">
                আমাদের পরিবারের অংশ হোন
              </h2>

              {/* Content */}
              <p className="text-xs text-gray-700 mb-2 font-tiro-bangla">
                আপনার চারপাশে ঘটে চলা নানান কিছু এবং প্রচলিত গুজব, নিউজ সম্পর্কে
                সন্দেহ আছে?
                <span className="font-semibold text-blue-600">খোঁজ</span> এর
                সাথে যুক্ত হয়ে সত্যের সন্ধান করুন।
              </p>

              <div className="bg-white rounded-lg p-3 mb-2 border border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {/* Left Side - Invitation */}
                  <div className="text-left">
                    <h3 className="text-xs font-bold text-gray-900 mb-1 font-tiro-bangla">
                      আমাদের পাঠান
                    </h3>
                    <ul className="space-y-0.5 text-xs text-gray-700 font-tiro-bangla">
                      <li className="flex items-start space-x-1">
                        <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>সন্দেহজনক নিউজ বা তথ্য</span>
                      </li>
                      <li className="flex items-start space-x-1">
                        <div className="w-1 h-1 bg-purple-500 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>প্রচলিত গুজব বা ভুয়া খবর</span>
                      </li>
                      <li className="flex items-start space-x-1">
                        <div className="w-1 h-1 bg-pink-500 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>সামাজিক যোগাযোগমাধ্যমের পোস্ট</span>
                      </li>
                      <li className="flex items-start space-x-1">
                        <div className="w-1 h-1 bg-indigo-500 rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>যেকোনো সন্দেহজনক দাবি</span>
                      </li>
                    </ul>
                  </div>

                  {/* Right Side - Contact */}
                  <div className="text-left">
                    <h3 className="text-xs font-bold text-gray-900 mb-1 font-tiro-bangla">
                      যোগাযোগ করুন
                    </h3>
                    <div className="space-y-1">
                      <div className="flex items-center space-x-1 p-1 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg
                            className="w-2 h-2 text-white"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 font-tiro-bangla">
                            ইমেইল ঠিকানা
                          </p>
                          <a
                            href="mailto:fact@khoj-bd.com"
                            className="text-blue-600 hover:text-blue-700 font-medium text-xs font-tiro-bangla transition-colors"
                          >
                            fact@khoj-bd.com
                          </a>
                        </div>
                      </div>

                      <div className="p-1 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                        <p className="text-xs text-gray-700 font-tiro-bangla">
                          <span className="font-semibold text-green-600">
                            দ্রুত প্রতিক্রিয়া:
                          </span>
                          ২৪-৪৮ ঘন্টার মধ্যে উত্তর।
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Call to Action */}
              <div className="text-center">
                <p className="text-xs text-gray-600 mb-2 font-tiro-bangla">
                  আমাদের লেখা পাঠানোর নিয়ম জানতে{" "}
                  <Link
                    href="/how-to-write"
                    className="text-blue-600 hover:text-blue-700 underline font-medium"
                  >
                    এখানে
                  </Link>{" "}
                  ক্লিক করুন
                </p>
                <div className="flex flex-col sm:flex-row gap-1 justify-center items-center">
                  <a
                    href="mailto:fact@khoj-bd.com"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl font-tiro-bangla"
                  >
                    এখনই ইমেইল করুন
                  </a>
                  <Link
                    href="/about"
                    className="bg-white hover:bg-gray-50 text-gray-700 px-3 py-1 rounded-full text-xs font-medium transition-all duration-300 border border-gray-200 hover:border-gray-300 font-tiro-bangla"
                  >
                    আমাদের সম্পর্কে জানুন
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* YouTube Video Section */}
      <section className="py-8 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video w-full">
              <iframe
                src="https://www.youtube.com/embed/M89gdblo93w?si=whM3xGVaSCKyF3c9"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full h-full rounded-lg shadow-lg"
                sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      {/* Scroll Button */}
      <div className="fixed bottom-6 left-6 z-50">
        <button
          onClick={isAtTop ? handleScrollToBottom : handleScrollToTop}
          className="bg-primary-600 hover:bg-primary-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110 group"
          title={isAtTop ? "নিচে যান" : "উপরে যান"}
        >
          {isAtTop ? (
            <ChevronDown className="h-6 w-6" />
          ) : (
            <ChevronUp className="h-6 w-6" />
          )}
        </button>
        {/* <FloatingBall /> Disabled - Recent News FAB */}
      </div>

      {/* Image options modal - shown after successful upload */}
      <ImageOptionsModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        onSelectOption={handleImageOptionSelect}
      />

      <Footer />
    </div>
  );
}
