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
    <nav className="collection-pagination" aria-label={label + " pagination"}>
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
            <span key={n} className="pagination-number">
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
