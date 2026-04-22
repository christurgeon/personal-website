import { siteConfig } from "@/lib/config";
import { ExternalLinkIcon } from "@/components/Icons";
import { SectionHead } from "@/components/riso/SectionHead";
import { STRIPE_COLORS, pickByIndex } from "@/lib/riso";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Referrals",
  description: `Services and products ${siteConfig.name} personally uses and recommends`,
  alternates: { canonical: "/referrals" },
};

interface Referral {
  name: string;
  description: string;
  bonus?: string;
  href: string;
}

interface Category {
  name: string;
  kicker: string;
  number: string;
  description: string;
  referrals: Referral[];
}

const categories: Category[] = [
  {
    name: "Credit Cards",
    kicker: "PLASTIC",
    number: "01",
    description: "My go-to credit cards for maximizing rewards, travel perks, and cash back",
    referrals: [
      {
        name: "Capital One Venture X",
        description: "My go-to travel rewards credit card with great points flexibility",
        bonus: "100,000 miles",
        href: "https://i.capitalone.com/JrMpDJrTQ",
      },
      {
        name: "REI Co-Op Mastercard",
        description: "Outdoor rewards card - 5% back at REI, 1.5% back everywhere else, no annual fee",
        bonus: "$100 REI gift card",
        href: "https://i.capitalone.com/JjtDtWZgs",
      },
      {
        name: "Chase Freedom Flex",
        description: "No-annual-fee cash back card with rotating 5% bonus categories and solid everyday rewards",
        bonus: "$200–$300 cash",
        href: "https://www.referyourchasecard.com/18d/CSJO5XQRI3",
      },
      {
        name: "Venmo",
        description: "No-annual-fee card with 3% cash back on all purchases",
        bonus: "$100 cash back",
        href: "https://get.venmo.com/7xWaniQM3Zb",
      },
    ],
  },
  {
    name: "Finance",
    kicker: "MONEY",
    number: "02",
    description: "Financial tools I use",
    referrals: [
      {
        name: "Charles Schwab",
        description: "One of the reasons I choose Schwab is their debit card has no ATM fees, domestically or internationally",
        bonus: "Up to $1,000",
        href: "https://www.schwab.com/client-referral?refrid=REFEREUE4TERM",
      },
      {
        name: "Kalshi",
        description: "A prediction market where you can trade on the outcome of real-world events",
        bonus: "We both get $25",
        href: "https://kalshi.com/sign-up/?referral=b758c4ef-2bc7-438b-ac4a-564f1ae0b567&m=true",
      },
      {
        name: "SoFi",
        description: "An online bank that offers checking and savings accounts with no account fees or minimum balance requirements",
        bonus: "Up to $325",
        href: "https://urldefense.com/v3/__https://www.sofi.com/invite/money?gcp=03e69213-cfcd-4cf5-a7ae-c3d01fc8fb4a&isAliasGcp=false__;!!K_TC0FI_KA!vYcVZSr7zEqiiSoYvQp4K-J_Rvr6qNUzUoAgkmOssBToWw3VByPocooO0x5if3pAj3ZK_fyqoLvOl09lAnnbb7mTHEZO$",
      },
    ],
  },
  {
    name: "Lifestyle",
    kicker: "EVERYDAY",
    number: "03",
    description: "Apps and tools I use in my everyday life",
    referrals: [
      {
        name: "Beli",
        description: "An app I use to save restaurants, write reviews, share recommendations, and remember where I want to eat",
        href: "https://beliapp.co/IAPVrHgmeLb?utm_source=in__s",
      },
    ],
  },
];

const fullBonusByHref: Record<string, string> = {
  "https://i.capitalone.com/JrMpDJrTQ": "Earn 100,000 bonus miles after spending $10,000 on purchases in the first 6 months",
  "https://i.capitalone.com/JjtDtWZgs": "Earn a $100 REI gift card after your first purchase outside of REI within 60 days of account opening",
  "https://www.referyourchasecard.com/18d/CSJO5XQRI3": "Earn $200 or $300 cash back after spending $500 on purchases in the first 3 months",
  "https://get.venmo.com/7xWaniQM3Zb": "Earn $100 cash back after spending $500 on purchases in the first 3 months",
  "https://www.schwab.com/client-referral?refrid=REFEREUE4TERM": "Get up to $1,000 through this referral depending on your initial funding amount",
  "https://kalshi.com/sign-up/?referral=b758c4ef-2bc7-438b-ac4a-564f1ae0b567&m=true": "Sign up and we'll both get $25",
  "https://urldefense.com/v3/__https://www.sofi.com/invite/money?gcp=03e69213-cfcd-4cf5-a7ae-c3d01fc8fb4a&isAliasGcp=false__;!!K_TC0FI_KA!vYcVZSr7zEqiiSoYvQp4K-J_Rvr6qNUzUoAgkmOssBToWw3VByPocooO0x5if3pAj3ZK_fyqoLvOl09lAnnbb7mTHEZO$":
    "You'll get a $25 bonus when you open a SoFi Checking and Savings account, and either $50 or $300 when you set up eligible direct deposit of $1,000 or more. Terms apply.",
};

