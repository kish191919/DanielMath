import { buildRssFeed } from "@/lib/rss";

export function GET() {
  return new Response(buildRssFeed("ko"), {
    headers: { "Content-Type": "application/xml; charset=utf-8" },
  });
}
