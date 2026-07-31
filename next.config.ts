import type { NextConfig } from "next";

const koRoutes = [
  "/programs",
  "/inquire",
  "/resources",
  "/resources/curriculum",
  "/resources/sol",
  "/resources/testing",
  "/resources/testing/moems",
  "/resources/testing/amc-8",
  "/thanks",
  "/school-calendar",
  "/blog",
  "/privacy",
  "/terms",
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
