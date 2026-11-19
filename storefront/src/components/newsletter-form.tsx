"use client";

import { useState } from "react";
import { ArrowRightIcon, CheckIcon } from "./icons";

export function NewsletterForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setDone(true);
    setEmail("");
  };

  if (done) {
    return (
      <div
        className={`flex items-center gap-3 border px-4 py-3.5 text-sm ${
          dark ? "border-paper/25 text-paper" : "border-ink/20 text-ink"
        }`}
        role="status"
        aria-live="polite"
      >
        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-volt text-ink">
          <CheckIcon size={14} />
        </span>
        Listo. Te avisaremos primero cuando llegue el próximo drop.
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div
        className={`flex items-center border-b ${
          dark ? "border-paper/30 focus-within:border-volt" : "border-ink/30 focus-within:border-ink"
        }`}
      >
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Tu correo electrónico"
          aria-label="Correo electrónico"
          className={`w-full bg-transparent py-3.5 text-sm outline-none ${
            dark ? "text-paper placeholder:text-paper/45" : "text-ink placeholder:text-muted"
          }`}
        />
        <button
          type="submit"
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition ${
            dark
              ? "bg-volt text-ink hover:bg-paper"
              : "bg-ink text-paper hover:bg-volt hover:text-ink"
          }`}
          aria-label="Suscribirme"
        >
          <ArrowRightIcon size={17} />
        </button>
      </div>
      <p className={`mt-3 text-[11px] leading-relaxed ${dark ? "text-paper/45" : "text-muted"}`}>
        Al suscribirte aceptas nuestra política de tratamiento de datos. Puedes
        darte de baja cuando quieras.
      </p>
    </form>
  );
}
