"use client";

// Complete local account journeys; passwords and tokens never enter persistent state.

import { profileSchema } from "@/state/guest/product";
import { formText } from "@/lib/forms";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Eye, EyeOff, Mail, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useJourney, updateJourney } from "@/state/guest/store";
import { safeDestination } from "@/lib/navigation";

export type AuthMode =
  | "sign-in"
  | "create-account"
  | "reset-password"
  | "verify-email"
  | "new-password";

export function AuthForm({
  mode,
  next,
  initialState,
}: {
  mode: AuthMode;
  next?: string;
  initialState?: string;
}) {
  const [shown, setShown] = useState(false),
    [submitted, setSubmitted] = useState(false);

  const [expired, setExpired] = useState(initialState === "expired"),
    [message, setMessage] = useState("");

  const router = useRouter(),
    { product } = useJourney();

  const destination = safeDestination(next, "/my-space");

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
      description: "Start a password recovery preview.",
      action: "Preview recovery",
    },
    "verify-email": {
      title: "One more connection.",
      description: "Confirm the email attached to your account.",
      action: "Verify email in preview",
    },
    "new-password": {
      title: "A fresh way in.",
      description: "Choose a new password to explore the recovery flow.",
      action: "Save password preview",
    },
  }[mode];

  return (
    <div className="auth-form w-full text-foreground">
      <h1 className="text-3xl leading-tight sm:text-4xl">{content.title}</h1>
      <p className="mb-6 mt-3 text-base leading-relaxed text-muted-foreground">
        {content.description}
      </p>
      {mode === "verify-email" ? (
        <div className="grid gap-4">
          <Mail className="size-7 text-primary" aria-hidden="true" />
          <h2 className="text-2xl">
            {expired
              ? "This example link has expired."
              : submitted
                ? "Email verified in preview."
                : "Check your inbox."}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {expired
              ? "Request another verification link to keep going."
              : submitted
                ? "Your device-local profile is now marked verified. No identity service was contacted."
                : `A live verification link would be sent to ${product.profile?.email ?? "your email address"}. You can try the verification state here.`}
          </p>
          {submitted ? (
            <Button asChild>
              <Link href={destination}>
                Continue
                <ArrowRight />
              </Link>
            </Button>
          ) : expired ? (
            <Button
              onClick={() => {
                setExpired(false);
                setMessage(
                  "A replacement verification link would be requested here. No email was sent.",
                );
              }}
            >
              Preview replacement link
            </Button>
          ) : (
            <Button
              onClick={() => {
                if (!product.profile) {
                  setMessage("Create a local account preview first, or continue as a guest.");

                  return;
                }

                updateJourney((s) => ({
                  ...s,
                  product: {
                    ...s.product,
                    profile: s.product.profile ? { ...s.product.profile, verified: true } : null,
                  },
                }));
                setSubmitted(true);
              }}
            >
              Verify email in preview
              <Check />
            </Button>
          )}
          {!submitted ? (
            <Button
              variant="ghost"
              onClick={() => {
                setExpired(!expired);
                setMessage("");
              }}
            >
              {expired ? "Use valid link preview" : "Try an expired link"}
            </Button>
          ) : null}
        </div>
      ) : submitted ? (
        <div className="grid gap-4">
          <Check className="size-7 text-primary" aria-hidden="true" />
          <h2 className="text-2xl">
            {mode === "reset-password"
              ? "Recovery request previewed."
              : "Password change previewed."}
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {mode === "reset-password"
              ? "In a connected account, you would receive a recovery email. No email was sent."
              : "No password was stored or sent. You can return to your account or sign-in screen."}
          </p>
          <Button asChild>
            <Link
              href={
                mode === "reset-password"
                  ? `/new-password?next=${encodeURIComponent(destination)}`
                  : destination
              }
            >
              {mode === "reset-password" ? "Open password-reset preview" : "Continue"}
              <ArrowRight />
            </Link>
          </Button>
        </div>
      ) : expired ? (
        <div className="grid gap-4">
          <h2 className="text-2xl">This reset link has expired.</h2>
          <p className="text-sm text-muted-foreground">
            Start another recovery request to receive a fresh link.
          </p>
          <Button asChild>
            <Link href={`/reset-password?next=${encodeURIComponent(destination)}`}>
              Request another link
            </Link>
          </Button>
        </div>
      ) : (
        <>
          {mode === "sign-in" || mode === "create-account" ? (
            <>
              <Button
                type="button"
                variant="outline"
                className="google-sign-in h-11 w-full bg-background text-sm"
                onClick={() =>
                  toast("Google sign-in is not connected. Try the local email preview below.")
                }
              >
                Continue with Google
              </Button>
              <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground before:h-px before:flex-1 before:bg-rule after:h-px after:flex-1 after:bg-rule">
                or continue with email
              </div>
            </>
          ) : null}
          <form
            className="grid gap-4"
            onSubmit={(e) => {
              e.preventDefault();

              const data = new FormData(e.currentTarget);

              if (
                mode !== "new-password" &&
                !profileSchema.shape.email.safeParse(formText(data, "email")).success
              ) {
                setMessage("Enter a complete email address, such as reader@example.com.");

                return;
              }

              if (mode === "reset-password" || mode === "new-password") {
                if (mode === "new-password" && data.get("password") !== data.get("confirm")) {
                  setMessage("The passwords do not match. Enter the same password in both fields.");

                  return;
                }

                e.currentTarget.reset();
                setSubmitted(true);
                setMessage("");

                return;
              }

              const email = formText(data, "email").trim();

              const candidate = profileSchema.safeParse({
                name: formText(data, "name", email.split("@")[0]).trim(),
                email,
                verified: product.profile?.email === email && product.profile.verified,
              });

              if (!candidate.success) {
                setMessage("Enter your name and a complete email address before continuing.");

                return;
              }

              updateJourney((s) => ({
                ...s,
                product: {
                  ...s.product,
                  profile: candidate.data,
                },
              }));
              toast("Local account preview opened. No credentials were sent.");
              router.push(
                mode === "create-account"
                  ? `/verify-email?next=${encodeURIComponent(destination)}`
                  : destination,
              );
            }}
          >
            {mode === "create-account" ? (
              <div className="grid gap-2">
                <Label htmlFor="display-name">Your name</Label>
                <Input
                  id="display-name"
                  name="name"
                  required
                  maxLength={80}
                  autoComplete="name"
                  placeholder="What should we call you?"
                />
              </div>
            ) : null}
            {mode !== "new-password" ? (
              <div className="grid gap-2">
                <Label htmlFor="auth-email">Email address</Label>
                <Input
                  id="auth-email"
                  type="email"
                  name="email"
                  required
                  maxLength={254}
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </div>
            ) : null}
            {mode !== "reset-password" ? (
              <div className="grid gap-2">
                <div className="flex items-center justify-between gap-3">
                  <Label htmlFor="auth-password">
                    {mode === "new-password" ? "New password" : "Password"}
                  </Label>
                  {mode === "sign-in" ? (
                    <Link
                      href={`/reset-password?next=${encodeURIComponent(destination)}`}
                      className="inline-flex min-h-11 items-center text-sm text-primary underline underline-offset-4"
                    >
                      Forgot password?
                    </Link>
                  ) : null}
                </div>
                <div className="relative">
                  <Input
                    id="auth-password"
                    name="password"
                    type={shown ? "text" : "password"}
                    required
                    minLength={mode === "sign-in" ? 1 : 12}
                    maxLength={200}
                    autoComplete={mode === "sign-in" ? "current-password" : "new-password"}
                    className="min-h-11 pr-12"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="absolute right-0 top-0"
                    aria-label={shown ? "Hide password" : "Show password"}
                    onClick={() => setShown(!shown)}
                  >
                    {shown ? <EyeOff /> : <Eye />}
                  </Button>
                </div>
                {mode !== "sign-in" ? (
                  <p className="text-xs text-muted-foreground">
                    At least 12 characters. Use a sample password for this preview.
                  </p>
                ) : null}
              </div>
            ) : null}
            {mode === "new-password" ? (
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm new password</Label>
                <Input
                  id="confirm-password"
                  name="confirm"
                  type={shown ? "text" : "password"}
                  required
                  minLength={12}
                  maxLength={200}
                  autoComplete="new-password"
                />
              </div>
            ) : null}
            <Button type="submit" className="mt-2 w-full">
              {content.action}
              <ArrowRight />
            </Button>
          </form>
        </>
      )}
      {message ? (
        <p className="mt-4 text-sm" role="alert">
          {message}
        </p>
      ) : null}
      <div className="mt-5 grid gap-2 text-center text-sm">
        <Link
          href={destination}
          className="flex min-h-11 items-center justify-center gap-2 text-primary"
        >
          Continue as guest
          <ArrowRight className="size-4" />
        </Link>
        {mode === "sign-in" ? (
          <p>
            New here?{" "}
            <Link
              className="text-primary underline underline-offset-4"
              href={`/create-account?next=${encodeURIComponent(destination)}`}
            >
              Create an account
            </Link>
          </p>
        ) : (
          <Link
            href={`/sign-in?next=${encodeURIComponent(destination)}`}
            className="inline-flex min-h-11 items-center justify-center text-primary underline underline-offset-4"
          >
            Back to sign in
          </Link>
        )}
      </div>
      <p className="auth-preview-note mt-6 border-t border-rule pt-4 text-xs leading-relaxed text-muted-foreground">
        Account preview · profile details stay on this device. Passwords are never stored, and no
        sign-in or email service is connected.
      </p>
    </div>
  );
}
