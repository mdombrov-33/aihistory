// Server route for create-account; composes prepared data and feature views.

import { AuthScreen } from "@/features/account/auth-screen";

export const metadata = { title: "create account" };

export default function Page() {
  return <AuthScreen mode="create-account" />;
}
