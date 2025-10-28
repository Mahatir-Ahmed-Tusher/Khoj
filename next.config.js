/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      {
        protocol: 'https',
        hostname: 'i.postimg.cc',
      },
      {
        protocol: 'http',
        hostname: 'bigganblog.org',
      },
      {
        protocol: 'https',
        hostname: 'bigganblog.org',
      },
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
    ],
    // Performance optimizations
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    // Increase timeout for external images
    unoptimized: false,
    loader: 'default',
    // Add retry logic
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Performance optimizations
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  env: {
    TAVILY_API_KEY: process.env.TAVILY_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    // Additional Tavily API keys will be loaded automatically by the TavilyManager
  },
}

module.exports = nextConfig
