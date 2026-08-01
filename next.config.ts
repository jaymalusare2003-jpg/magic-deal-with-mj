import type { NextConfig } from "next";
import withPWA from "next-pwa";

const withPWAConfig = withPWA({
  dest: "public",
  register: true,
  skipWaiting: false,
  disable: process.env.NODE_ENV === "development",
  runtimeCaching: [
    {
      pattern: "/api/*",
      options: {
        cache: {
          name: "api-cache",
          maxEntries: 100,
          maxAgeSeconds: 60,
        },
      },
    },
  ],
});

const nextConfig: NextConfig = withPWAConfig({
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
      { protocol: "https", hostname: "*.supabase.app" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
    ],
  },
  async headers() {
    return [
      {
        source: "/manifest.json",
        headers: [
          { key: "Content-Security-Policy", value: "default-src 'self'; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; frame-src 'self' https:; object-src 'none'; base-uri 'self'; form-action 'self';" },
        ],
      },
    ];
  },
  turbopack: {},
});

export default nextConfig;
