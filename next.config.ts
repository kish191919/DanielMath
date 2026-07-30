import type { NextConfig } from "next";

const koRoutes = [
  "/programs",
  "/inquire",
  "/resources",
  "/resources/curriculum",
  "/resources/sol",
  "/resources/testing",
  "/thanks",
  "/school-calendar",
  "/blog",
  "/privacy",
];

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      // Root Korean home
      { source: "/", destination: "/ko" },
      // Korean sub-pages
      ...koRoutes.map((p) => ({ source: p, destination: `/ko${p}` })),
      // Dynamic grade pages
      {
        source: "/resources/curriculum/:grade",
        destination: "/ko/resources/curriculum/:grade",
      },
      // Dynamic blog post pages
      {
        source: "/blog/:slug",
        destination: "/ko/blog/:slug",
      },
    ];
  },
};

export default nextConfig;
