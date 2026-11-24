// Password recovery preserves the learner's intended return destination.

import { AuthScreen } from "@/features/account/auth-screen";

export const metadata = { title: "Reset password" };

export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;

  return <AuthScreen mode="reset-password" next={typeof next === "string" ? next : undefined} />;
}
