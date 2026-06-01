import { useState, useEffect, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { cn } from "../../utils/cn";
import { Badge } from "../../components/common/Badge";
import { FaTrash, FaStar, FaRegStar, FaEye } from "react-icons/fa";
import API from "../../services/api";

const STATUS_PILL = {
  approved:
    "bg-success-bg text-success dark:bg-success-bg-dark dark:text-success-dark",
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  rejected:
    "bg-danger-bg text-danger dark:bg-danger-bg-dark dark:text-danger-dark",
};

function DetailModal({ service, onClose }) {
  if (!service) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="detail-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 rounded-2xl border z-10",
          "bg-bg dark:bg-surface-dark",
          "border-border dark:border-border-dark",
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <h2
            id="detail-title"
            className="text-xl font-black text-text-primary dark:text-text-primary-dark"
          >
            {service.name}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="text-2xl leading-none text-text-muted hover:text-text-primary dark:hover:text-text-primary-dark"
          >
            ×
          </button>
        </div>

        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <div>
            <dt className="text-xs font-black uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
              Badge
            </dt>
            <dd className="mt-1">
              <Badge type={service.badgeColor} label={service.badge} />
            </dd>
          </div>
          <div>
            <dt className="text-xs font-black uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
              Status
            </dt>
            <dd className="mt-1">
              <span
                className={cn(
                  "px-2 py-1 rounded-full text-[10px] font-black uppercase",
                  STATUS_PILL[service.status],
                )}
              >
                {service.status}
              </span>
            </dd>
          </div>
          <div>
            <dt className="text-xs font-black uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
              Category
            </dt>
            <dd className="font-bold text-text-primary dark:text-text-primary-dark">
              {service.category}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-black uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
              Location
            </dt>
            <dd className="font-bold text-text-primary dark:text-text-primary-dark">
              {service.location}, {service.region}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-black uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
              Phone
            </dt>
            <dd className="font-bold text-text-primary dark:text-text-primary-dark">
              {service.phone}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-black uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
              Email
            </dt>
            <dd className="font-bold text-text-primary dark:text-text-primary-dark">
              {service.email || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-black uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
              Address
            </dt>
            <dd className="font-bold text-text-primary dark:text-text-primary-dark">
              {service.address || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-black uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
              Hours
            </dt>
            <dd className="font-bold text-text-primary dark:text-text-primary-dark">
              {service.hours || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-black uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
              Submitted By
            </dt>
            <dd className="font-bold text-text-primary dark:text-text-primary-dark">
              {service.submittedBy?.name || "Unknown"}
              <span className="block text-xs font-normal">
                {service.submittedBy?.email}
              </span>
            </dd>
          </div>
          <div className="col-span-1 sm:col-span-2">
            <dt className="text-xs font-black uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
              Short Description
            </dt>
            <dd className="mt-1 text-text-secondary dark:text-text-secondary-dark leading-relaxed">
              {service.description}
            </dd>
          </div>
          {service.about && (
            <div className="col-span-1 sm:col-span-2">
              <dt className="text-xs font-black uppercase tracking-wider text-text-muted dark:text-text-muted-dark">
                Full Description
              </dt>
              <dd className="mt-1 text-text-secondary dark:text-text-secondary-dark leading-relaxed whitespace-pre-wrap">
                {service.about}
              </dd>
            </div>
          )}
        </dl>

        <div className="flex justify-end mt-6">
          <button
            type="button"
            onClick={onClose}
            className={cn(
              "px-5 py-2 rounded-xl font-bold text-sm",
              "border border-border dark:border-border-dark",
              "text-text-primary dark:text-text-primary-dark",
              "hover:bg-surface dark:hover:bg-surface-dark",
            )}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminServicesPage() {
  const [searchParams] = useSearchParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(
    searchParams.get("status") || "all",
  );
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [detailService, setDetailService] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    document.title = "All Services — AbilityMap Admin";

    const fetchServices = async () => {
      try {
        const res = await API.get("/services/admin/all");
        setServices(res.data.services || []);
      } catch (err) {
        console.error("Failed to fetch services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = useMemo(
    () =>
      services.filter((s) => {
        const matchSearch =
          !search ||
          s.name.toLowerCase().includes(search.toLowerCase()) ||
          s.location.toLowerCase().includes(search.toLowerCase());
        const matchStatus = statusFilter === "all" || s.status === statusFilter;
        return matchSearch && matchStatus;
      }),
    [services, search, statusFilter],
  );

  const handleDelete = async (id) => {
    try {
      await API.delete(`/services/${id}`);

      setServices((prev) => prev.filter((s) => s._id !== id));
      setDeleteConfirm(null);

      showToast("Service deleted");
    } catch (err) {
      console.error("Delete failed:", err);
      showToast("Delete failed");
    }
  };

  const toggleFeatured = async (id) => {
    try {
      const service = services.find((s) => s._id === id);
      if (!service) return;

      const newFeatured = !service.featured;

      const res = await API.patch(`/services/${id}/feature`, {
        featured: newFeatured,
      });

      const updatedFeatured = res.data.service?.featured ?? res.data.featured;

      setServices((prev) =>
        prev.map((s) =>
          s._id === id ? { ...s, featured: updatedFeatured } : s,
        ),
      );

      showToast(
        `Service ${newFeatured ? "featured" : "unfeatured"} successfully`,
      );
    } catch (err) {
      console.error("Feature toggle failed:", err);
      showToast(`Error: ${err.message}`);
    }
  };

  const filterBtn = (val) =>
    cn(
      "px-4 py-2 rounded-lg text-sm font-bold min-h-[40px] transition-colors duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
      statusFilter === val
        ? "bg-primary text-primary-fg dark:bg-primary-dark dark:text-primary-dark-fg"
        : "border border-border dark:border-border-dark text-text-secondary dark:text-text-secondary-dark hover:bg-surface dark:hover:bg-surface-dark",
    );

  if (loading) {
    return <div className="p-8 text-center font-bold">Loading services...</div>;
  }

  return (
    <div className="flex flex-col gap-6 max-w-5xl">
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-4 right-4 z-50 px-5 py-3 rounded-xl text-sm font-bold bg-success-bg text-success border border-success-border"
        >
          {toast}
        </div>
      )}

      {deleteConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="del-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
        >
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setDeleteConfirm(null)}
            aria-hidden="true"
          />
          <div
            className={cn(
              "relative w-full max-w-sm p-6 rounded-2xl border z-10",
              "bg-bg dark:bg-surface-dark",
              "border-border dark:border-border-dark",
            )}
          >
            <h3
              id="del-title"
              className="text-base font-black mb-2 text-text-primary dark:text-text-primary-dark"
            >
              Delete service?
            </h3>
            <p className="text-sm mb-6 text-text-secondary dark:text-text-secondary-dark">
              "{deleteConfirm.name}" will be permanently deleted.
            </p>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirm._id)}
                className="flex-1 py-3 rounded-xl font-bold text-sm min-h-[44px] bg-danger text-white hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus"
              >
                Delete
              </button>
              <button
                type="button"
                onClick={() => setDeleteConfirm(null)}
                className={cn(
                  "flex-1 py-3 rounded-xl font-bold text-sm min-h-[44px]",
                  "border border-border dark:border-border-dark",
                  "text-text-primary dark:text-text-primary-dark",
                  "hover:bg-surface focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                )}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {detailService && (
        <DetailModal
          service={detailService}
          onClose={() => setDetailService(null)}
        />
      )}

      <div>
        <h1 className="text-2xl font-black text-text-primary dark:text-text-primary-dark">
          All Services
        </h1>
        <p className="text-sm mt-1 text-text-muted dark:text-text-muted-dark">
          {filtered.length} of {services.length} services
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="svc-search" className="sr-only">
            Search services
          </label>
          <input
            id="svc-search"
            type="search"
            placeholder="Search by name or location..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={cn(
              "w-full px-4 py-2 rounded-lg border text-sm min-h-[44px]",
              "bg-bg dark:bg-surface-dark",
              "text-text-primary dark:text-text-primary-dark",
              "border-border dark:border-border-dark",
              "placeholder:text-text-muted dark:placeholder:text-text-muted-dark",
              "focus:outline-none focus:ring-2 focus:ring-primary dark:focus:ring-primary-dark",
            )}
          />
        </div>

        <div
          role="group"
          aria-label="Filter by status"
          className="flex gap-2 flex-wrap"
        >
          {["all", "approved", "pending", "rejected"].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setStatusFilter(v)}
              aria-pressed={statusFilter === v}
              className={filterBtn(v)}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div
        className={cn(
          "rounded-2xl border overflow-hidden",
          "border-border dark:border-border-dark",
        )}
      >
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-2">
            <span aria-hidden="true" className="text-3xl">
              🔍
            </span>
            <p className="text-sm text-text-muted dark:text-text-muted-dark">
              No services match
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="All services">
              <thead>
                <tr
                  className={cn(
                    "border-b text-left",
                    "bg-surface dark:bg-surface-dark",
                    "border-border dark:border-border-dark",
                  )}
                >
                  {[
                    "Service",
                    "Type",
                    "Location",
                    "Submitted By",
                    "Status",
                    "Featured",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      scope="col"
                      className="px-4 py-3 text-xs font-black uppercase tracking-wider text-text-muted dark:text-text-muted-dark"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <tr
                    key={s._id}
                    className={cn(
                      "border-b transition-colors duration-150 hover:bg-surface dark:hover:bg-surface-dark",
                      "border-border dark:border-border-dark",
                      i === filtered.length - 1 && "border-b-0",
                    )}
                  >
                    <td className="px-4 py-3">
                      <p className="font-bold text-text-primary dark:text-text-primary-dark">
                        {s.name}
                      </p>
                      <p className="text-xs text-text-muted dark:text-text-muted-dark">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <Badge type={s.badgeColor} label={s.badge} />
                    </td>
                    <td className="px-4 py-3 text-text-secondary dark:text-text-secondary-dark">
                      {s.location}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-bold text-text-primary dark:text-text-primary-dark">
                        {s.submittedBy?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-text-muted dark:text-text-muted-dark">
                        {s.submittedBy?.email || ""}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "px-2 py-1 rounded-full text-[10px] font-black uppercase",
                          STATUS_PILL[s.status],
                        )}
                      >
                        {s.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => toggleFeatured(s._id)}
                        aria-label={
                          s.featured
                            ? `Remove ${s.name} from featured`
                            : `Feature ${s.name}`
                        }
                        aria-pressed={s.featured}
                        className="text-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded"
                      >
                        {s.featured ? (
                          <FaStar
                            aria-hidden="true"
                            className="text-amber-400"
                          />
                        ) : (
                          <FaRegStar
                            aria-hidden="true"
                            className="text-text-muted dark:text-text-muted-dark"
                          />
                        )}
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setDetailService(s)}
                          aria-label={`View details of ${s.name}`}
                          className={cn(
                            "w-8 h-8 flex items-center justify-center rounded-lg text-xs",
                            "text-text-secondary dark:text-text-secondary-dark",
                            "hover:bg-surface dark:hover:bg-surface-dark",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                          )}
                        >
                          <FaEye aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteConfirm(s)}
                          aria-label={`Delete ${s.name}`}
                          className={cn(
                            "w-8 h-8 flex items-center justify-center rounded-lg text-xs",
                            "text-danger dark:text-danger-dark",
                            "hover:bg-danger-bg dark:hover:bg-red-950",
                            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                          )}
                        >
                          <FaTrash aria-hidden="true" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
