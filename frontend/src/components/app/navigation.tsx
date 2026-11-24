"use client";

// Shared application navigation; active states and responsive layout stay with the links.

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
    <Link
      href="/"
      className={cn(
        "brand inline-flex min-h-11 items-center gap-3 font-heading text-[30px] tracking-[0.025em] text-foreground max-[1100px]:text-[25px]",
        compact && "brand-compact",
      )}
      aria-label="History, home"
    >
      <Hourglass className="h-8.5 w-[29px] stroke-[1.5] text-primary" aria-hidden="true" />
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
      <header className="app-header relative z-30 h-15 border-b border-rule bg-background">
        <div className="header-inner m-auto flex h-full w-[calc(100%_-_80px)] max-w-[1500px] items-center gap-7.5 max-[1100px]:w-[calc(100%_-_40px)] max-[1100px]:gap-5 max-[760px]:w-[calc(100%_-_32px)]">
          <Brand />
          <nav
            className="desktop-nav flex items-center gap-4.5 self-stretch border-l border-border/40 pl-[25px] max-[1100px]:gap-[5px] max-[1100px]:pl-[15px] max-[760px]:hidden"
            aria-label="Main navigation"
          >
            {items.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                aria-current={active(href) ? "page" : undefined}
                className="relative flex items-center gap-[11px] px-4.5 py-3.5 text-[17px] text-foreground hover:text-primary aria-[current]:text-primary aria-[current]:after:absolute aria-[current]:after:inset-x-1.5 aria-[current]:after:bottom-0.5 aria-[current]:after:h-[3px] aria-[current]:after:rounded-[2px] aria-[current]:after:bg-primary aria-[current]:after:content-[''] max-[1100px]:px-3 max-[1100px]:text-[15px]"
              >
                <Icon className="size-[21px] stroke-[1.5]" aria-hidden="true" />
                {label}
              </Link>
            ))}
          </nav>
          <div className="header-actions ml-auto flex items-center gap-3 max-[760px]:gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button asChild variant="ghost" size="icon" className="touch-icon text-foreground">
                  <Link href="/settings" aria-label="Settings and appearance">
                    <Settings aria-hidden="true" />
                  </Link>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Settings & appearance</TooltipContent>
            </Tooltip>
            <Button
              asChild
              variant="outline"
              className="sign-in-link min-h-10 rounded-[14px] border-border bg-transparent px-5 text-foreground max-[760px]:min-h-[38px] max-[760px]:px-3.5 max-[760px]:text-[13px]"
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        </div>
      </header>
      <nav
        className="mobile-nav fixed inset-x-0 bottom-0 z-40 hidden justify-around border-t border-border bg-background px-[5px] pt-1.5 pb-[max(8px,env(safe-area-inset-bottom))] max-[760px]:flex"
        aria-label="Main navigation"
      >
        {items.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            aria-current={active(href) ? "page" : undefined}
            className="flex min-w-16 flex-col items-center gap-1 px-2.5 py-1.5 text-[11px] text-muted-foreground aria-[current]:text-primary"
          >
            <Icon className="size-[21px] stroke-[1.6]" aria-hidden="true" />
            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </>
  );
}
