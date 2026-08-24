import { buildRssFeed } from "@/lib/rss";

export function GET() {
  return new Response(buildRssFeed("en"), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
