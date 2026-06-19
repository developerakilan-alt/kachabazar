/** @type {import('next').NextConfig} */

const backend = process.env.NEXT_REWRITE_BACKEND || "http://localhost:5056";

const nextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["192.168.*", "10.*", "127.*", "172.16.*", "172.17.*", "172.18.*", "172.19.*", "172.20.*", "172.21.*", "172.22.*", "172.23.*", "172.24.*", "172.25.*", "172.26.*", "172.27.*", "172.28.*", "172.29.*", "172.30.*", "172.31.*", "localhost"],

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

  async rewrites() {
    return [
      {
        source: "/api/:path((?!auth/).*)",
        destination: `${backend}/v1/:path*`,
      },
      {
        source: "/socket.io/:path*",
        destination: `${backend}/socket.io/:path*`,
      },
      {
        source: "/static/:path*",
        destination: `${backend}/static/:path*`,
      },
      {
        source: "/uploads/:path*",
        destination: `${backend}/uploads/:path*`,
      },
    ];
  },

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
      {
        protocol: "http",
        hostname: "192.168.29.108",
        port: "80",
      },
      {
        protocol: "http",
        hostname: "192.168.29.108",
      },
    ],
    // Optimize image loading
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    unoptimized: process.env.NODE_ENV === "development",
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
