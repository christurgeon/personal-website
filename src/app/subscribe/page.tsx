import { siteConfig } from "@/lib/config";
import { SubscribeForm } from "@/components/SubscribeForm";
import { Sticker } from "@/components/riso/Sticker";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Subscribe",
  description: "Get new posts from christurgeon.com by email — software, markets, and travel. No schedule, no spam.",
  alternates: { canonical: "/subscribe" },
};

export default function SubscribePage() {
  return (
    <div className="mx-auto max-w-[1240px] px-5 py-10 sm:px-7">
      <header className="animate-fade-in relative mb-12 md:mb-16">
        <div className="font-mono-label mb-4" style={{ color: "var(--muted)" }}>
          [ MAILING LIST ]
        </div>
        <h1
          className="font-display leading-[0.92] tracking-[-0.04em] uppercase"
          style={{ fontSize: "clamp(2.8rem, 9vw, 6.5rem)" }}
        >
          Never miss a{" "}
          <span
            className="inline-block border-[3px] px-[0.12em]"
            style={{
              background: "var(--yellow)",
              color: "var(--ink)",
              borderColor: "var(--border)",
              boxShadow: "6px 6px 0 var(--border)",
              transform: "rotate(-2deg)",
            }}
          >
            Post
          </span>
        </h1>
        <p className="animate-fade-in-delay-1 mt-6 max-w-2xl text-lg md:text-xl" style={{ color: "var(--muted)" }}>
          New posts on software, markets, and travel — sent when there&apos;s something worth reading. No schedule, no
          spam.
        </p>
        <div className="animate-fade-in-delay-2 mt-8 flex flex-wrap items-center gap-5">
          <Sticker color="red" rotate={-5}>
            Free Forever
          </Sticker>
          <Sticker color="yellow" rotate={4}>
            No Spam
          </Sticker>
          <Sticker color="blue" rotate={-2}>
            Unsubscribe Anytime
          </Sticker>
        </div>
      </header>

      <section className="animate-fade-in-delay-2 max-w-[720px]">
        <div
          className="border-[3px] p-6 sm:p-8"
          style={{ background: "var(--card)", borderColor: "var(--border)", boxShadow: "8px 8px 0 var(--border)" }}
        >
          <SubscribeForm variant="page" />
          <div className="font-mono-label mt-5 flex flex-wrap gap-x-5 gap-y-1" style={{ color: "var(--muted)" }}>
            <a href="/blog/feed.xml" className="underline">
              Prefer RSS?
            </a>
            <a href={siteConfig.newsletter.archiveUrl} target="_blank" rel="noopener noreferrer" className="underline">
              Read past emails
            </a>
            <a href={siteConfig.newsletter.url} target="_blank" rel="noopener noreferrer" className="underline">
              Powered by Buttondown
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
