import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../utils/cn";
import { FaSearch, FaMap } from "react-icons/fa";
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
        "bg-(--color-bg) dark:bg-bg-dark",
        "transition-colors duration-300",
      )}
    >
      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section
        aria-labelledby="hero-heading"
        className={cn(
          "flex flex-col items-center text-center px-6 pt-16 pb-16",
          "bg-surface dark:bg-surface-dark",
        )}
      >
        <div
          aria-hidden="true"
          className={cn(
            "inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border",
            "border-border dark:border-border-dark",
            "text-xs font-black tracking-widest uppercase",
            "text-text-secondary dark:text-text-secondary-dark",
            "bg-surface dark:bg-surface-dark",
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
            "text-text-primary dark:text-text-primary-dark",
          )}
        >
          Building a More Accessible Ghana
        </h1>

        <p
          className={cn(
            "text-base max-w-lg leading-relaxed",
            "text-text-secondary dark:text-text-secondary-dark",
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
                "text-text-primary dark:text-text-primary-dark",
              )}
            >
              Why we built this
            </h2>

            <div
              className={cn(
                "flex flex-col gap-4 text-l leading-relaxed",
                "text-text-secondary dark:text-text-secondary-dark",
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
              "bg-surface dark:bg-surface-dark",
              "border-border dark:border-border-dark",
            )}
          >
            {STATS.map(({ value, label }) => (
              <div
                key={label}
                className={cn(
                  "pb-5 border-b last:border-b-0 last:pb-0",
                  "border-border dark:border-border-dark",
                )}
              >
                <p
                  className={cn(
                    "text-4xl font-black mb-1",
                    "text-primary dark:text-primary-dark",
                  )}
                >
                  {value}
                </p>

                <p
                  className={cn(
                    "text-sm",
                    "text-text-secondary dark:text-text-secondary-dark",
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
        className={cn("px-6 py-16", "bg-surface dark:bg-surface-dark")}
      >
        <div className="max-w-5xl mx-auto">
          <SectionLabel text="What We Stand For" />

          <h2
            id="values-heading"
            className={cn(
              "text-2xl font-black mb-2",
              "text-text-primary dark:text-text-primary-dark",
            )}
          >
            Our values
          </h2>

          <p
            className={cn(
              "text-sm mb-10",
              "text-text-secondary dark:text-text-secondary-dark",
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
                  "bg-(--color-bg) dark:bg-bg-dark",
                  "transition-colors duration-300 transition-all",
                  "border-border dark:border-border-dark",
                  "hover:border-primary dark:hover:border-primary-dark",
                )}
              >
                <span className="text-2xl" aria-hidden="true">
                  {icon}
                </span>

                <h3
                  className={cn(
                    "font-black text-base",
                    "text-text-primary dark:text-text-primary-dark",
                  )}
                >
                  {title}
                </h3>

                <p
                  className={cn(
                    "text-sm leading-relaxed",
                    "text-text-secondary dark:text-text-secondary-dark",
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
            "text-text-primary dark:text-text-primary-dark",
          )}
        >
          Simple by design
        </h2>

        <p
          className={cn(
            "text-sm mb-10",
            "text-text-secondary dark:text-text-secondary-dark",
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
                  "bg-primary text-(--color-primary-fg)",
                  "dark:bg-primary-dark dark:text-(--color-primary-dark-fg)",
                )}
                aria-hidden="true"
              >
                {number}
              </div>

              <div>
                <h3
                  className={cn(
                    "font-black text-base mb-1",
                    "text-text-primary dark:text-text-primary-dark",
                  )}
                >
                  {title}
                </h3>

                <p
                  className={cn(
                    "text-sm leading-relaxed",
                    "text-text-secondary dark:text-text-secondary-dark",
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
        className={cn("px-6 py-16", "bg-surface dark:bg-surface-dark")}
      >
        <div className="max-w-3xl mx-auto">
          <SectionLabel text="Get in Touch" />

          <h2
            id="contact-heading"
            className={cn(
              "text-2xl font-black mb-2",
              "text-text-primary dark:text-text-primary-dark",
            )}
          >
            Contact us
          </h2>

          <p
            className={cn(
              "text-sm mb-8",
              "text-text-secondary dark:text-text-secondary-dark",
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
                  "bg-(--color-bg) dark:bg-bg-dark",
                  "border-border dark:border-border-dark",
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
                          "text-primary dark:text-primary-dark",
                          "hover:underline underline-offset-2",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-sm",
                        )}
                      >
                        {value}
                      </a>
                    ) : (
                      <span className="text-sm font-bold text-text-primary dark:text-text-primary-dark">
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
          "bg-(--color-bg) dark:bg-bg-dark",
        )}
      >
        <div className="max-w-lg mx-auto">
          <h2
            id="cta-heading"
            className={cn(
              "text-2xl font-black mb-3",
              "text-text-primary dark:text-text-primary-dark",
            )}
          >
            Ready to find support services?
          </h2>

          <p
            className={cn(
              "text-sm mb-8 leading-relaxed",
              "text-text-secondary dark:text-text-secondary-dark",
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
              className="inline-flex items-center gap-2 px-8 rounded-xl font-bold text-base min-h-[56px] cursor-pointer bg-primary text-(--color-primary-fg) dark:bg-primary-dark dark:text-(--color-primary-dark-fg) hover:opacity-90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)]"
            >
              <FaSearch aria-hidden="true" />
              Find Services
            </button>

            <button
              type="button"
              onClick={() => navigate("/map")}
              aria-label="View all services on a map"
              className="inline-flex items-center gap-2 px-8 rounded-xl font-bold text-base min-h-[56px] cursor-pointer border-2 border-border dark:border-border-dark text-text-primary dark:text-text-primary-dark hover:bg-surface dark:hover:bg-surface-dark transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)]"
            >
              <FaMap aria-hidden="true" />
              View on Map
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
