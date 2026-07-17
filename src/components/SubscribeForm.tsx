"use client";

import { useId, useState } from "react";
import { siteConfig } from "@/lib/config";
import { normalizeEmail } from "@/lib/newsletter";

type Variant = "card" | "compact" | "page";
type Status = "idle" | "submitting" | "success" | "error";

const PITCH = "New posts on software, markets, and travel — sent when there's something worth reading. No schedule, no spam.";

export function SubscribeForm({ variant }: { variant: Variant }) {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = normalizeEmail(email);
    if (!normalized) {
      setStatus("error");
      setErrorMessage("That doesn't look like an email address.");
      return;
    }
    setStatus("submitting");
    setErrorMessage(null);
    try {
      const body = new FormData();
      body.set("email", normalized);
      // Buttondown's embed endpoint doesn't send CORS headers; the opaque
      // response is fine because double opt-in confirms the subscription.
      await fetch(siteConfig.newsletter.subscribeEndpoint, {
        method: "POST",
        mode: "no-cors",
        body,
      });
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Something went wrong.");
    }
  }

  const success = (
    <div
      role="status"
      className="border-[3px] p-4"
      style={{
        background: "var(--paper)",
        color: "var(--ink)",
        borderColor: "var(--border)",
        boxShadow: "4px 4px 0 var(--border)",
      }}
    >
      <div className="font-mono-label mb-1" style={{ color: "var(--accent)" }}>
        [ ALMOST DONE ]
      </div>
      <p className="text-[0.97rem]">Check your inbox — click the confirmation link to finish subscribing.</p>
    </div>
  );

  const formRow = (
    <form
      onSubmit={handleSubmit}
      action={siteConfig.newsletter.subscribeEndpoint}
      method="post"
      className="flex flex-col gap-3 sm:flex-row"
    >
      <label htmlFor={inputId} className="sr-only">
        Email address
      </label>
      <input
        id={inputId}
        type="email"
        name="email"
        required
        autoComplete="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full min-w-0 flex-1 border-[3px] px-4 py-3 outline-none"
        style={{ background: "var(--paper)", color: "var(--ink)", borderColor: "var(--border)" }}
      />
      <button
        type="submit"
        disabled={status === "submitting"}
        className="brutal-lift-sm font-mono-label border-[3px] px-5 py-3 disabled:opacity-60"
        style={{
          background: "var(--ink)",
          color: "var(--paper)",
          borderColor: "var(--border)",
          boxShadow: "4px 4px 0 var(--border)",
        }}
      >
        {status === "submitting" ? "Subscribing…" : "Subscribe"}
      </button>
    </form>
  );

  const error = status === "error" && errorMessage && (
    <p role="alert" className="font-mono-label mt-3" style={{ color: "var(--accent)" }}>
      {errorMessage}{" "}
      <a href={siteConfig.newsletter.url} target="_blank" rel="noopener noreferrer" className="underline">
        Subscribe on Buttondown instead
      </a>
    </p>
  );

  if (variant === "card") {
    return (
      <aside
        className="border-[3px] p-6 sm:p-8"
        style={{
          background: "var(--yellow)",
          color: "var(--ink)",
          borderColor: "var(--border)",
          boxShadow: "7px 7px 0 var(--border)",
        }}
      >
        <div className="font-mono-label mb-3" style={{ opacity: 0.7 }}>
          [ MAILING LIST ]
        </div>
        <h2
          className="font-display mb-2 uppercase tracking-[-0.03em]"
          style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)", lineHeight: 0.95 }}
        >
          Get the next one by email
        </h2>
        <p className="mb-5 max-w-[52ch] text-[0.97rem]">{PITCH}</p>
        {status === "success" ? success : formRow}
        {error}
        <div className="font-mono-label mt-4 flex flex-wrap gap-x-4 gap-y-1" style={{ opacity: 0.75 }}>
          <a href="/blog/feed.xml" className="underline">
            Prefer RSS?
          </a>
          <a href={siteConfig.newsletter.url} target="_blank" rel="noopener noreferrer" className="underline">
            Powered by Buttondown
          </a>
        </div>
      </aside>
    );
  }

  if (variant === "compact") {
    return (
      <div
        className="border-[3px] p-5 sm:p-6"
        style={{
          background: "var(--paper)",
          color: "var(--ink)",
          borderColor: "var(--border)",
          boxShadow: "5px 5px 0 var(--border)",
        }}
      >
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="md:max-w-[44ch]">
            <div className="font-mono-label mb-1" style={{ opacity: 0.7 }}>
              [ MAILING LIST ]
            </div>
            <p className="text-[0.95rem]">New posts by email, whenever there&apos;s something worth reading.</p>
          </div>
          <div className="md:w-[380px] md:flex-shrink-0">{status === "success" ? success : formRow}</div>
        </div>
        {error}
      </div>
    );
  }

  // page — bare form; the /subscribe page owns the surrounding chrome
  return (
    <div>
      {status === "success" ? success : formRow}
      {error}
    </div>
  );
}
