import Link from "next/link";
import { Container } from "@/components/site/container";
import type { Role } from "@/lib/supabase/types";

const principalLinks = [
  { href: "/dashboard/principal", label: "홈" },
  { href: "/dashboard/principal/students", label: "학생" },
  { href: "/dashboard/principal/classes", label: "반" },
  { href: "/dashboard/principal/inquiries", label: "상담 문의" },
  { href: "/dashboard/principal/messages", label: "메시지" },
];

const parentLinks = [
  { href: "/dashboard/parent/children", label: "자녀" },
  { href: "/dashboard/parent/progress", label: "진행 상황" },
  { href: "/dashboard/parent/messages", label: "메시지" },
];

export function DashboardNav({ role, unreadCount = 0 }: { role: Role; unreadCount?: number }) {
  const links = role === "principal" ? principalLinks : parentLinks;
  const messagesHref = role === "principal" ? "/dashboard/principal/messages" : "/dashboard/parent/messages";
  return (
    <nav className="border-b border-navy-100 bg-navy-50/50 print:hidden">
      <Container>
        <ul className="flex gap-1 overflow-x-auto py-2">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-navy-700 hover:bg-white hover:text-navy-900"
              >
                <span className="font-ko" lang="ko">
                  {link.label}
                </span>
                {link.href === messagesHref && unreadCount > 0 && (
                  <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-semibold text-white">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </nav>
  );
}
