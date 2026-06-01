import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../utils/cn";

import { STATS, VALUES, HOW_IT_WORKS, CONTACT_ITEMS } from "../constants/about";
import { GhanaFlag } from "../assets/icons/GhanaFlag";

// ─── Section label ────────────────────────────────────────────────────────────

function SectionLabel({ text }) {
  return (
    <p className="text-xs font-black tracking-widest uppercase mb-2 text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]">
      {text}
    </p>
  );
}

// ─── AboutPage ────────────────────────────────────────────────────────────────

export default function AboutPage() {
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "About — AbilityMap Ghana";
  }, []);

  return (
    <div
      className={cn(
        "bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]",
        "transition-colors duration-300",
      )}
    >
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section
        aria-labelledby="hero-heading"
        className={cn(
          "flex flex-col items-center text-center px-6 pt-16 pb-16",
          "bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)]",
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            "inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border",
            "border-[var(--color-border)] dark:border-[var(--color-border-dark)]",
            "text-xs font-black tracking-widest uppercase",
            "text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-dark)]",
            "bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)]",
          )}
        >
          <GhanaFlag
            className="w-5 h-auto rounded-sm shadow-sm"
            aria-hidden="true"
          />

          <span>Our Story</span>
        </div>

        <h1
          id="hero-heading"
          className={cn(
            "text-3xl sm:text-4xl font-black max-w-xl mb-5 leading-tight",
            "text-[var(--color-text-primary)] dark:text-[var(--color-text-primary-dark)]",
          )}
        >
          Building a More Accessible Ghana
        </h1>

        <p
          className={cn(
            "text-base max-w-lg leading-relaxed",
            "text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-dark)]",
          )}
        >
          AbilityMap Ghana connects people with disabilities, caregivers, and
          professionals to the support services they need — across every region
          of Ghana.
        </p>
      </section>

      {/* ── MISSION ───────────────────────────────────────────────── */}
      <section
        aria-labelledby="mission-heading"
        className="px-6 py-16 max-w-5xl mx-auto"
      >
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          <div className="flex-1">
            <SectionLabel text="Our Mission" />

            <h2
              id="mission-heading"
              className={cn(
                "text-2xl font-black mb-6",
                "text-[var(--color-text-primary)] dark:text-[var(--color-text-primary-dark)]",
              )}
            >
              Why we built this
            </h2>

            <div
              className={cn(
                "flex flex-col gap-4 text-sm leading-relaxed",
                "text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-dark)]",
              )}
            >
              <p>
                In Ghana, millions of people live with disabilities — yet
                finding the right support service can take weeks, or never
                happen at all. Information is scattered, hard to find, and often
                inaccessible to the very people who need it most.
              </p>

              <p>
                AbilityMap Ghana was built to change that. We created a single,
                accessible platform where anyone can find disability support
                services across all 16 regions of Ghana — for free, in one
                place, on any device.
              </p>

              <p>
                We believe access to support is a right, not a privilege. Every
                person — regardless of their disability, location, or background
                — deserves to know what help is available to them.
              </p>
            </div>
          </div>

          <aside
            aria-label="Key statistics"
            className={cn(
              "w-full lg:w-72 shrink-0 rounded-2xl border p-6 flex flex-col gap-5",
              "bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)]",
              "border-[var(--color-border)] dark:border-[var(--color-border-dark)]",
            )}
          >
            {STATS.map(({ value, label }) => (
              <div
                key={label}
                className={cn(
                  "pb-5 border-b last:border-b-0 last:pb-0",
                  "border-[var(--color-border)] dark:border-[var(--color-border-dark)]",
                )}
              >
                <p
                  className={cn(
                    "text-4xl font-black mb-1",
                    "text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]",
                  )}
                >
                  {value}
                </p>

                <p
                  className={cn(
                    "text-sm",
                    "text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-dark)]",
                  )}
                >
                  {label}
                </p>
              </div>
            ))}
          </aside>
        </div>
      </section>

      {/* ── VALUES ────────────────────────────────────────────────── */}
      <section
        aria-labelledby="values-heading"
        className={cn(
          "px-6 py-16",
          "bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)]",
        )}
      >
        <div className="max-w-5xl mx-auto">
          <SectionLabel text="What We Stand For" />

          <h2
            id="values-heading"
            className={cn(
              "text-2xl font-black mb-2",
              "text-[var(--color-text-primary)] dark:text-[var(--color-text-primary-dark)]",
            )}
          >
            Our values
          </h2>

          <p
            className={cn(
              "text-sm mb-10",
              "text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-dark)]",
            )}
          >
            Everything we build is guided by these principles.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {VALUES.map(({ icon, title, body }) => (
              <article
                key={title}
                className={cn(
                  "flex flex-col gap-3 p-6 rounded-2xl border",
                  "bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]",
                  "transition-colors duration-300 transition-all",
                  "border-[var(--color-border)] dark:border-[var(--color-border-dark)]",
                  "hover:border-[var(--color-primary)] dark:hover:border-[var(--color-primary-dark)]",
                )}
              >
                <span className="text-2xl" aria-hidden="true">
                  {icon}
                </span>

                <h3
                  className={cn(
                    "font-black text-base",
                    "text-[var(--color-text-primary)] dark:text-[var(--color-text-primary-dark)]",
                  )}
                >
                  {title}
                </h3>

                <p
                  className={cn(
                    "text-sm leading-relaxed",
                    "text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-dark)]",
                  )}
                >
                  {body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────────────── */}
      <section
        aria-labelledby="how-heading"
        className="px-6 py-16 max-w-3xl mx-auto"
      >
        <SectionLabel text="How It Works" />

        <h2
          id="how-heading"
          className={cn(
            "text-2xl font-black mb-2",
            "text-[var(--color-text-primary)] dark:text-[var(--color-text-primary-dark)]",
          )}
        >
          Simple by design
        </h2>

        <p
          className={cn(
            "text-sm mb-10",
            "text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-dark)]",
          )}
        >
          AbilityMap Ghana is straightforward to use for everyone — including
          people using assistive technologies.
        </p>

        <ol role="list" className="flex flex-col gap-8 list-none p-0">
          {HOW_IT_WORKS.map(({ number, title, body }) => (
            <li key={number} className="flex items-start gap-5">
              <div
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-black text-base",
                  "bg-[var(--color-primary)] text-[var(--color-primary-fg)]",
                  "dark:bg-[var(--color-primary-dark)] dark:text-[var(--color-primary-dark-fg)]",
                )}
                aria-hidden="true"
              >
                {number}
              </div>

              <div>
                <h3
                  className={cn(
                    "font-black text-base mb-1",
                    "text-[var(--color-text-primary)] dark:text-[var(--color-text-primary-dark)]",
                  )}
                >
                  {title}
                </h3>

                <p
                  className={cn(
                    "text-sm leading-relaxed",
                    "text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-dark)]",
                  )}
                >
                  {body}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── CONTACT ───────────────────────────────────────────────── */}
      <section
        aria-labelledby="contact-heading"
        className={cn(
          "px-6 py-16",
          "bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)]",
        )}
      >
        <div className="max-w-3xl mx-auto">
          <SectionLabel text="Get in Touch" />

          <h2
            id="contact-heading"
            className={cn(
              "text-2xl font-black mb-2",
              "text-[var(--color-text-primary)] dark:text-[var(--color-text-primary-dark)]",
            )}
          >
            Contact us
          </h2>

          <p
            className={cn(
              "text-sm mb-8",
              "text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-dark)]",
            )}
          >
            Have a question, want to partner with us, or found incorrect
            information about a service? We would love to hear from you.
          </p>

          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {CONTACT_ITEMS.map(({ icon, label, value, href }) => (
              <div
                key={label}
                className={cn(
                  "flex items-start gap-4 p-5 rounded-2xl border",
                  "bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]",
                  "border-[var(--color-border)] dark:border-[var(--color-border-dark)]",
                )}
              >
                <span className="text-xl shrink-0 mt-0.5" aria-hidden="true">
                  {icon}
                </span>

                <div className="min-w-0">
                  <dt className="text-xs font-black uppercase tracking-wider mb-1 text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]">
                    {label}
                  </dt>

                  <dd>
                    {href ? (
                      <a
                        href={href}
                        className={cn(
                          "text-sm font-bold break-all min-h-0",
                          "text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]",
                          "hover:underline underline-offset-2",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm",
                        )}
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="text-sm font-bold text-[var(--color-text-primary)] dark:text-[var(--color-text-primary-dark)]">
                        {value}
                      </span>
                    )}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────── */}
      <section
        aria-labelledby="cta-heading"
        className={cn(
          "px-6 py-16 text-center",
          "bg-[var(--color-bg)] dark:bg-[var(--color-bg-dark)]",
        )}
      >
        <div className="max-w-lg mx-auto">
          <h2
            id="cta-heading"
            className={cn(
              "text-2xl font-black mb-3",
              "text-[var(--color-text-primary)] dark:text-[var(--color-text-primary-dark)]",
            )}
          >
            Ready to find support services?
          </h2>

          <p
            className={cn(
              "text-sm mb-8 leading-relaxed",
              "text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-dark)]",
            )}
          >
            Browse over 120 disability support services across every region of
            Ghana — for free.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/services")}
              aria-label="Find disability support services"
              className={cn(
                "inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm min-h-[52px]",
                "bg-[var(--color-primary)] text-[var(--color-primary-fg)]",
                "dark:bg-[var(--color-primary-dark)] dark:text-[var(--color-primary-dark-fg)]",
                "hover:bg-[var(--color-primary-hover)] dark:hover:opacity-90 transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)]",
              )}
            >
              <span aria-hidden="true">🔍</span> Find Services
            </button>

            <button
              type="button"
              onClick={() => navigate("/map")}
              aria-label="View services on the map"
              className={cn(
                "inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-sm min-h-[52px]",
                "border-2 border-[var(--color-border)] dark:border-[var(--color-border-dark)]",
                "text-[var(--color-text-primary)] dark:text-[var(--color-text-primary-dark)]",
                "hover:bg-[var(--color-surface)] dark:hover:bg-[#2d3f5a] transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)]",
              )}
            >
              <span aria-hidden="true">🗺️</span> View on Map
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
