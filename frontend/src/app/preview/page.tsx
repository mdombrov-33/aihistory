// Product-flow navigation for reviewing connected local frontend states.

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FeaturePage } from "@/components/app/feature-page";

const flows = [
  [
    "/premium",
    "Premium selection",
    "Compare free access and the Premium proposal, then review a selection.",
  ],
  [
    "/account/membership",
    "Membership & usage",
    "Try available, exhausted and paused sample allowances.",
  ],
  [
    "/guide",
    "Personal learning guide",
    "Create a trail, choose interests, add lessons and save private notes.",
  ],
  [
    "/create",
    "Question to lesson plan",
    "Save a question, edit its outline and explore delivery or retry states.",
  ],
  ["/account", "Your account", "Profile, verification, security and local sign-out."],
  [
    "/verify-email?state=expired",
    "Email verification",
    "Try an expired link and replacement, or verify a local profile.",
  ],
  [
    "/new-password?state=expired",
    "Password recovery",
    "Expired-link handling and the new-password form.",
  ],
  [
    "/settings#generation-preferences",
    "Generation preferences",
    "Choose supported task providers without entering credentials.",
  ],
  [
    "/stories/great-wave-made-by-hand",
    "Lesson community",
    "Local ratings, likes, editable comments, source reports and guide entry.",
  ],
  [
    "/stories/great-wave-made-by-hand/play/0",
    "Questions inside a lesson",
    "Open Ask to search prepared context or follow a broader question.",
  ],
  [
    "/explore",
    "Library discovery",
    "Topic and duration filters, sorting and shareable pagination.",
  ],
] as const;

export const metadata = { title: "Product preview" };

export default function PreviewPage() {
  return (
    <FeaturePage
      title="Explore the product flows"
      description="Connected local screens. No payment, identity or generation service is invoked."
    >
      <div className="mb-10 divide-y divide-rule border-y border-rule">
        {flows.map(([href, title, description]) => (
          <Link
            key={href}
            href={href}
            className="grid items-center gap-3 py-5 hover:text-primary sm:grid-cols-[minmax(0,.8fr)_minmax(0,1.3fr)_auto]"
          >
            <h2 className="text-xl">{title}</h2>
            <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>
            <ArrowRight className="size-5" aria-hidden="true" />
          </Link>
        ))}
      </div>
    </FeaturePage>
  );
}
