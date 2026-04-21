import Link from "next/link";
import { siteConfig } from "@/lib/config";
import { ArrowRightIcon, EmailIcon, ExternalLinkIcon } from "@/components/Icons";
import { Sticker } from "@/components/riso/Sticker";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Referred to Point72",
  description: `Instructions for getting referred to Point72 by ${siteConfig.name}`,
  robots: "noindex, nofollow",
};

type StepColor = "yellow" | "pink" | "blue";

const stepColors: Record<StepColor, string> = {
  yellow: "var(--yellow)",
  pink: "var(--pink)",
  blue: "var(--blue)",
};

const steps: Array<{
  n: string;
  color: StepColor;
  title: string;
  body: React.ReactNode;
}> = [
  {
    n: "01",
    color: "yellow",
    title: "Browse open positions",
    body: (
      <>
        Head over to the{" "}
        <Link href="https://careers.point72.com/" target="_blank" rel="noopener noreferrer">
          Point72 Careers page
        </Link>{" "}
        and find one or more roles that match your background and interests.
      </>
    ),
  },
  {
    n: "02",
    color: "pink",
    title: "Send me your details",
    body: (
      <>
        Reach out with the following so I can put together a strong referral:
        <ul>
          <li>The specific role(s) you&apos;re interested in (job title and/or link)</li>
          <li>Your resume (PDF preferred)</li>
          <li>Your phone number</li>
          <li>Your email address</li>
          <li>A brief note about why you&apos;re excited about the role</li>
        </ul>
      </>
    ),
  },
  {
    n: "03",
    color: "blue",
    title: "I'll submit the referral",
    body: <>Once I have your info, I&apos;ll submit the referral through our internal system.</>,
  },
];

export default function ReferMePage() {
  return (
    <div className="mx-auto max-w-[780px] px-5 py-10 sm:px-7">
      {/* Sticker + loud header */}
      <header className="animate-fade-in relative mb-10">
        <div className="mb-6 flex items-center gap-4">
          <Sticker color="red" rotate={-6}>
            Refer Me
          </Sticker>
          <span className="font-mono-label text-muted">[ POINT72 / REFERRAL ]</span>
        </div>

        <h1 className="font-display text-[clamp(2.4rem,7vw,4.25rem)] leading-[0.92] tracking-[-0.04em]">
          HELP ME LAND MY{" "}
          <span
            className="inline-block border-[3px] px-[0.12em]"
            style={{
              background: "var(--yellow)",
              color: "var(--ink)",
              borderColor: "var(--border)",
              boxShadow: "6px 6px 0 var(--border)",
              transform: "rotate(-1.5deg)",
            }}
          >
            NEXT ROLE
          </span>
        </h1>

        <p className="text-muted mt-6 text-lg">
          Thanks for your interest in working at Point72. Here&apos;s how I can help.
        </p>
      </header>

      {/* Quiet prose intro */}
      <section
        className="animate-fade-in-delay-1 mb-10 p-6 sm:p-8"
        style={{
          background: "var(--card)",
          border: "3px solid var(--border)",
          boxShadow: "6px 6px 0 var(--border)",
        }}
      >
        <div className="prose max-w-none">
          <h2>How It Works</h2>
          <p>
            Employee referrals are a great way to get your application noticed. If you&apos;re
            interested in a role at Point72, I&apos;m happy to submit a referral on your behalf.
          </p>
        </div>
      </section>

      {/* Steps as numbered cards */}
      <section className="animate-fade-in-delay-2 mb-10 space-y-5">
        <div className="mb-2 flex items-center gap-3">
          <span className="font-mono-label text-muted">[ STEPS TO GET REFERRED ]</span>
          <span
            className="h-[3px] flex-1"
            style={{ background: "var(--border)" }}
            aria-hidden="true"
          />
        </div>

        {steps.map((step, i) => (
          <div
            key={step.n}
            className="grid grid-cols-[auto_1fr] items-stretch overflow-hidden"
            style={{
              border: "3px solid var(--border)",
              boxShadow: "6px 6px 0 var(--border)",
              background: "var(--card)",
              transform: `rotate(${i % 2 === 0 ? -0.3 : 0.3}deg)`,
            }}
          >
            <div
              className="flex items-center justify-center px-5 sm:px-8"
              style={{
                background: stepColors[step.color],
                borderRight: "3px solid var(--border)",
                color: "var(--ink)",
              }}
            >
              <span className="font-display text-[clamp(2.5rem,6vw,4rem)] leading-none tracking-tight">
                {step.n}
              </span>
            </div>
            <div className="p-5 sm:p-7">
              <h3 className="font-display mb-2 text-xl tracking-tight uppercase sm:text-2xl">
                {step.title}
              </h3>
              <div className="prose max-w-none">
                <p>{step.body}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Notes */}
      <section
        className="animate-fade-in-delay-3 mb-10 p-6 sm:p-8"
        style={{
          background: "var(--card)",
          border: "3px solid var(--border)",
          boxShadow: "6px 6px 0 var(--border)",
        }}
      >
        <div className="prose max-w-none">
          <h2>A Few Notes</h2>
          <ul>
            <li>
              I&apos;m happy to refer anyone who meets the criteria for the role, but a referral is
              not a guarantee of an interview or offer — it simply helps get your resume in front of
              the right people.
            </li>
            <li>
              The more specific you are about which role(s) you want, the better I can tailor the
              referral.
            </li>
            <li>
              If we haven&apos;t spoken in a while, feel free to include a quick intro so I can write
              a more personalized note.
            </li>
          </ul>
        </div>
      </section>

      {/* Loud CTA */}
      <section className="animate-fade-in-delay-3 space-y-4">
        <a
          href="https://careers.point72.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="brutal-lift group flex w-full items-center justify-between gap-4 px-6 py-6 sm:px-8"
          style={{
            background: "var(--red)",
            color: "var(--paper)",
            border: "4px solid var(--border)",
            boxShadow: "10px 10px 0 var(--border)",
          }}
        >
          <span className="font-display text-[clamp(1.3rem,4vw,2rem)] leading-none tracking-tight">
            BROWSE POINT72 CAREERS
          </span>
          <ExternalLinkIcon className="h-7 w-7 flex-shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 sm:h-8 sm:w-8" />
        </a>

        <a
          href={`mailto:${siteConfig.socials.email}?subject=Point72%20Referral`}
          className="brutal-lift-sm group flex w-full items-center justify-between gap-4 px-6 py-5"
          style={{
            background: "var(--card)",
            color: "var(--ink)",
            border: "3px solid var(--border)",
            boxShadow: "6px 6px 0 var(--border)",
          }}
        >
          <div className="flex items-center gap-3">
            <EmailIcon className="h-6 w-6" />
            <span className="font-display text-lg tracking-tight sm:text-xl">
              EMAIL ME YOUR DETAILS
            </span>
          </div>
          <ArrowRightIcon className="h-6 w-6 transition-transform group-hover:translate-x-1" />
        </a>
      </section>
    </div>
  );
}
