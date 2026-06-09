/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Increase server-side fetch timeout (default is too short for slow cPanel backends)
  staticPageGenerationTimeout: 120,

  // Disable fetch cache in development, keep for production
  logging: {
    fetches: {
      fullUrl: process.env.NODE_ENV !== "production",
    },
  },

  // Compress responses
  compress: true,

  // Optimize production builds
  poweredByHeader: false,

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "5056",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "5056",
      },
    ],
    // Optimize image loading
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 3600,
  },

  // HTTP security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: "/(.*)\\.(js|css|woff|woff2|png|jpg|jpeg|gif|svg|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
