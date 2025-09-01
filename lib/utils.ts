import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export interface SearchResult {
  title: string
  url: string
  content: string
  score: number
  published_date?: string
  source: string
}

export interface FactCheckReport {
  claim: string
  verdict: 'true' | 'false' | 'misleading' | 'unverified' | 'debunk'
  explanation: string
  references: Reference[]
  confidence: number
  generatedAt: string
}

export interface Reference {
  id: number
  title: string
  url: string
  snippet: string
}

export interface FactCheckArticle {
  id: string
  slug: string
  title: string
  claim: string
  verdict: 'true' | 'false' | 'misleading' | 'unverified' | 'debunk'
  summary: string
  content: string
  publishedAt: string
  author: string
  tags: string[]
  references: Reference[]
  thumbnail?: string
}

export const BANGLADESHI_NEWS_SITES = [
  'https://www.prothomalo.com',
  'https://www.bd-pratidin.com',
  'https://www.jugantor.com',
  'https://www.kalerkantho.com',
  'https://www.samakal.com',
  'https://www.thedailystar.net',
  'https://www.bdnews24.com',
  'https://www.dhakatribune.com',
  'https://thefinancialexpress.com.bd',
  'https://www.newagebd.net',
  'https://www.daily-sun.com',
  'https://www.theindependentbd.com',
  'https://bangladeshpost.net',
  'https://observerbd.com',
  'https://www.banglanews24.com',
  'https://www.banglatribune.com',
  'https://www.dhakapost.com',
  'https://www.risingbd.com',
  'https://barta24.com',
  'https://www.dhakatimes24.com',
  'https://www.somoynews.tv',
  'https://www.jamuna.tv',
  'https://www.independent24.com',
  'https://www.channel24bd.tv',
  'https://www.dbcnews.tv',
  'https://www.ntvbd.com',
  'https://www.rtvonline.com',
  'https://www.mzamin.com',
  'https://www.sangbad.net.bd',
  'https://www.jaijaidinbd.com',
  'https://www.bhorerkagoj.com',
  'https://www.dailyinqilab.com',
  'https://www.nayadiganta.com',
  'https://www.dainikazadi.net',
  'https://www.purbokone.net',
  'https://www.sylhetexpress.com',
  'https://www.khulnatimes.com',
  'https://www.amaderbarisal.com',
  'https://www.rajshahinews24.com'
]

export const FACT_CHECKING_SITES = [
  'https://rumorscanner.com',
  'https://www.fact-watch.org',
  'https://www.boombangladesh.com',
  'https://factcheck.afp.com/bangla',
  'https://www.bssnews.net/fact-check',
  'https://jachai.org',
  'https://bdfactcheck.com',
  'https://dismislab.com',
  'https://bangla.altnews.in',
  'https://bangla.factcrescendo.com',
  'https://bangla.vishvasnews.com'
]

export const INTERNATIONAL_FACT_CHECKING_SITES = [
  'https://snopes.com',
  'https://www.politifact.com',
  'https://www.factcheck.org',
  'https://www.reuters.com/fact-check',
  'https://apnews.com/APFactCheck',
  'https://factcheck.afp.com',
  'https://www.bbc.com/news/reality_check',
  'https://fullfact.org',
  'https://www.washingtonpost.com/news/fact-checker',
  'https://www.bellingcat.com',
  'https://euvsdisinfo.eu'
]

export const SCIENCE_HEALTH_SITES = [
  'https://healthfeedback.org',
  'https://sciencefeedback.co',
  'https://www.nasa.gov',
  'https://skepticalinquirer.org',
  'https://quackwatch.org',
  'https://www.sciencebee.com.bd',
  'https://bijnan-o-bijnani.co.in',
  'https://bigganblog.org'
]

export const PRIORITY_SITES = [
  ...BANGLADESHI_NEWS_SITES,
  ...FACT_CHECKING_SITES,
  ...INTERNATIONAL_FACT_CHECKING_SITES,
  ...SCIENCE_HEALTH_SITES
]

// Comprehensive ALLOWED_SITES for domain-first search
export const ALLOWED_SITES = [
  // Bengali Fact-Checking Websites (HIGHEST PRIORITY)
  "rumorscanner.com",
  "fact-watch.org", 
  "boombangladesh.com",
  "factcheck.afp.com",
  "bssnews.net",
  "jachai.org",
  "bdfactcheck.com",
  "dismislab.com",
  "bangla.altnews.in",
  "bangla.factcrescendo.com",
  "bangla.vishvasnews.com",
  
  // Bangladeshi Mainstream News Sites
  "prothomalo.com",
  "bd-pratidin.com",
  "jugantor.com",
  "kalerkantho.com",
  "samakal.com",
  "thedailystar.net",
  "bdnews24.com",
  "dhakatribune.com",
  "thefinancialexpress.com.bd",
  "newagebd.net",
  "daily-sun.com",
  "theindependentbd.com",
  "bangladeshpost.net",
  "observerbd.com",
  "banglanews24.com",
  "banglatribune.com",
  "dhakapost.com",
  "risingbd.com",
  "barta24.com",
  "dhakatimes24.com",
  "somoynews.tv",
  "jamuna.tv",
  "independent24.com",
  "channel24bd.tv",
  "dbcnews.tv",
  "ntvbd.com",
  "rtvonline.com",
  "mzamin.com",
  "sangbad.net.bd",
  "jaijaidinbd.com",
  "bhorerkagoj.com",
  "dailyinqilab.com",
  "nayadiganta.com",
  "dainikazadi.net",
  "purbokone.net",
  "sylhetexpress.com",
  "khulnatimes.com",
  "amaderbarisal.com",
  "rajshahinews24.com",
  
  // International Sources
  "snopes.com",
  "politifact.com",
  "factcheck.org",
  "reuters.com",
  "apnews.com",
  "bbc.com",
  "fullfact.org",
  "washingtonpost.com",
  "bellingcat.com",
  "euvsdisinfo.eu",
  
  // Science & Health
  "healthfeedback.org",
  "sciencefeedback.co",
  "nasa.gov",
  "skepticalinquirer.org",
  "quackwatch.org",
  "sciencebee.com.bd",
  "bijnan-o-bijnani.co.in",
  "bigganblog.org",
  "boomlive.in",
  "thequint.com",
  "altnews.in",
  "vishvasnews.com",
  "newschecker.in",
  "cdc.gov",
  "who.int",
  "mayo.edu",
  "sciencenews.org",
  "livescience.com",
  "nationalgeographic.com",
  "theconversation.com",
  "factmyth.com",
  "leadstories.com",
  "checkyourfact.com"
]

// Helper function to normalize URLs
export function normalizeUrl(url: string): string {
  try {
    const urlObj = new URL(url.startsWith('http') ? url : `https://${url}`)
    return urlObj.origin + urlObj.pathname.replace(/\/+$/, '')
  } catch {
    return url
  }
}

// Helper function to extract domain from URL
export function extractDomain(url: string): string {
  try {
    return new URL(url.startsWith('http') ? url : `https://${url}`).hostname
  } catch {
    return url
  }
}

// Helper function to check if URL is in allowed sites
export function isAllowedSite(url: string): boolean {
  const domain = extractDomain(url)
  return ALLOWED_SITES.some(site => domain.includes(site))
}
