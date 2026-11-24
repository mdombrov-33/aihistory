// Missing-route presentation and a path back to discovery.

import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="main-content" className="empty-page">
      <Compass aria-hidden="true" />
      <h1>A little off the map.</h1>
      <p>We couldn’t find that page. There are plenty of stories still to explore.</p>
      <Button asChild>
        <Link href="/explore">Explore the stories</Link>
      </Button>
    </main>
  );
}
