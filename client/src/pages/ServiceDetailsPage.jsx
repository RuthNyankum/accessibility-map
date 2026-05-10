import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { cn } from "../utils/cn";
import { Badge } from "../components/common/Badge";
import { CardReadButton } from "../components/common/CardReadButton";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaShareAlt,
  FaMap,
  FaArrowRight,
} from "react-icons/fa";
import API from "../services/api";

export default function ServiceDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [toast, setToast] = useState(null);

  // Auto-dismiss toast after 3 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  useEffect(() => {
    if (!id) {
      navigate("/services");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const token = localStorage.getItem("abilitymap-token");
        const headers = token ? { Authorization: `Bearer ${token}` } : {};

        // 1. Fetch main service
        const res = await API.get(`/api/services/${id}`, { headers });

        const mainService = res.data.service;
        setService(mainService);

        document.title = `${mainService.name} — AbilityMap Ghana`;

        // 2. Fetch similar services (by category)
        let similarList = [];

        if (mainService.category) {
          const similarRes = await API.get(
            `/api/services?category=${encodeURIComponent(mainService.category)}&limit=4`,
            { headers },
          );

          similarList = (similarRes.data.services || []).filter(
            (s) => s._id !== mainService._id,
          );
        }

        // 3. If no similar services found, get other services
        if (similarList.length === 0) {
          const otherRes = await API.get(`/api/services?limit=3`, { headers });

          similarList = (otherRes.data.services || []).filter(
            (s) => s._id !== mainService._id,
          );
        }

        setSimilar(similarList.slice(0, 3));
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  // Helper: generate badges array
  const getBadges = (s) => {
    const badges = [];
    if (s.badge && s.badgeColor) {
      badges.push({ label: s.badge, type: s.badgeColor });
    }
    if (s.disabilityTypes && s.disabilityTypes.length) {
      s.disabilityTypes.slice(0, 2).forEach((type) => {
        let color = "physical";
        if (type === "Visual") color = "visual";
        else if (type === "Hearing") color = "hearing";
        else if (type === "Mental Health") color = "mental";
        else if (type === "Speech") color = "speech";
        else if (type === "Intellectual") color = "intellectual";
        badges.push({ label: type, type: color });
      });
    }
    if (s.region) badges.push({ label: s.region, type: "region" });
    return badges;
  };

  // Helper: generate tags
  const getTags = (s) => {
    const tags = [];
    if (s.disabilityTypes) tags.push(...s.disabilityTypes);
    if (s.targetGroup) tags.push(s.targetGroup);
    if (s.languages) tags.push(s.languages.split(",")[0].trim());
    return tags.slice(0, 6);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-8 h-8 rounded-full border-4 animate-spin border-border border-t-primary" />
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-lg font-bold text-text-primary dark:text-text-primary-dark">
          {error || "Service not found"}
        </p>
        <button
          onClick={() => navigate("/services")}
          className="text-primary dark:text-primary-dark font-bold hover:underline"
        >
          ← Back to services
        </button>
      </div>
    );
  }

  const badges = getBadges(service);
  const tags = getTags(service);
  const readText = [
    service.name,
    service.description,
    `Phone: ${service.phone}.`,
    `Email: ${service.email}.`,
    `Address: ${service.address}.`,
    `Hours: ${service.hours}.`,
    service.about,
  ]
    .filter(Boolean)
    .join(" ");

  const dtClass =
    "text-xs font-bold tracking-widest uppercase mb-1 text-[var(--color-text-muted)] dark:text-[var(--color-text-muted-dark)]";
  const ddClass =
    "font-bold text-sm text-[var(--color-text-primary)] dark:text-[var(--color-text-primary-dark)]";
  const linkClass = cn(
    "font-bold text-sm min-h-0",
    "text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]",
    "hover:underline underline-offset-2",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm",
  );
  const divider =
    "border-t border-[var(--color-border)] dark:border-[var(--color-border-dark)] my-6";
  const sectionHead =
    "text-xs font-black tracking-widest uppercase mb-4 text-[var(--color-text-primary)] dark:text-[var(--color-text-primary-dark)]";

  return (
    <div className="min-h-screen px-6 py-6 bg-(--color-bg) dark:bg-bg-dark transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* Toast notification */}
        {toast && (
          <div
            role="status"
            aria-live="polite"
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl text-sm font-bold shadow-lg border bg-(--color-success-bg) text-(--color-success) border-(--color-success-border) dark:bg-(--color-success-bg-dark) dark:text-success-dark"
          >
            {toast}
          </div>
        )}

        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex items-center gap-1 text-sm list-none p-0">
            <li>
              <Link to="/" className={linkClass}>
                Home
              </Link>
            </li>
            <li aria-hidden="true" className="text-text-muted">
              ›
            </li>
            <li>
              <Link to="/services" className={linkClass}>
                Services
              </Link>
            </li>
            <li aria-hidden="true" className="text-text-muted">
              ›
            </li>
            <li
              aria-current="page"
              className="font-bold text-text-primary dark:text-text-primary-dark"
            >
              {service.name}
            </li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8 items-start">
          {/* Main content */}
          <article className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-2 mb-4">
              {badges.map((b) => (
                <Badge key={b.label} type={b.type} label={b.label} />
              ))}
            </div>

            <h1 className="text-3xl sm:text-4xl font-black mb-3 leading-tight text-text-primary dark:text-text-primary-dark">
              {service.name}
            </h1>

            <p className="text-sm mb-6 text-text-secondary dark:text-text-secondary-dark">
              {service.description}
            </p>

            <div aria-hidden="true" className={divider} />

            {/* Contact Information */}
            <section aria-labelledby="contact-heading">
              <h2 id="contact-heading" className={sectionHead}>
                Contact Information
              </h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-5">
                <div>
                  <dt className={dtClass}>Phone</dt>
                  <dd>
                    <a
                      href={`tel:${service.phone.replace(/\s/g, "")}`}
                      className={linkClass}
                    >
                      {service.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className={dtClass}>Email</dt>
                  <dd>
                    <a href={`mailto:${service.email}`} className={linkClass}>
                      {service.email}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className={dtClass}>Address</dt>
                  <dd className={ddClass}>{service.address || "—"}</dd>
                </div>
                <div>
                  <dt className={dtClass}>Website</dt>
                  <dd>
                    {service.website ? (
                      <a
                        href={`https://${service.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}
                      >
                        {service.website}
                      </a>
                    ) : (
                      "—"
                    )}
                  </dd>
                </div>
                <div>
                  <dt className={dtClass}>Opening Hours</dt>
                  <dd className={ddClass}>{service.hours || "—"}</dd>
                </div>
                <div>
                  <dt className={dtClass}>Region</dt>
                  <dd className={ddClass}>{service.region}</dd>
                </div>
              </dl>
            </section>

            <div aria-hidden="true" className={divider} />

            {/* About */}
            <section aria-labelledby="about-heading">
              <h2 id="about-heading" className={sectionHead}>
                About This Service
              </h2>
              <p className="text-sm leading-relaxed text-text-secondary dark:text-text-secondary-dark">
                {service.about || service.description}
              </p>
            </section>

            {tags.length > 0 && (
              <>
                <div aria-hidden="true" className={divider} />
                <section aria-labelledby="tags-heading">
                  <h2 id="tags-heading" className={sectionHead}>
                    Tags
                  </h2>
                  <ul className="flex flex-wrap gap-2 list-none p-0">
                    {tags.map((tag) => (
                      <li key={tag}>
                        <span className="inline-flex px-4 py-1.5 rounded-full text-sm border border-border dark:border-border-dark bg-(--color-bg) dark:bg-surface-dark text-text-secondary dark:text-text-secondary-dark">
                          {tag}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              </>
            )}

            <div aria-hidden="true" className={divider} />

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              {service.coordinates?.lat && service.coordinates?.lng && (
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${service.coordinates.lat},${service.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 rounded-xl font-bold text-sm min-h-13 bg-primary text-(--color-primary-fg) dark:bg-primary-dark dark:text-(--color-primary-dark-fg) hover:bg-primary-hover transition-colors"
                >
                  <FaMap aria-hidden="true" />
                  Get Directions
                </a>
              )}
              <a
                href={`tel:${service.phone.replace(/\s/g, "")}`}
                className="inline-flex items-center gap-2 px-5 rounded-xl font-bold text-sm min-h-[52px] border-2 border-text-primary dark:border-text-primary-dark text-text-primary dark:text-text-primary-dark hover:bg-surface transition-colors"
              >
                <FaPhone aria-hidden="true" />
                Call Now
              </a>
              <button
                onClick={async () => {
                  const shareData = {
                    title: service.name,
                    text: `Check out ${service.name} on AbilityMap Ghana`,
                    url: window.location.href,
                  };
                  if (navigator.share) {
                    try {
                      await navigator.share(shareData);
                    } catch (err) {
                      if (err.name !== "AbortError") console.error(err);
                    }
                  } else {
                    try {
                      await navigator.clipboard.writeText(window.location.href);
                      setToast("✓ Link copied to clipboard!");
                    } catch (err) {
                      setToast("✗ Failed to copy link");
                    }
                  }
                }}
                className="inline-flex items-center gap-2 px-5 rounded-xl font-bold text-sm min-h-[52px] border-2 border-border dark:border-border-dark bg-(--color-bg) dark:bg-surface-dark text-text-primary dark:text-text-primary-dark hover:bg-surface transition-colors"
              >
                <FaShareAlt aria-hidden="true" />
                Share
              </button>
              <CardReadButton
                text={readText}
                cardId={service._id}
                className="px-5 rounded-xl min-h-[52px] text-sm border-2 border-border dark:border-border-dark"
              />
            </div>
          </article>

          {/* Sidebar */}
          <aside className="w-full lg:w-72 shrink-0 flex flex-col gap-6">
            {/* Location Map */}
            <div className="rounded-xl border overflow-hidden border-border dark:border-border-dark">
              <h2 className="text-xs font-bold tracking-widest uppercase px-4 pt-4 pb-3 text-text-primary dark:text-text-primary-dark">
                Location
              </h2>
              <div className="h-44 w-full flex items-center justify-center bg-map-bg dark:bg-map-bg-dark">
                <FaMapMarkerAlt className="text-3xl" aria-hidden="true" />
              </div>
              <div className="p-3">
                {service.coordinates?.lat && service.coordinates?.lng ? (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${service.coordinates.lat},${service.coordinates.lng}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 w-full justify-center py-2 rounded-lg text-sm font-bold min-h-[44px] border border-border dark:border-border-dark text-primary dark:text-primary-dark hover:bg-surface transition-colors"
                  >
                    <FaMap aria-hidden="true" />
                    Open in Map
                  </a>
                ) : (
                  <p className="text-xs text-center text-text-muted">
                    Coordinates not available
                  </p>
                )}
              </div>
            </div>

            {/* Similar Services - always shown */}
            <div>
              <h2 className="text-xs font-bold tracking-widest uppercase mb-4 text-text-primary dark:text-text-primary-dark">
                Similar Services
              </h2>
              {similar.length === 0 ? (
                <p className="text-sm text-text-muted dark:text-text-muted-dark text-center py-4">
                  No similar services found.
                </p>
              ) : (
                <ul className="flex flex-col gap-3 list-none p-0">
                  {similar.map((s) => (
                    <li
                      key={s._id}
                      className="p-4 rounded-xl border bg-(--color-bg) dark:bg-surface-dark border-border dark:border-border-dark"
                    >
                      <Badge type={s.badgeColor} label={s.badge} />
                      <p className="font-bold text-sm mt-2 mb-1 text-text-primary dark:text-text-primary-dark">
                        {s.name}
                      </p>
                      <p className="text-xs mb-3 flex items-center gap-1 text-text-secondary dark:text-text-secondary-dark">
                        <FaMapMarkerAlt aria-hidden="true" />
                        {s.location}
                      </p>
                      <button
                        onClick={() => navigate(`/services/${s._id}`)}
                        className="inline-flex items-center gap-1 text-sm font-bold min-h-0 text-primary dark:text-primary-dark hover:underline"
                      >
                        Details{" "}
                        <FaArrowRight className="text-xs" aria-hidden="true" />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
