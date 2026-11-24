// Shared authentication-preview layout around the selected form.

import Image from "next/image";
import { AuthForm, type AuthMode } from "./auth-form";

export function AuthScreen({ mode, next }: { mode: AuthMode; next?: string }) {
  return (
    <main id="main-content" className="auth-layout">
      <section className="auth-art">
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
      <section className="auth-form-wrap">
        <AuthForm mode={mode} next={next} />
      </section>
    </main>
  );
}
