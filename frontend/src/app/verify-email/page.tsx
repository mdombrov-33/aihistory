// Verification success, replacement and expired-link preview states.

import { AuthScreen } from "@/features/account/auth-screen";

export const metadata = { title: "Verify email" };

export default async function VerifyPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; state?: string }>;
}) {
  const { next, state } = await searchParams;

  return (
    <AuthScreen
      mode="verify-email"
      next={typeof next === "string" ? next : undefined}
      initialState={typeof state === "string" ? state : undefined}
    />
  );
}
