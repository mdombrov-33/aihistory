// Recovery completion and expired-link account preview.

import { AuthScreen } from "@/features/account/auth-screen";

export const metadata = { title: "Choose a new password" };

export default async function PasswordPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; state?: string }>;
}) {
  const { next, state } = await searchParams;

  return (
    <AuthScreen
      mode="new-password"
      next={typeof next === "string" ? next : undefined}
      initialState={typeof state === "string" ? state : undefined}
    />
  );
}
