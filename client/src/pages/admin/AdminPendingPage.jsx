import { useState, useEffect } from "react";
import { cn } from "../../utils/cn";
import { Badge } from "../../components/common/Badge";
import { FaCheck, FaTimes, FaEye } from "react-icons/fa";

function ConfirmModal({ action, service, onConfirm, onCancel }) {
  const isApprove = action === "approve";
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onCancel}
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
          id="confirm-title"
          className="text-base font-black mb-2 text-text-primary dark:text-text-primary-dark"
        >
          {isApprove ? "Approve service?" : "Reject service?"}
        </h3>
        <p className="text-sm mb-6 text-text-secondary dark:text-text-secondary-dark">
          {isApprove
            ? `"${service.name}" will be published and visible to the public.`
            : `"${service.name}" will be rejected and not published.`}
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              "flex-1 py-3 rounded-xl font-bold text-sm min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
              isApprove
                ? "bg-primary text-primary-fg dark:bg-primary-dark dark:text-primary-dark-fg"
                : "bg-danger text-white",
            )}
          >
            {isApprove ? "Approve" : "Reject"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className={cn(
              "flex-1 py-3 rounded-xl font-bold text-sm min-h-[44px]",
              "border border-border dark:border-border-dark",
              "text-text-primary dark:text-text-primary-dark",
              "hover:bg-surface dark:hover:bg-surface-dark",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
            )}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminPendingPage() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    document.title = "Pending Review — AbilityMap Admin";
    const fetchPending = async () => {
      try {
        const token = localStorage.getItem("abilitymap-token");
        const res = await fetch("/api/services/admin/all?status=pending", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setServices(data.services || []);
      } catch (err) {
        console.error("Failed to fetch pending services:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPending();
  }, []);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3500);
  };

  const handleConfirm = async () => {
    const { action, service } = confirm;
    setConfirm(null);
    try {
      const token = localStorage.getItem("abilitymap-token");
      await fetch(`/api/services/${service._id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          status: action === "approve" ? "approved" : "rejected",
        }),
      });
      setServices((prev) => prev.filter((s) => s._id !== service._id));
      showToast(
        action === "approve"
          ? `"${service.name}" approved`
          : `"${service.name}" rejected`,
        action === "approve" ? "success" : "danger",
      );
    } catch (err) {
      showToast("Something went wrong", "danger");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 rounded-full border-4 animate-spin border-border border-t-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className={cn(
            "fixed top-4 right-4 z-50 px-5 py-3 rounded-xl text-sm font-bold shadow-lg border",
            toast.type === "success"
              ? "bg-success-bg text-success border-success-border"
              : "bg-danger-bg text-danger border-danger-border",
          )}
        >
          {toast.msg}
        </div>
      )}

      {confirm && (
        <ConfirmModal
          action={confirm.action}
          service={confirm.service}
          onConfirm={handleConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      <div>
        <h1 className="text-2xl font-black text-text-primary dark:text-text-primary-dark">
          Pending Review
        </h1>
        <p className="text-sm mt-1 text-text-muted dark:text-text-muted-dark">
          {services.length === 0
            ? "All caught up — no services waiting"
            : `${services.length} ${services.length === 1 ? "service" : "services"} waiting for review`}
        </p>
      </div>

      {services.length === 0 && (
        <div
          className={cn(
            "flex flex-col items-center justify-center py-20 rounded-2xl border",
            "border-border dark:border-border-dark",
            "bg-surface dark:bg-surface-dark",
          )}
        >
          <span aria-hidden="true" className="text-4xl mb-3">
            🎉
          </span>
          <p className="font-bold text-text-primary dark:text-text-primary-dark">
            Nothing to review
          </p>
        </div>
      )}

      <ul role="list" className="flex flex-col gap-4 list-none p-0">
        {services.map((s) => {
          const isOpen = expanded === s._id;
          return (
            <li
              key={s._id}
              className={cn(
                "rounded-2xl border transition-colors duration-200",
                "bg-bg dark:bg-surface-dark",
                "border-border dark:border-border-dark",
              )}
            >
              {/* Summary */}
              <div className="flex items-center gap-4 p-5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge type={s.badgeColor} label={s.badge} />
                    <span className="text-xs text-text-muted dark:text-text-muted-dark">
                      by {s.submittedBy?.name} ·{" "}
                      {new Date(s.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="font-black text-base truncate text-text-primary dark:text-text-primary-dark">
                    {s.name}
                  </p>
                  <p className="text-xs mt-0.5 text-text-secondary dark:text-text-secondary-dark">
                    📍 {s.location} · 📞 {s.phone}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => setExpanded(isOpen ? null : s._id)}
                    aria-label={
                      isOpen ? `Collapse ${s.name}` : `Expand ${s.name}`
                    }
                    aria-expanded={isOpen}
                    className={cn(
                      "w-10 h-10 flex items-center justify-center rounded-xl border text-sm",
                      "border-border dark:border-border-dark",
                      "text-text-secondary dark:text-text-secondary-dark",
                      "hover:bg-surface dark:hover:bg-surface-dark",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                    )}
                  >
                    <FaEye aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setConfirm({ action: "approve", service: s })
                    }
                    aria-label={`Approve ${s.name}`}
                    className={cn(
                      "w-10 h-10 flex items-center justify-center rounded-xl text-sm",
                      "bg-success-bg text-success",
                      "dark:bg-success-bg-dark dark:text-success-dark",
                      "hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                    )}
                  >
                    <FaCheck aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirm({ action: "reject", service: s })}
                    aria-label={`Reject ${s.name}`}
                    className={cn(
                      "w-10 h-10 flex items-center justify-center rounded-xl text-sm",
                      "bg-danger-bg text-danger",
                      "dark:bg-danger-bg-dark dark:text-danger-dark",
                      "hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                    )}
                  >
                    <FaTimes aria-hidden="true" />
                  </button>
                </div>
              </div>

              {/* Expanded */}
              {isOpen && (
                <div
                  className={cn(
                    "px-5 pb-5 border-t",
                    "border-border dark:border-border-dark",
                  )}
                >
                  <dl className="grid grid-cols-2 gap-x-8 gap-y-4 mt-4 text-sm">
                    {[
                      ["Email", s.email],
                      ["Address", s.address],
                      ["Hours", s.hours],
                      ["Region", s.region],
                    ].map(
                      ([label, value]) =>
                        value && (
                          <div key={label}>
                            <dt className="text-xs font-bold uppercase tracking-wider mb-0.5 text-text-muted dark:text-text-muted-dark">
                              {label}
                            </dt>
                            <dd className="font-bold text-text-primary dark:text-text-primary-dark">
                              {value}
                            </dd>
                          </div>
                        ),
                    )}
                    {/* Short description */}
                    <div className="col-span-2">
                      <dt className="text-xs font-bold uppercase tracking-wider mb-0.5 text-text-muted dark:text-text-muted-dark">
                        Short Description
                      </dt>
                      <dd className="leading-relaxed text-text-secondary dark:text-text-secondary-dark">
                        {s.description}
                      </dd>
                    </div>
                    {/* Full description (optional) */}
                    {s.about && (
                      <div className="col-span-2">
                        <dt className="text-xs font-bold uppercase tracking-wider mb-0.5 text-text-muted dark:text-text-muted-dark">
                          Full Description
                        </dt>
                        <dd className="leading-relaxed text-text-secondary dark:text-text-secondary-dark">
                          {s.about}
                        </dd>
                      </div>
                    )}
                  </dl>
                  <div className="flex gap-3 mt-5">
                    <button
                      type="button"
                      onClick={() =>
                        setConfirm({ action: "approve", service: s })
                      }
                      className={cn(
                        "flex-1 py-3 rounded-xl font-bold text-sm min-h-[44px]",
                        "bg-primary text-primary-fg",
                        "dark:bg-primary-dark dark:text-primary-dark-fg",
                        "hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                      )}
                    >
                      ✓ Approve & Publish
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setConfirm({ action: "reject", service: s })
                      }
                      className={cn(
                        "flex-1 py-3 rounded-xl font-bold text-sm min-h-[44px]",
                        "border border-danger text-danger",
                        "dark:border-red-500 dark:text-red-400",
                        "hover:bg-danger-bg dark:hover:bg-red-950",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                      )}
                    >
                      ✕ Reject
                    </button>
                  </div>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
