// Server route for my-space; composes prepared data and feature views.

import Link from "next/link";
import { Settings } from "lucide-react";
import { PageHeading, PageFooter } from "@/components/app/shell";
import { Button } from "@/components/ui/button";
import { MySpace } from "@/features/account/my-space";

export const metadata = { title: "My space" };

export default async function MySpacePage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = new URLSearchParams();

  for (const [key, value] of Object.entries(await searchParams))
    if (typeof value === "string") query.set(key, value);

  return (
    <main
      id="main-content"
      className="page-width mx-auto w-[min(1360px,_calc(100%_-_80px))] max-[1050px]:w-[calc(100%_-_48px)] max-[760px]:w-[calc(100%_-_36px)]"
    >
      <PageHeading
        title="Your corner of history."
        description="The stories you open. The passages you keep. The questions still on your mind."
      >
        <Button asChild variant="outline">
          <Link href="/settings">
            <Settings />
            Settings
          </Link>
        </Button>
      </PageHeading>
      <MySpace query={query.toString()} />
      <PageFooter />
    </main>
  );
}
