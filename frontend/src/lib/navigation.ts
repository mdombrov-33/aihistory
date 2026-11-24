// Keep return destinations inside the application.
export function safeDestination(value: string | undefined, fallback = "/account") {
  return value?.startsWith("/") && !value.startsWith("//") && !value.includes("\\")
    ? value
    : fallback;
}