export default function ReferralsPage() {
  return (
    <div className="mx-auto max-w-[1240px] px-5 py-10 sm:px-7">
      {/* Loud header */}
      <header className="animate-fade-in mb-14">
        <div className="font-mono-label text-muted mb-4">[ 05 / PERKS ]</div>
        <h1 className="font-display text-[clamp(2.8rem,9vw,6rem)] leading-[0.9] tracking-[-0.04em]">
          REFER
          <span
            className="mx-[0.05em] inline-block border-[3px] px-[0.1em]"
            style={{
              background: "var(--yellow)",
              color: "var(--ink)",
              borderColor: "var(--border)",
              boxShadow: "6px 6px 0 var(--border)",
              transform: "rotate(-2deg)",
            }}
          >
            RALS
          </span>
        </h1>
        <p className="text-muted mt-6 max-w-[60ch] text-lg">Links to services I actually use. You get a bonus, I get a bonus. Win-win.</p>
      </header>

      {/* Categories */}
      <div className="space-y-16">
        {categories.map((category) => (
          <section key={category.name} className="animate-fade-in-delay-1">
            <SectionHead number={category.number} kicker={category.kicker} title={category.name.toUpperCase()} />
            <p className="font-mono-label text-muted -mt-4 mb-6">{category.description}</p>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {category.referrals.map((referral, index) => {
                const stripe = pickByIndex(STRIPE_COLORS, index);
                const rotate = index % 2 === 0 ? -0.4 : 0.4;
                const fullBonus = fullBonusByHref[referral.href];

                return (
                  <a
                    key={referral.name}
                    href={referral.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="brutal-lift group flex flex-col overflow-hidden"
                    style={{
                      background: "var(--card)",
                      color: "var(--ink)",
                      border: "3px solid var(--border)",
                      boxShadow: "6px 6px 0 var(--border)",
                      transform: `rotate(${rotate}deg)`,
                    }}
                  >
                    {/* Colored top strip w/ bonus pill */}
                    <div
                      className="flex items-center justify-between gap-3 px-5 py-3"
                      style={{
                        background: stripe,
                        color: "var(--ink)",
                        borderBottom: "3px solid var(--border)",
                      }}
                    >
                      <span className="font-mono-label">BONUS</span>
                      {referral.bonus ? (
                        <span
                          className="font-display inline-block px-3 py-1 text-sm tracking-tight"
                          style={{
                            background: "var(--paper)",
                            color: "var(--ink)",
                            border: "2px solid var(--border)",
                            boxShadow: "2px 2px 0 var(--border)",
                          }}
                        >
                          {referral.bonus}
                        </span>
                      ) : (
                        <span
                          className="font-display inline-block px-3 py-1 text-sm tracking-tight"
                          style={{
                            background: "var(--paper)",
                            color: "var(--ink)",
                            border: "2px solid var(--border)",
                            boxShadow: "2px 2px 0 var(--border)",
                          }}
                        >
                          Just a link
                        </span>
                      )}
                    </div>

                    {/* Body */}
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-display mb-2 text-xl tracking-tight uppercase">{referral.name}</h3>
                      <p className="text-muted flex-1 text-sm leading-relaxed">{referral.description}</p>
                      {fullBonus && referral.bonus && (
                        <p className="font-mono-label text-muted mt-4 text-[0.7rem] leading-snug tracking-normal normal-case">{fullBonus}</p>
                      )}

                      {/* Footer action */}
                      <div className="mt-5 flex items-center justify-between pt-4" style={{ borderTop: "2px dashed var(--border)" }}>
                        <span className="font-mono-label text-muted">VISIT →</span>
                        <span
                          className="inline-flex h-9 w-9 items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                          style={{
                            background: "var(--ink)",
                            color: "var(--paper)",
                            border: "2px solid var(--border)",
                            boxShadow: "3px 3px 0 var(--border)",
                          }}
                        >
                          <ExternalLinkIcon className="h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* Footer note */}
      <p className="font-mono-label text-muted animate-fade-in-delay-3 mt-20 text-center">[ HAVE QUESTIONS? REACH OUT. ]</p>
    </div>
  );
}
