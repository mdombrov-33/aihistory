// Server route for reset-password; composes prepared data and feature views.

import { AuthScreen } from "@/features/account/auth-screen";

export const metadata = { title: "reset password" };

export default function Page() {
  return <AuthScreen mode="reset-password" />;
}
