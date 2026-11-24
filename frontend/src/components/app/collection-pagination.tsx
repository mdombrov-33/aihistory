// Accessible pagination controls shared by catalog and personal collections.

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { paginationHref } from "@/lib/pagination";

export function CollectionPagination({
  page,
  pages,
  total,
  start,
  end,
  path,
  query,
  pageKey = "page",
  label = "Results",
}: {
  page: number;
  pages: number;
  total: number;
  start: number;
  end: number;
  path: string;
  query: string;
  pageKey?: string;
  label?: string;
}) {
  if (!total) return null;

  const numbers = [...new Set([1, page - 1, page, page + 1, pages])]
    .filter((n) => n > 0 && n <= pages)
    .sort((a, b) => a - b);

  return (
    <nav
      className="collection-pagination py-6 px-0 gap-5 flex items-center justify-between mb-4.5 [border-top:1px_solid_var(--line-soft)] max-[760px]:items-start max-[760px]:flex-col [&_>_p]:text-[13px] [&_>_p]:text-muted-foreground [&_>_div]:gap-1.5 [&_>_div]:flex [&_>_div]:flex-wrap [&_>_div]:items-center"
      aria-label={label + " pagination"}
    >
      <p aria-live="polite">
        {start + 1}–{end} of {total}
      </p>
      {pages > 1 ? (
        <div>
          {page > 1 ? (
            <Button asChild variant="outline">
              <Link
                href={paginationHref(path, query, pageKey, page - 1)}
                aria-label={"Previous page of " + label}
              >
                <ArrowLeft />
                <span>Previous</span>
              </Link>
            </Button>
          ) : (
            <Button disabled variant="outline">
              <ArrowLeft />
              <span>Previous</span>
            </Button>
          )}
          {numbers.map((n, i) => (
            <span
              key={n}
              className="pagination-number gap-1.5 inline-flex items-center [&_a]:grid [&_a]:place-items-center [&_a]:min-w-11 [&_a]:min-h-11 [&_a]:rounded-[6px]"
            >
              {i > 0 && n - numbers[i - 1] > 1 ? <span aria-hidden="true">…</span> : null}
              <Link
                href={paginationHref(path, query, pageKey, n)}
                aria-label={label + ", page " + n}
                aria-current={n === page ? "page" : undefined}
              >
                {n}
              </Link>
            </span>
          ))}
          {page < pages ? (
            <Button asChild variant="outline">
              <Link
                href={paginationHref(path, query, pageKey, page + 1)}
                aria-label={"Next page of " + label}
              >
                <span>Next</span>
                <ArrowRight />
              </Link>
            </Button>
          ) : (
            <Button disabled variant="outline">
              <span>Next</span>
              <ArrowRight />
            </Button>
          )}
        </div>
      ) : null}
    </nav>
  );
}
