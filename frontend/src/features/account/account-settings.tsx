"use client";

// Editable device-local account preview with verification, security and sign-out paths.

import { profileSchema } from "@/state/guest/product";
import { formText } from "@/lib/forms";
import { useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useJourney, updateJourney } from "@/state/guest/store";
import { PreviewNote } from "@/components/app/feature-page";

export function AccountSettings() {
  const { product } = useJourney();
  const [profileError, setProfileError] = useState("");
  const [remove, setRemove] = useState(false);

  if (!product.profile)
    return (
      <div className="max-w-[650px] pb-10">
        <h2 className="text-2xl">A place for your learning.</h2>
        <p className="mt-3 text-base leading-relaxed text-muted-foreground">
          Your guest library already lives on this device. Try the account screens to explore a
          profile, membership and verification without connecting an identity service.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild>
            <Link href="/sign-in?next=%2Faccount">Try account sign-in</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/guide">Open learning guide</Link>
          </Button>
        </div>
        <PreviewNote />
      </div>
    );

  const profile = product.profile;

  return (
    <div className="grid gap-10 pb-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(260px,.8fr)]">
      <form
        key={profile.email}
        className="grid content-start gap-5"
        onSubmit={(e) => {
          e.preventDefault();

          const data = new FormData(e.currentTarget);
          const email = formText(data, "email").trim();

          const candidate = profileSchema.safeParse({
            name: formText(data, "name").trim(),
            email,
            verified: email === profile.email && profile.verified,
          });

          if (!candidate.success) {
            setProfileError(
              "Enter your name and a complete email address, such as reader@example.com.",
            );

            return;
          }

          setProfileError("");

          updateJourney((s) => ({
            ...s,
            product: {
              ...s.product,
              profile: candidate.data,
            },
          }));
          toast.success("Profile saved on this device");
        }}
      >
        <h2 className="text-2xl">Your profile</h2>
        <div className="grid gap-2">
          <Label htmlFor="profile-name">Name</Label>
          <Input
            id="profile-name"
            name="name"
            required
            maxLength={80}
            defaultValue={profile.name}
            autoComplete="name"
          />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="profile-email">Email</Label>
          <Input
            id="profile-email"
            name="email"
            type="email"
            required
            maxLength={254}
            defaultValue={profile.email}
            autoComplete="email"
          />
        </div>
        <p className="text-sm text-muted-foreground">
          {profile.verified ? "Email verified in local preview." : "Email has not been verified."}{" "}
          <Link
            href="/verify-email?next=%2Faccount"
            className="text-primary underline underline-offset-4"
          >
            {profile.verified ? "View verification" : "Verify email"}
          </Link>
        </p>
        {profileError ? (
          <p role="alert" className="text-sm">
            {profileError}
          </p>
        ) : null}
        <Button type="submit" className="justify-self-start">
          Save profile
        </Button>
        <PreviewNote>
          Profile changes stay on this device. Passwords are never stored by this preview.
        </PreviewNote>
      </form>
      <div className="grid content-start gap-7">
        <section className="border-b border-rule pb-6">
          <h2 className="text-2xl">Membership</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            {product.membership === "free" ? "Free library access" : "Premium sample membership"}
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link href="/account/membership">Membership & usage</Link>
          </Button>
        </section>
        <section>
          <h2 className="text-2xl">Security & access</h2>
          <div className="mt-3 grid justify-items-start gap-2">
            <Button asChild variant="outline">
              <Link href="/new-password?next=%2Faccount">Change password preview</Link>
            </Button>
            <Button
              variant="ghost"
              onClick={() => {
                updateJourney((s) => ({ ...s, product: { ...s.product, profile: null } }));
                toast("Local account preview ended. Guest activity is preserved.");
              }}
            >
              Sign out of preview
            </Button>
          </div>
        </section>
        <section className="border-t border-rule pt-5">
          <h2 className="text-xl">Remove account preview</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Remove the local profile while keeping guest learning activity. No real account is
            deleted.
          </p>
          {remove ? (
            <div className="mt-3 flex flex-wrap gap-2">
              <Button
                variant="destructive"
                onClick={() =>
                  updateJourney((s) => ({
                    ...s,
                    product: { ...s.product, profile: null, membership: "free" },
                  }))
                }
              >
                Remove local profile
              </Button>
              <Button variant="outline" onClick={() => setRemove(false)}>
                Keep profile
              </Button>
            </div>
          ) : (
            <Button variant="ghost" className="mt-2" onClick={() => setRemove(true)}>
              Remove preview profile
            </Button>
          )}
        </section>
      </div>
    </div>
  );
}
