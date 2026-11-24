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
    <main
      id="main-content"
      className="empty-page my-0 mx-auto px-6 max-w-[700px] text-center pt-22.5 pb-[140px] max-[760px]:pt-[65px] [&_>_svg]:mx-auto [&_>_svg]:mt-0 [&_>_svg]:mb-[25px] [&_>_svg]:text-primary [&_>_svg]:w-11 [&_>_svg]:h-11 [&_>_svg]:[stroke-width:1.2] [&_h1]:text-[48px] max-[760px]:[&_h1]:text-[38px] [&_p]:mx-auto [&_p]:mt-[25px] [&_p]:mb-7.5 [&_p]:text-muted-foreground [&_p]:text-[19px] max-[760px]:[&_p]:text-[17px]"
    >
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
