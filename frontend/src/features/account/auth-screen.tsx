// Shared compact account-preview layout; decorative imagery never sits behind the form.

import Image from "next/image";
import { AuthForm, type AuthMode } from "./auth-form";

export function AuthScreen({ mode, next }: { mode: AuthMode; next?: string }) {
  return (
    <main
      id="main-content"
      className="auth-layout mx-auto grid min-h-[calc(100svh-60px)] w-full max-w-[1120px] items-center gap-14 px-6 py-10 pb-28 sm:px-10 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-20 lg:py-14"
    >
      <section className="auth-form-wrap mx-auto w-full max-w-[400px]">
        <AuthForm mode={mode} next={next} />
      </section>
      <aside className="auth-art hidden min-w-0 lg:block" aria-label="A place for curiosity">
        <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-card">
          <Image
            src="/images/home/discovery-landscape.webp"
            alt=""
            fill
            sizes="500px"
            className="object-cover object-[52%_center]"
          />
        </div>
        <p className="mt-5 font-heading text-2xl leading-tight">
          A question can take you somewhere new.
        </p>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Explore art, science, music and the ideas that connect them.
        </p>
      </aside>
    </main>
  );
}
