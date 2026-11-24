"use client";

// Personal ratings, likes and editable comment drafts, with no invented public activity.

import { formText } from "@/lib/forms";
import { useState } from "react";
import Link from "next/link";
import { Heart, Star, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useJourney, updateJourney } from "@/state/guest/store";
import { reviewSchema } from "@/state/guest/product";

export function Community({ slug }: { slug: string }) {
  const { product } = useJourney();
  const current = product.reviews[slug] ?? reviewSchema.parse({});

  const [edit, setEdit] = useState<string | null>(null),
    [feedback, setFeedback] = useState("");

  function updateReview(change: (value: typeof current) => typeof current) {
    updateJourney((s) => ({
      ...s,
      product: {
        ...s.product,
        reviews: {
          ...s.product.reviews,
          [slug]: change(s.product.reviews[slug] ?? reviewSchema.parse({})),
        },
      },
    }));
  }

  return (
    <div className="min-w-0">
      <h2 className="text-3xl">What stayed with you?</h2>
      <p className="mt-3 text-base text-muted-foreground">
        Keep your own review and thoughts about this lesson.
      </p>
      {!product.profile ? (
        <div className="mt-5">
          <p className="text-sm text-muted-foreground">
            Try an account preview to leave a local review. Public ratings and comments are not
            connected.
          </p>
          <Button asChild variant="outline" className="mt-4">
            <Link href={`/sign-in?next=${encodeURIComponent("/stories/" + slug)}`}>
              Sign in to rate or comment
            </Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="mt-5 flex flex-wrap items-center gap-4">
            <Button
              variant="outline"
              aria-pressed={current.liked}
              onClick={() => updateReview((v) => ({ ...v, liked: !v.liked }))}
            >
              <Heart fill={current.liked ? "currentColor" : "none"} />
              {current.liked ? "Liked by you" : "Like this lesson"}
            </Button>
            <span className="text-xs text-muted-foreground">Your review · saved locally</span>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {(["clarity", "presentation", "interaction"] as const).map((kind) => (
              <fieldset key={kind} className="min-w-0">
                <legend className="text-sm font-semibold">
                  {kind === "clarity"
                    ? "Clarity & learning"
                    : kind === "presentation"
                      ? "Presentation"
                      : "Interactivity"}
                </legend>
                <div className="mt-1 flex flex-wrap">
                  {[1, 2, 3, 4, 5].map((score) => (
                    <Button
                      key={score}
                      size="icon"
                      variant="ghost"
                      aria-label={`Rate ${kind} ${score} out of 5`}
                      aria-pressed={current.ratings[kind] === score}
                      onClick={() =>
                        updateReview((v) => ({ ...v, ratings: { ...v.ratings, [kind]: score } }))
                      }
                    >
                      <Star
                        className="text-primary"
                        fill={current.ratings[kind] >= score ? "currentColor" : "none"}
                      />
                    </Button>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
          <Button
            variant="ghost"
            className="mt-1"
            onClick={() =>
              updateReview((v) => ({
                ...v,
                ratings: { clarity: 0, presentation: 0, interaction: 0 },
              }))
            }
          >
            Clear my ratings
          </Button>
          <form
            className="mt-5 grid gap-3"
            onSubmit={(e) => {
              e.preventDefault();

              const body = formText(new FormData(e.currentTarget), "comment").trim();

              if (body.length < 4) {
                setFeedback("Add a little more detail before saving your comment.");

                return;
              }

              if (current.comments.length >= 100 && !edit) {
                setFeedback("Remove a local comment before adding another.");

                return;
              }

              updateReview((v) => ({
                ...v,
                comments: edit
                  ? v.comments.map((c) => (c.id === edit ? { ...c, body, edited: true } : c))
                  : [
                      {
                        id: crypto.randomUUID(),
                        body,
                        author: product.profile!.name,
                        createdAt: Date.now(),
                        edited: false,
                      },
                      ...v.comments,
                    ],
              }));
              setEdit(null);
              e.currentTarget.reset();
              setFeedback("Comment saved locally. Nothing was posted publicly.");
            }}
          >
            <Label htmlFor="lesson-comment">{edit ? "Edit your comment" : "Your thoughts"}</Label>
            <Textarea
              key={edit ?? "new"}
              id="lesson-comment"
              name="comment"
              required
              maxLength={2000}
              minLength={4}
              rows={3}
              defaultValue={current.comments.find((c) => c.id === edit)?.body ?? ""}
              placeholder="What helped you understand it? What deserves a closer look?"
            />
            <div className="flex gap-3">
              <Button>{edit ? "Save changes" : "Save local comment"}</Button>
              {edit ? (
                <Button type="button" variant="outline" onClick={() => setEdit(null)}>
                  Cancel edit
                </Button>
              ) : null}
            </div>
          </form>
          {feedback ? (
            <output className="mt-3 block text-sm text-muted-foreground">{feedback}</output>
          ) : null}
        </>
      )}
      <section className="mt-6 border-t border-rule pt-5" aria-label="Your local comments">
        {current.comments.length ? (
          current.comments.map((comment) => (
            <article key={comment.id} className="border-b border-rule py-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold">
                  {comment.author}
                  <span className="ml-2 font-normal text-muted-foreground">
                    Local draft{comment.edited ? " · edited" : ""}
                  </span>
                </p>
                {product.profile ? (
                  <div className="flex">
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Edit local comment"
                      onClick={() => setEdit(comment.id)}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label="Delete local comment"
                      onClick={() => {
                        updateReview((v) => ({
                          ...v,
                          comments: v.comments.filter((c) => c.id !== comment.id),
                        }));

                        if (edit === comment.id) setEdit(null);
                      }}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                ) : null}
              </div>
              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed">
                {comment.body}
              </p>
            </article>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No local comments yet. No public rating or comment count is available.
          </p>
        )}
      </section>
    </div>
  );
}
