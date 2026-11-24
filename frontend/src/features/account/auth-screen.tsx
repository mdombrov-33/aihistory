// Shared authentication-preview layout around the selected form.

import Image from "next/image";
import { AuthForm, type AuthMode } from "./auth-form";

export function AuthScreen({ mode, next }: { mode: AuthMode; next?: string }) {
  return (
    <main
      id="main-content"
      className="auth-layout px-5 grid grid-cols-[minmax(0,_1fr)] min-h-[calc(100dvh_-_60px)] [align-items:start] place-items-center relative isolate pt-[35px] pb-12.5 max-[760px]:px-4 max-[760px]:flex-col max-[760px]:pb-[95px] max-[760px]:pt-[160px]"
    >
      <section className="auth-art p-0 overflow-hidden absolute isolate flex items-end text-(--hero-text) bg-art-ink min-h-0 top-0 right-0 bottom-0 left-0 h-full z-[-1] [&_>_img]:z-[-2] [&_>_img]:[object-position:center] max-[760px]:[&_>_img]:[object-position:65%_top] after:[content:''] after:absolute after:top-0 after:right-0 after:bottom-0 after:left-0 after:[background:linear-gradient(_90deg,_color-mix(in_srgb,_var(--art-ink)_40%,_transparent),_color-mix(in_srgb,_var(--art-ink)_60%,_transparent)_45%,_color-mix(in_srgb,_var(--art-ink)_40%,_transparent)_),_linear-gradient(0deg,_color-mix(in_srgb,_var(--art-ink)_60%,_transparent),_transparent_70%)] after:z-[-1] max-[760px]:after:[background:linear-gradient(_0deg,_var(--art-ink)_20%,_color-mix(in_srgb,_var(--art-ink)_13%,_transparent)_100%_)] [&_h2]:text-[clamp(2.5rem,_4vw,_4rem)] [&_h2]:max-w-[450px] max-[760px]:[&_h2]:text-[30px] max-[760px]:[&_h2]:max-w-[350px] [&_p]:text-(--hero-muted) [&_p]:mt-5.5 [&_p]:max-w-[40ch] [&_p]:text-[19px] max-[760px]:[&_p]:mt-3 max-[760px]:[&_p]:text-[14px] [&_>_div]:hidden">
        <Image
          src="/images/florence.webp"
          alt="Illustrative Renaissance workshop and the city beyond it"
          fill
          priority
          sizes="(max-width:760px) 100vw,50vw"
        />
        <div>
          <h2>Some stories stay with you.</h2>
          <p>Keep the places that made you pause. Return with a new question.</p>
        </div>
      </section>
      <section className="auth-form-wrap p-0 flex justify-center items-center min-h-0 w-[min(440px,_100%)]">
        <AuthForm mode={mode} next={next} />
      </section>
    </main>
  );
}
