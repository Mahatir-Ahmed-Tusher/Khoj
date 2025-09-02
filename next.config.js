/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost'],
  },
  env: {
    TAVILY_API_KEY: process.env.TAVILY_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    // Additional Tavily API keys will be loaded automatically by the TavilyManager
  },
}

module.exports = nextConfig
