import Link from "next/link";
import { Info, ArrowUpRight } from "lucide-react";

export function PageFooter() {
  return (
    <footer className="page-footer">
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
    <div className="page-heading">
      <div>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {children}
    </div>
  );
}
