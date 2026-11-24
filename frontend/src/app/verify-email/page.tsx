// Server route for verify-email; composes prepared data and feature views.

import { AuthScreen } from "@/features/account/auth-screen";

export const metadata = { title: "verify email" };

export default function Page() {
  return <AuthScreen mode="verify-email" />;
}
