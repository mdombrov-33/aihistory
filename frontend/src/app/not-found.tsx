// Missing-route presentation and a path back to discovery.

import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main
      id="main-content"
      className="empty-page my-0 mx-auto px-6 max-w-[700px] text-center pt-22.5 pb-[140px] max-[760px]:pt-[65px] [&_>_svg]:mx-auto [&_>_svg]:mt-0 [&_>_svg]:mb-[25px] [&_>_svg]:text-primary [&_>_svg]:w-11 [&_>_svg]:h-11 [&_>_svg]:[stroke-width:1.2] [&_h1]:text-[48px] max-[760px]:[&_h1]:text-[38px] [&_p]:mx-auto [&_p]:mt-[25px] [&_p]:mb-7.5 [&_p]:text-muted-foreground [&_p]:text-[19px] max-[760px]:[&_p]:text-[17px]"
    >
      <Compass aria-hidden="true" />
      <h1>A little off the map.</h1>
      <p>We couldn’t find that page. There are plenty of stories still to explore.</p>
      <Button asChild>
        <Link href="/explore">Explore the stories</Link>
      </Button>
    </main>
  );
}
