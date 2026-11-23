import { AuthScreen } from "@/features/account/auth-screen";
export const metadata = { title: "create account" };
export default function Page() {
  return <AuthScreen mode="create-account" />;
}
