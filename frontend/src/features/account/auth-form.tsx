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
    <div className="auth-form p-7.5 w-full max-w-none [background:linear-gradient(_140deg,_color-mix(in_srgb,_var(--card)_98%,_transparent),_color-mix(in_srgb,_var(--background)_98%,_transparent)_)] border border-border rounded-[14px] text-foreground [box-shadow:0_20px_60px_color-mix(in_srgb,_var(--art-ink)_27%,_transparent)] max-[760px]:py-[25px] max-[760px]:px-5.5 max-[760px]:rounded-[12px] [&_h1]:text-[36px] max-[760px]:[&_h1]:text-[32px] [&_>_p]:mx-0 [&_>_p]:text-foreground [&_>_p]:mt-4.5 [&_>_p]:mb-5.5 [&_>_p]:text-[18px] max-[760px]:[&_>_p]:mt-4 max-[760px]:[&_>_p]:text-[16px] max-[760px]:[&_>_p]:leading-[1.5]">
      <h1>{content.title}</h1>
      <p>{content.description}</p>
      {mode === "verify-email" || submitted ? (
        <div className="form-stack grid [&>[data-slot=button]]:w-full gap-[17px] [&>p]:text-[17px]">
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
                className="google-sign-in w-full h-12 text-[16px]! [&_svg]:ml-auto border border-border bg-card text-foreground"
                onClick={() => toast("Google sign-in is not connected in this frontend preview.")}
              >
                Continue with Google
                <ArrowRight />
              </Button>
              <div className="auth-divider mx-0 gap-4 flex items-center before:[content:''] before:h-[1px] before:flex-1 after:[content:''] after:h-[1px] after:flex-1 my-4.5 text-[12px] text-foreground before:bg-card after:bg-card max-[760px]:my-4">
                or continue with email
              </div>
            </>
          ) : null}
          <form
            className="form-stack grid [&>[data-slot=button]]:w-full gap-[17px] [&>p]:text-[17px]"
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
              <div className="form-field gap-[9px] grid">
                <Label htmlFor="display-name">Your name</Label>
                <Input
                  className="border-input bg-card text-foreground placeholder:text-foreground"
                  id="display-name"
                  name="name"
                  autoComplete="name"
                  required
                  maxLength={80}
                  placeholder="What should we call you?"
                />
              </div>
            ) : null}
            <div className="form-field gap-[9px] grid">
              <Label htmlFor="email">Email address</Label>
              <Input
                className="border-input bg-card text-foreground placeholder:text-foreground"
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
              <div className="form-field gap-[9px] grid">
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
                <div className="password-input relative [&_input]:pr-13 [&_button]:absolute [&_button]:right-0.5 [&_button]:top-0.5">
                  <Input
                    className="border-input bg-card text-foreground placeholder:text-foreground"
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
          <p className="auth-guest mx-0! mt-[21px]! mb-0! text-[15px]! [&_a]:gap-2.5 [&_a]:flex [&_a]:items-center [&_a]:justify-center [&_a]:text-primary [&_a]:min-h-[35px] [&_svg]:w-4">
            <Link href={destination}>
              Continue as guest
              <ArrowRight />
            </Link>
          </p>
          <p className="auth-alternative text-center m-0 pt-[13px] text-[14px] text-foreground">
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
      <p className="auth-preview-note mx-0 mt-5 mb-0 max-w-[50ch] text-center text-[11px] leading-[1.5] text-muted-foreground max-[760px]:text-[10px]">
        Account design preview. No account is created, no email is sent, and credentials stay in
        this form.
      </p>
    </div>
  );
}
