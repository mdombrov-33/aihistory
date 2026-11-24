// Shared page-width and application-shell presentation helpers.

import Link from "next/link";
import { Info, ArrowUpRight } from "lucide-react";

export function PageFooter() {
  return (
    <footer className="page-footer py-6.5 px-0 gap-5 [border-top:1px_solid_var(--line-soft)] flex justify-between text-muted-foreground text-[13px] max-[760px]:gap-[15px] max-[760px]:pt-[25px] max-[760px]:text-[12px] max-[760px]:mb-19.5 max-[760px]:flex-col [&_p]:gap-2 [&_p]:flex [&_p]:items-center [&_>_div]:gap-6 [&_>_div]:flex [&_>_div]:items-center [&_a]:gap-2 [&_a]:flex [&_a]:items-center [&_svg]:w-3.5 [&_svg]:h-3.5 col-span-full">
      <p>
        <Info aria-hidden="true" /> Prepared stories · historical sources and objects
      </p>
      <div>
        <Link href="/about">
          About this preview <ArrowUpRight aria-hidden="true" />
        </Link>
        <Link href="/settings">Settings</Link>
        <Link href="/screen-gallery">Screen gallery</Link>
      </div>
    </footer>
  );
}

export function PageHeading({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="page-heading px-0 gap-6 flex items-end justify-between pt-13.5 pb-8 max-[760px]:block max-[760px]:pt-[35px] max-[760px]:pb-6.5 [&_p]:mt-[15px] [&_p]:text-muted-foreground [&_p]:text-[19px] max-[760px]:[&_p]:text-[17px] [&_h1]:text-[48px] max-[760px]:[&_h1]:text-[38px] max-[760px]:[&>[data-slot=button]]:mt-5">
      <div>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </div>
  );
}
