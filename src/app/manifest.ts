import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.nameKo,
    short_name: "다니엘 수학",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#0a1f3d",
    icons: [
      { src: "/icons/icon-192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-192", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
