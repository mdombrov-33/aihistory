// Account creation preserves the intended destination through local verification.

import { AuthScreen } from "@/features/account/auth-screen";

export const metadata = { title: "Create account" };

export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams;

  return <AuthScreen mode="create-account" next={typeof next === "string" ? next : undefined} />;
}
