"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Hourglass, Layers3, Plus, Settings, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const items = [
  { href: "/", label: "Discover", icon: Compass },
  { href: "/explore", label: "Explore", icon: Layers3 },
  { href: "/create", label: "Create", icon: Plus },
  { href: "/my-space", label: "My space", icon: UserRound },
];
export function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className={cn("brand", compact && "brand-compact")} aria-label="History, home">
      <Hourglass aria-hidden="true" />
      <span>HISTORY</span>
    </Link>
  );
}
export function Navigation() {
  const path = usePathname();
  const player = /^\/stories\/[^/]+\/play/.test(path);
  function active(href: string) {
    return href === "/" ? path === "/" : path.startsWith(href);
  }
  if (player) return null;
  return (
    <>
      <header className="app-header">
        <div className="header-inner">
          <Brand />
          <nav className="desktop-nav" aria-label="Main navigation">
            {items.map(({ href, label, icon: Icon }) => (
              <Link key={href} href={href} aria-current={active(href) ? "page" : undefined}>
                <Icon aria-hidden="true" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="header-actions">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild variant="ghost" size="icon" className="touch-icon">
                  <Link href="/settings" aria-label="Settings and appearance">
                    <Settings aria-hidden="true" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Settings & appearance</TooltipContent>
            </Tooltip>
            <Button asChild variant="outline" className="sign-in-link">
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        </div>
      </header>
      <nav className="mobile-nav" aria-label="Main navigation">
        {items.map(({ href, label, icon: Icon }) => (
          <Link key={href} href={href} aria-current={active(href) ? "page" : undefined}>
            <Icon aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
