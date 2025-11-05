/**
 * Source Tier Configuration for Fact-Checking
 * Defines hierarchical source priority for Bangladesh and International claims
 */

export interface SourceTier {
  tier: number
  name: string
  domains: string[]
  category: 'bangladesh_news' | 'bangladesh_factcheck' | 'international_media' | 'international_factcheck' | 'local_bangladesh'
}

// Helper function to extract domain from URL
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url)
    return urlObj.hostname.replace('www.', '')
  } catch {
    // If URL parsing fails, try to extract domain manually
    return url.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
  }
}

// Bangladesh Tier 1: Top Bangladeshi News Media
export const BANGLADESH_TIER_1: string[] = [
  // National Newspapers (Bangla & English)
  'prothomalo.com',
  'bd-pratidin.com',
  'jugantor.com',
  'kalerkantho.com',
  'samakal.com',
  'ittefaq.com.bd',
  'dailyjanakantha.com',
  'dainikamadershomoy.com',
  'manobkantha.com.bd',
  'alokitobangladesh.com',
  'bhorerkagoj.com',
  'mzamin.com',
  'dailyinqilab.com',
  'dailynayadiganta.com',
  'jaijaidinbd.com',
  'sangbad.net.bd',
  'dailysangram.com',
  'deshrupantor.com',
  'thedailystar.net',
  'bdnews24.com',
  'dhakatribune.com',
  'thefinancialexpress.com.bd',
  'newagebd.net',
  'tbsnews.net',
  'observerbd.com',
  'daily-sun.com',
  'theindependentbd.com',
  'bangladeshpost.net',
  'businesspostbd.com',
  'dailyindustrybd.com',
  // Online News Portals
  'banglanews24.com',
  'banglatribune.com',
  'dhakapost.com',
  'dhakatimes24.com',
  'jagonews24.com',
  'risingbd.com',
  'barta24.com',
  'sarabangla.net',
  'kalbela.com',
  'bdpolitico.net',
  // Television Channels
  'somoynews.tv',
  'jamuna.tv',
  'independent24.com',
  'channel24bd.tv',
  'dbcnews.tv',
  'ntvbd.com',
  'rtvonline.com',
  'ekattor.tv',
  'atnnews.tv',
  'news24bd.tv',
  'channeli.tv',
  'boishakhionline.com',
  'banglavision.tv',
  'satv.tv',
  'mohona.tv',
  'desh.tv',
  'mytvbd.tv',
  'maasranga.tv',
  'deeptonews.com',
  'gazitv.com',
  'ekushey-tv.com',
  // International Bangla News Services
  'bbc.com',
  'dw.com',
  'voabangla.com',
  'aljazeera.com',
  'aa.com.tr',
  // Government & Official News Sources
  'bssnews.net',
  'pressinform.gov.bd'
].map(extractDomain)

// Bangladesh Tier 2: Bangladeshi Fact-Checking Websites
export const BANGLADESH_TIER_2: string[] = [
  'dismislab.com',
  'khoj-bd.com',
  'rumorscanner.com',
  'fact-watch.org',
  'jachai.org',
  'boombd.com',
  'factcheck.afp.com'
].map(extractDomain)

// Bangladesh Tier 3: International Media
export const BANGLADESH_TIER_3: string[] = [
  'bbc.com',
  'nytimes.com',
  'washingtonpost.com',
  'theguardian.com',
  'reuters.com',
  'apnews.com',
  'cnn.com',
  'aljazeera.com',
  'dw.com',
  'france24.com',
  'euronews.com',
  'news.sky.com',
  'economist.com',
  'timesofindia.indiatimes.com',
  'abc.net.au',
  'cbc.ca',
  'npr.org',
  'pbs.org',
  'bloomberg.com',
  'ft.com',
  'wsj.com',
  'channel4.com',
  'independent.co.uk',
  'dawn.com'
].map(extractDomain)

// Bangladesh Tier 4: International Fact-Checking Websites
export const BANGLADESH_TIER_4: string[] = [
  'factcheck.afp.com',
  'reuters.com',
  'snopes.com',
  'factcheck.org',
  'politifact.com',
  'leadstories.com',
  'washingtonpost.com',
  'bbc.com',
  'fullfact.org',
  'africacheck.org',
  'bellingcat.com',
  'stopfake.org',
  'tfc-taiwan.org.tw'
].map(extractDomain)

// Bangladesh Tier 5: Local Bangladeshi Media (Regional)
export const BANGLADESH_TIER_5: string[] = [
  // Chattogram
  'dainikazadi.net',
  'dainikpurbokone.net',
  'suprobhat.com',
  'epurbodesh.com',
  // Sylhet
  'sylhetexpress.com',
  'sylheterdak.com.bd',
  'sylhetmirror.com',
  // Khulna
  'dailyspandan.com',
  'khulnanews.com',
  // Rajshahi
  'rajshahinews24.com',
  'sonalisangbad.com',
  // Barishal
  'amaderbarisal.com',
  // Mymensingh
  'ajkermymensingh.com'
].map(extractDomain)

// International Tier 1: International Media
export const INTERNATIONAL_TIER_1: string[] = BANGLADESH_TIER_3

// International Tier 2: International Fact-Checking Websites
export const INTERNATIONAL_TIER_2: string[] = BANGLADESH_TIER_4

// Social media domains to filter out (NEVER use as sources)
export const SOCIAL_MEDIA_DOMAINS: string[] = [
  'facebook.com',
  'twitter.com',
  'x.com',
  'instagram.com',
  'youtube.com',
  'tiktok.com',
  'linkedin.com',
  'reddit.com',
  'telegram.org',
  'whatsapp.com',
  'messenger.com',
  'pinterest.com',
  'snapchat.com',
  'viber.com',
  'threads.net'
]

/**
 * Get source tiers for a given geography type
 */
export function getSourceTiers(geography: 'bangladesh' | 'international'): SourceTier[] {
  if (geography === 'bangladesh') {
    return [
      {
        tier: 1,
        name: 'Top Bangladeshi News Media',
        domains: BANGLADESH_TIER_1,
        category: 'bangladesh_news'
      },
      {
        tier: 2,
        name: 'Bangladeshi Fact-Checking Websites',
        domains: BANGLADESH_TIER_2,
        category: 'bangladesh_factcheck'
      },
      {
        tier: 3,
        name: 'International Media',
        domains: BANGLADESH_TIER_3,
        category: 'international_media'
      },
      {
        tier: 4,
        name: 'International Fact-Checking Websites',
        domains: BANGLADESH_TIER_4,
        category: 'international_factcheck'
      },
      {
        tier: 5,
        name: 'Local Bangladeshi Media',
        domains: BANGLADESH_TIER_5,
        category: 'local_bangladesh'
      }
    ]
  } else {
    // International
    return [
      {
        tier: 1,
        name: 'International Media',
        domains: INTERNATIONAL_TIER_1,
        category: 'international_media'
      },
      {
        tier: 2,
        name: 'International Fact-Checking Websites',
        domains: INTERNATIONAL_TIER_2,
        category: 'international_factcheck'
      }
    ]
  }
}

/**
 * Check if a URL is from social media
 */
export function isSocialMediaUrl(url: string): boolean {
  const domain = extractDomain(url)
  return SOCIAL_MEDIA_DOMAINS.some(socialDomain => 
    domain === socialDomain || domain.endsWith(`.${socialDomain}`)
  )
}

/**
 * Filter out social media sources from results
 */
export function filterSocialMedia<T extends { url: string }>(results: T[]): T[] {
  return results.filter(result => !isSocialMediaUrl(result.url))
}
