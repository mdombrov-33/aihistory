// Pure URL/page clamping and slicing shared by collection views.
export function paginate<T>(items: readonly T[], requested: string | number | null, size: number) {
  const number = Number(requested);
  const pages = Math.max(1, Math.ceil(items.length / size));
  const page = Math.min(pages, Math.max(1, Number.isSafeInteger(number) ? number : 1));
  const start = (page - 1) * size;

  return {
    items: items.slice(start, start + size),
    page,
    pages,
    total: items.length,
    start,
    end: Math.min(start + size, items.length),
  };
}

export function paginationHref(path: string, query: string, key: string, page: number) {
  const params = new URLSearchParams(query);

  if (page === 1) params.delete(key);
  else params.set(key, String(page));

  return path + (params.size ? "?" + params.toString() : "");
}
