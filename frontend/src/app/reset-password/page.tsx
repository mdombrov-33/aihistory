import { AuthScreen } from "@/features/account/auth-screen";
export const metadata = { title: "reset password" };
export default function Page() {
  return <AuthScreen mode="reset-password" />;
}
