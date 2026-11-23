import { Skeleton } from "@/components/ui/skeleton";
export default function Loading() {
  return (
    <main
      id="main-content"
      className="page-width py-12"
      aria-busy="true"
      aria-label="Loading stories"
    >
      <Skeleton className="mb-8 h-12 w-64" />
      <Skeleton className="mb-8 h-14 w-full" />
      <div className="grid gap-5 md:grid-cols-2">
        <Skeleton className="h-80" />
        <Skeleton className="h-80" />
      </div>
      <span className="sr-only">Loading stories</span>
    </main>
  );
}
