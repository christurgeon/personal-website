"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState } from "react";
import { siteConfig } from "@/lib/config";
import { SunIcon, MoonIcon } from "@/components/Icons";

export function Header() {
  const pathname = usePathname();
  const { setTheme, resolvedTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));

  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "var(--paper)",
        borderBottom: "4px solid var(--border)",
      }}
    >
      <div className="mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-5 py-3 sm:px-7 sm:py-3.5">
        <Link href="/" className="flex items-center gap-2.5" aria-label={siteConfig.name}>
          <span
            className="font-display grid h-9 w-9 place-items-center text-[0.95rem]"
            style={{
              background: "var(--yellow)",
              color: "var(--ink)",
              border: "3px solid var(--border)",
              boxShadow: "3px 3px 0 var(--border)",
              transform: "rotate(-4deg)",
            }}
            aria-hidden="true"
          >
            CT
          </span>
          <span className="font-display hidden text-[1.05rem] tracking-tight uppercase sm:inline">Chris Turgeon</span>
        </Link>

        <nav className="hidden md:block" aria-label="Primary">
          <ul className="flex items-center gap-1">
            {siteConfig.nav.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link href={item.href} className={active ? "nav-link nav-link--active" : "nav-link"}>
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="brutal-lift-sm grid h-10 w-10 place-items-center"
            style={{
              background: "var(--yellow)",
              color: "var(--ink)",
              border: "3px solid var(--border)",
              boxShadow: "3px 3px 0 var(--border)",
            }}
            aria-label="Toggle color mode"
          >
            <SunIcon className="hidden h-5 w-5 dark:block" />
            <MoonIcon className="block h-5 w-5 dark:hidden" />
          </button>

          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="grid h-10 w-10 place-items-center md:hidden"
            style={{
              background: menuOpen ? "var(--red)" : "var(--card)",
              color: menuOpen ? "var(--paper)" : "var(--ink)",
              border: "3px solid var(--border)",
              boxShadow: "3px 3px 0 var(--border)",
            }}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={3}
              strokeLinecap="square"
              aria-hidden="true"
            >
              {menuOpen ? <path d="M6 6L18 18M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden" style={{ borderTop: "3px solid var(--border)", background: "var(--card)" }}>
          <ul className="mx-auto flex max-w-[1240px] flex-col gap-1 px-5 py-3">
            {siteConfig.nav.map((item) => {
              const active = isActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="font-mono-label block border-[2.5px] px-3.5 py-2.5"
                    style={
                      active
                        ? {
                            background: "var(--red)",
                            color: "var(--paper)",
                            borderColor: "var(--border)",
                            boxShadow: "3px 3px 0 var(--border)",
                          }
                        : {
                            background: "var(--paper)",
                            color: "var(--ink)",
                            borderColor: "var(--border)",
                          }
                    }
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </header>
  );
}
