/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BASE_API_URL: "http://128.199.251.237:8088/api/v1",
  },

  // config options here
  images: {
    domains: ["api.placeholder.com"],
  },
  // Custom error handling
  experimental: {
    // errorOverlay is deprecated in Next.js 15.5.5
  },
  // Handle runtime errors gracefully
  onDemandEntries: {
    // period (in ms) where the server will keep pages in the buffer
    maxInactiveAge: 25 * 1000,
    // number of pages that should be kept simultaneously without being disposed
    pagesBufferLength: 2,
  },
};

module.exports = nextConfig;
