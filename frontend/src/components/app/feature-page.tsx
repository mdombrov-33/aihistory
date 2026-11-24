// Shared composition for task pages in the established application visual system.

import type { ReactNode } from "react";
import Link from "next/link";
import { PageHeading, PageFooter } from "./shell";

export function FeaturePage({
  title,
  description,
  children,
  action,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <main id="main-content" className="mx-auto w-full max-w-[1240px] px-5 pb-8 sm:px-9 lg:px-14">
      <PageHeading compact title={title} description={description}>
        {action}
      </PageHeading>
      {children}
      <PageFooter />
    </main>
  );
}

export function PreviewNote({ children }: { children?: ReactNode }) {
  return (
    <p className="my-6 max-w-[75ch] text-xs leading-relaxed text-muted-foreground">
      {children ??
        "Local preview · changes stay on this device. Account, payment and generation services are not connected."}{" "}
      <Link href="/preview" className="text-primary underline underline-offset-4">
        Explore preview states
      </Link>
    </p>
  );
}

export function FeatureLinks() {
  return (
    <nav
      aria-label="Your space"
      className="mb-8 flex flex-wrap gap-x-6 gap-y-1 border-b border-rule pb-3 text-sm [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center [&_a:hover]:text-primary"
    >
      <Link href="/my-space">My library</Link>
      <Link href="/guide">Learning guide</Link>
      <Link href="/account">Account</Link>
      <Link href="/account/membership">Membership</Link>
    </nav>
  );
}
