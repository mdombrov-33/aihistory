// Read text-only form fields without coercing uploaded files into strings.
export function formText(data: FormData, name: string, fallback = "") {
  const value = data.get(name);

  return typeof value === "string" ? value : fallback;
}
