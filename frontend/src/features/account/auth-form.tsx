"use client";

// Guest-compatible authentication form preview; no identity service is connected.

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
      description: "Pick up where your curiosity left off.",
      action: "Sign in",
    },
    "create-account": {
      title: "Keep your curiosity close.",
      description: "Your lessons, saved passages and questions in one place.",
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
    <div className="auth-form w-full text-foreground">
      <h1 className="text-3xl leading-tight sm:text-4xl">{content.title}</h1>
      <p className="mb-6 mt-3 text-base leading-relaxed text-muted-foreground">
        {content.description}
      </p>
      {mode === "verify-email" || submitted ? (
        <div className="form-stack grid gap-4 [&>[data-slot=button]]:w-full">
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
          <Link className="text-primary underline [text-underline-offset:4px]" href="/sign-in">
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
                className="google-sign-in h-11 w-full border-border bg-background text-sm text-foreground"
                onClick={() => toast("Google sign-in is not connected in this frontend preview.")}
              >
                Continue with Google
              </Button>
              <div className="auth-divider my-5 flex items-center gap-3 text-xs text-muted-foreground before:h-px before:flex-1 before:bg-rule after:h-px after:flex-1 after:bg-rule">
                or continue with email
              </div>
            </>
          ) : null}
          <form
            className="form-stack grid gap-4 [&>[data-slot=button]]:w-full"
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
              <div className="form-field grid gap-2">
                <Label htmlFor="display-name">Your name</Label>
                <Input
                  className="h-11 border-input bg-background text-base text-foreground placeholder:text-muted-foreground"
                  id="display-name"
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={80}
                  placeholder="What should we call you?"
                />
              </div>
            ) : null}
            <div className="form-field grid gap-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                className="h-11 border-input bg-background text-base text-foreground placeholder:text-muted-foreground"
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
              <div className="form-field grid gap-2">
                <div className="form-row gap-3.5 flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  {mode === "sign-in" ? (
                    <Link
                      className="text-sm text-primary underline [text-underline-offset:4px]"
                      href="/reset-password"
                    >
                      Forgot password?
                    </Link>
                  ) : null}
                </div>
                <div className="password-input relative [&_input]:pr-13 [&_button]:absolute [&_button]:right-0.5 [&_button]:top-0">
                  <Input
                    className="h-11 border-input bg-background text-base text-foreground placeholder:text-muted-foreground"
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
                  <p id="password-hint" className="field-hint text-[14px] text-muted-foreground">
                    At least 12 characters. Use a sample password for this preview.
                  </p>
                ) : null}
              </div>
            ) : null}
            <Button type="submit" className="border-border bg-primary text-primary-foreground">
              {content.action}
              <ArrowRight />
            </Button>
          </form>
          <p className="auth-guest mt-4 text-center text-sm [&_a]:inline-flex [&_a]:min-h-11 [&_a]:items-center [&_a]:gap-2 [&_a]:text-primary [&_svg]:size-4">
            <Link href={destination}>
              Continue as guest
              <ArrowRight />
            </Link>
          </p>
          <p className="auth-alternative mt-2 text-center text-sm text-muted-foreground">
            {mode === "sign-in" ? (
              <>
                New here?{" "}
                <Link
                  className="text-primary underline [text-underline-offset:4px]"
                  href="/create-account"
                >
                  Create an account
                </Link>
              </>
            ) : (
              <Link className="text-primary underline [text-underline-offset:4px]" href="/sign-in">
                Already have an account? Sign in
              </Link>
            )}
          </p>
        </>
      )}
      <p className="auth-preview-note mt-6 border-t border-rule pt-4 text-xs leading-relaxed text-muted-foreground">
        Account preview · Sign-in and email delivery aren’t connected. Use sample details, or
        continue as a guest.
      </p>
    </div>
  );
}
