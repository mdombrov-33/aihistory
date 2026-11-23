"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
export type AuthMode = "sign-in" | "create-account" | "reset-password" | "verify-email";
export function AuthForm({ mode, next = "/my-space" }: { mode: AuthMode; next?: string }) {
  const [shown, setShown] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const router = useRouter();
  const destination =
    next.startsWith("/") && !next.startsWith("//") && !next.includes("\\") ? next : "/my-space";
  const content = {
    "sign-in": {
      title: "Welcome back.",
      description: "Return to the places and questions you kept.",
      action: "Sign in",
    },
    "create-account": {
      title: "Keep your curiosity close.",
      description: "An account will keep your stories, bookmarks and conversations together.",
      action: "Create account",
    },
    "reset-password": {
      title: "Find your way back.",
      description: "Enter your email to preview the password recovery screen.",
      action: "Preview recovery",
    },
    "verify-email": {
      title: "One more connection.",
      description: "Email verification will help keep your account yours.",
      action: "Continue as guest",
    },
  }[mode];
  return (
    <div className="auth-form">
      <h1>{content.title}</h1>
      <p>{content.description}</p>
      {mode === "verify-email" || submitted ? (
        <div className="form-stack">
          <Mail size={32} aria-hidden="true" />
          <p>
            {submitted
              ? "This is where the recovery email confirmation will appear once authentication is connected."
              : "This is where you will confirm your email. For now, explore every prepared story as a guest."}
          </p>
          <Button asChild>
            <Link href={destination}>
              Continue as guest
              <ArrowRight />
            </Link>
          </Button>
          <Link className="text-link" href="/sign-in">
            Back to sign in
          </Link>
        </div>
      ) : (
        <>
          {mode === "sign-in" || mode === "create-account" ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="google-sign-in"
                onClick={() => toast("Google sign-in is not connected in this frontend preview.")}
              >
                Continue with Google
                <ArrowRight />
              </Button>
              <div className="auth-divider">or continue with email</div>
            </>
          ) : null}
          <form
            className="form-stack"
            onSubmit={(e) => {
              e.preventDefault();
              if (mode === "reset-password") {
                setSubmitted(true);
                return;
              }
              toast("Account services are not connected. Continuing in guest preview.");
              router.push(mode === "create-account" ? "/verify-email" : destination);
            }}
          >
            {mode === "create-account" ? (
              <div className="form-field">
                <Label htmlFor="display-name">Your name</Label>
                <Input
                  id="display-name"
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={80}
                  placeholder="What should we call you?"
                />
              </div>
            ) : null}
            <div className="form-field">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                placeholder="you@example.com"
              />
            </div>
            {mode !== "reset-password" ? (
              <div className="form-field">
                <div className="form-row">
                  <Label htmlFor="password">Password</Label>
                  {mode === "sign-in" ? (
                    <Link className="text-link text-sm" href="/reset-password">
                      Forgot password?
                    </Link>
                  ) : null}
                </div>
                <div className="password-input">
                  <Input
                    id="password"
                    name="password"
                    type={shown ? "text" : "password"}
                    required
                    minLength={mode === "create-account" ? 12 : 1}
                    maxLength={128}
                    autoComplete={mode === "create-account" ? "new-password" : "current-password"}
                    aria-describedby={mode === "create-account" ? "password-hint" : undefined}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    aria-label={shown ? "Hide password" : "Show password"}
                    onClick={() => setShown((v) => !v)}
                  >
                    {shown ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
                {mode === "create-account" ? (
                  <p id="password-hint" className="field-hint">
                    At least 12 characters. Use a sample password for this preview.
                  </p>
                ) : null}
              </div>
            ) : null}
            <Button type="submit">
              {content.action}
              <ArrowRight />
            </Button>
          </form>
          <p className="auth-guest">
            <Link href={destination}>
              Continue as guest
              <ArrowRight />
            </Link>
          </p>
          <p className="auth-alternative">
            {mode === "sign-in" ? (
              <>
                New here?{" "}
                <Link className="text-link" href="/create-account">
                  Create an account
                </Link>
              </>
            ) : (
              <Link className="text-link" href="/sign-in">
                Already have an account? Sign in
              </Link>
            )}
          </p>
        </>
      )}
      <p className="auth-preview-note">
        Account design preview. No account is created, no email is sent, and credentials stay in
        this form.
      </p>
    </div>
  );
}
