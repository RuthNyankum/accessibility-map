import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../utils/cn";
import { ServiceCard } from "../components/services/ServiceCard";
import { GhanaFlag } from "../assets/icons/GhanaFlag";
import API from "../services/api";

export default function HomePage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState([]);
  const [disabilityTypes, setDisabilityTypes] = useState(["All types"]);
  const [regions, setRegions] = useState(["All regions"]);
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [type, setType] = useState("All types");
  const [region, setRegion] = useState("All regions");

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        // Use Axios for all three requests
        const [statsRes, constantsRes, featuredRes] = await Promise.all([
          API.get("/stats"),
          API.get("/constants"),
          API.get("/services/featured?limit=6"),
        ]);

        const statsData = statsRes.data;
        const constantsData = constantsRes.data;
        const featuredData = featuredRes.data;

        setStats([
          { value: statsData.totalServices, label: "Services" },
          { value: statsData.totalRegions, label: "Regions" },
          { value: statsData.totalCities, label: "Cities" },
        ]);

        setDisabilityTypes(["All types", ...constantsData.disabilityTypes]);
        setRegions(["All regions", ...constantsData.regions]);
        setFeatured(featuredData.services || []);
      } catch (err) {
        console.error("Failed to load home page data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (type !== "All types") params.set("type", type);
    if (region !== "All regions") params.set("location", region);
    navigate(`/services?${params.toString()}`);
  };

  const inputBase = cn(
    "w-full px-4 py-2 rounded-lg border text-sm min-h-[48px]",
    "bg-[var(--color-bg)] dark:bg-[var(--color-surface-dark)]",
    "text-[var(--color-text-primary)] dark:text-[var(--color-text-primary-dark)]",
    "border-[var(--color-border)] dark:border-[var(--color-border-dark)]",
    "placeholder:text-[var(--color-text-muted)] dark:placeholder:text-[var(--color-text-muted-dark)]",
    "focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] dark:focus:ring-[var(--color-primary-dark)]",
    "transition-colors duration-200",
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 rounded-full border-4 animate-spin border-border border-t-primary" />
      </div>
    );
  }

  return (
    <div className="bg-(--color-bg) dark:bg-bg-dark transition-colors duration-300 min-h-screen">
      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="hero-heading"
        className="flex flex-col items-center text-center px-6 pt-20 pb-16 max-w-7xl mx-auto"
      >
        <div
          aria-hidden="true"
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 border border-border dark:border-border-dark text-xs font-bold tracking-widest uppercase text-text-secondary dark:text-text-secondary-dark bg-surface dark:bg-surface-dark"
        >
          <GhanaFlag
            className="w-5 h-auto rounded-sm shadow-sm"
            aria-hidden="true"
          />
          <span>Made for Ghana</span>
        </div>

        <h1
          id="hero-heading"
          className="text-4xl sm:text-6xl font-extrabold leading-tight max-w-4xl mb-6 text-text-primary dark:text-text-primary-dark"
        >
          Find Disability Support Services in{" "}
          <span className="text-primary dark:text-primary-dark">Ghana</span>
        </h1>

        <p className="text-lg max-w-2xl mb-10 leading-relaxed text-text-secondary dark:text-text-secondary-dark">
          Connecting people with disabilities, caregivers, and professionals to
          the right support services — across every region.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => navigate("/services")}
            aria-label="Find disability support services"
            className="inline-flex items-center gap-2 px-8 rounded-xl font-bold text-base min-h-[56px] bg-primary text-(--color-primary-fg) dark:bg-primary-dark dark:text-(--color-primary-dark-fg) hover:opacity-90 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)]"
          >
            <span aria-hidden="true">🔍</span> Find Services
          </button>

          <button
            type="button"
            onClick={() => navigate("/map")}
            aria-label="View all services on a map"
            className="inline-flex items-center gap-2 px-8 rounded-xl font-bold text-base min-h-[56px] border-2 border-border dark:border-border-dark text-text-primary dark:text-text-primary-dark hover:bg-surface dark:hover:bg-surface-dark transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)]"
          >
            <span aria-hidden="true">🗺️</span> View on Map
          </button>
        </div>
      </section>

      {/* ── STATS ─────────────────────────────────────────────────────── */}
      <section
        aria-label="Service directory statistics"
        className="px-6 pb-16 max-w-7xl mx-auto w-full"
      >
        <dl className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x rounded-2xl border border-border dark:border-border-dark bg-(--color-bg) dark:bg-surface-dark overflow-hidden">
          {stats.map(({ value, label }) => (
            <div key={label} className="flex flex-col items-center py-10 px-4">
              <dt className="sr-only">{label}</dt>
              <dd className="text-5xl font-black text-primary dark:text-primary-dark mb-2">
                {value}
              </dd>
              <span
                aria-hidden="true"
                className="text-sm font-bold uppercase tracking-wide text-text-secondary dark:text-text-secondary-dark"
              >
                {label}
              </span>
            </div>
          ))}
        </dl>
      </section>

      {/* ── SEARCH ────────────────────────────────────────────────────── */}
      <section
        aria-labelledby="search-heading"
        className="px-6 pb-16 max-w-7xl mx-auto w-full"
      >
        <div className="bg-surface dark:bg-surface-dark p-8 rounded-2xl border border-border dark:border-border-dark">
          <h2
            id="search-heading"
            className="text-xl font-bold mb-6 text-text-primary dark:text-text-primary-dark"
          >
            Search for a Service
          </h2>

          <form
            role="search"
            aria-label="Search disability support services"
            onSubmit={handleSearch}
            className="flex flex-col lg:flex-row gap-4"
          >
            <div className="flex-1">
              <label htmlFor="search-keyword" className="sr-only">
                Search by keyword
              </label>
              <input
                id="search-keyword"
                type="search"
                placeholder="e.g. rehabilitation center..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-describedby="search-hint"
                className={inputBase}
              />
            </div>

            <div>
              <label htmlFor="search-type" className="sr-only">
                Filter by disability type
              </label>
              <select
                id="search-type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={cn(inputBase, "lg:w-64")}
              >
                {disabilityTypes.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="search-region" className="sr-only">
                Filter by region
              </label>
              <select
                id="search-region"
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className={cn(inputBase, "lg:w-48")}
              >
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              aria-label="Search for services"
              className="bg-primary text-(--color-primary-fg) dark:bg-primary-dark dark:text-(--color-primary-dark-fg) px-10 rounded-lg font-bold min-h-[48px] hover:brightness-110 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--color-focus)]"
            >
              Search
            </button>
          </form>

          <p
            id="search-hint"
            className="mt-3 text-xs text-text-muted dark:text-text-muted-dark"
          >
            Type a keyword, or use the dropdowns to filter by type and region.
            Press Enter to search.
          </p>
        </div>
      </section>

      {/* ── FEATURED SERVICES ─────────────────────────────────────────── */}
      <section
        aria-labelledby="featured-heading"
        className="px-6 pb-24 max-w-7xl mx-auto w-full"
      >
        <div className="flex items-center justify-between mb-8">
          <h2
            id="featured-heading"
            className="text-2xl font-bold text-text-primary dark:text-text-primary-dark"
          >
            Featured Services
          </h2>
          <button
            type="button"
            onClick={() => navigate("/services")}
            aria-label="View all disability support services"
            className="text-primary dark:text-primary-dark font-bold hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-focus)] rounded-sm"
          >
            View all services →
          </button>
        </div>

        <ul
          role="list"
          aria-label="Featured disability support services"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featured.map((service) => (
            <li key={service._id}>
              <ServiceCard service={service} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
