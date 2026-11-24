// Server route for sign-in; composes prepared data and feature views.

import { AuthScreen } from "@/features/account/auth-screen";

export const metadata = { title: "Sign in" };

export default async function SignIn({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next } = await searchParams;

  return <AuthScreen mode="sign-in" next={typeof next === "string" ? next : undefined} />;
}
