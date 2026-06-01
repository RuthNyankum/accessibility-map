import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { cn } from "../utils/cn";
import { ServiceSearch } from "../components/services/ServiceSearch";
import { ServiceFilter } from "../components/services/ServiceFilter";
import { ServiceGrid } from "../components/services/ServiceGrid";
import { ServicePagination } from "../components/services/ServicePagination";
import API from "../services/api";

const PER_PAGE = 8;

export default function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [allServices, setAllServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState(
    searchParams.get("search") || "",
  );
  const [activeSearch, setActiveSearch] = useState(
    searchParams.get("search") || "",
  );
  const [selectedTypes, setSelectedTypes] = useState(() => {
    const t = searchParams.get("type");
    return t ? [t] : [];
  });
  const [selectedRegions, setSelectedRegions] = useState(() => {
    const r = searchParams.get("region");
    return r ? [r] : [];
  });
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    document.title = "All Services — AbilityMap Ghana";
    const fetchServices = async () => {
      try {
        const res = await API.get("/services?limit=100");
        setAllServices(res.data.services || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  const filtered = useMemo(() => {
    return allServices.filter((s) => {
      const matchesSearch =
        !activeSearch ||
        s.name.toLowerCase().includes(activeSearch.toLowerCase()) ||
        s.description?.toLowerCase().includes(activeSearch.toLowerCase());

      const matchesType =
        selectedTypes.length === 0 || selectedTypes.includes(s.badge);

      const matchesRegion =
        selectedRegions.length === 0 || selectedRegions.includes(s.region);

      return matchesSearch && matchesType && matchesRegion;
    });
  }, [allServices, activeSearch, selectedTypes, selectedRegions]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const paginated = filtered.slice(
    (currentPage - 1) * PER_PAGE,
    currentPage * PER_PAGE,
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [activeSearch, selectedTypes, selectedRegions]);

  const handleSearch = () => {
    setActiveSearch(searchInput);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      searchInput ? next.set("search", searchInput) : next.delete("search");
      return next;
    });
  };

  const handleClear = () => {
    setSearchInput("");
    setActiveSearch("");
    setSelectedTypes([]);
    setSelectedRegions([]);
    setSearchParams({});
  };

  const handleTypeChange = (type, checked) => {
    setSelectedTypes((prev) =>
      checked ? [...prev, type] : prev.filter((t) => t !== type),
    );
  };

  const handleRegionChange = (region, checked) => {
    setSelectedRegions((prev) =>
      checked ? [...prev, region] : prev.filter((r) => r !== region),
    );
  };

  return (
    <div
      className={cn(
        "min-h-screen px-6 py-8 max-w-6xl mx-auto",
        "bg-(--color-bg) dark:bg-bg-dark",
        "transition-colors duration-300",
      )}
    >
      <header className="mb-6">
        <h1
          id="services-heading"
          aria-describedby="services-subheading"
          className={cn(
            "text-2xl font-bold mb-1",
            "text-text-primary dark:text-text-primary-dark",
          )}
        >
          All Services
        </h1>
        <p
          id="services-subheading"
          className={cn(
            "text-sm",
            "text-text-secondary dark:text-text-secondary-dark",
          )}
        >
          Browse disability support services across Ghana
        </p>
      </header>

      <div className="mb-8">
        <ServiceSearch
          value={searchInput}
          onChange={setSearchInput}
          onSearch={handleSearch}
          onClear={handleClear}
          totalCount={allServices.length}
          shownCount={filtered.length}
        />
      </div>

      <div className="flex gap-6 items-start">
        <aside className="hidden md:block w-44 shrink-0">
          <ServiceFilter
            selectedTypes={selectedTypes}
            selectedRegions={selectedRegions}
            onTypeChange={handleTypeChange}
            onRegionChange={handleRegionChange}
          />
        </aside>

        <div className="flex-1 min-w-0">
          <ServiceGrid services={paginated} loading={loading} />
          <ServicePagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </div>
  );
}
