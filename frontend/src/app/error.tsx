"use client";

// Route error recovery that keeps a retry path available.

import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main id="main-content" className="empty-page">
      <h1>This page lost its place.</h1>
      <p>Your browser-saved progress is still separate from this page. Try opening it again.</p>
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={reset}>Try again</Button>
        <Button asChild variant="outline">
          <Link href="/">Back to discovery</Link>
        </Button>
      </div>
    </main>
  );
}
