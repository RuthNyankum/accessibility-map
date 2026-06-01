import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { cn } from "../../utils/cn";
import {
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
  FaUsers,
  FaListAlt,
  FaChartBar,
} from "react-icons/fa";
import API from "../../services/api";

const ACTION_BADGE = {
  approved: "bg-[var(--color-success-bg)] text-[var(--color-success)] ...",
  rejected: "bg-[var(--color-danger-bg)] text-[var(--color-danger)] ...",
  new_user: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
  pending: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300", // add this
};

function StatCard({ icon: Icon, label, value, colorClass, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`${label}: ${value}. Click to view.`}
      className={cn(
        "flex items-center gap-4 p-5 rounded-2xl border text-left w-full",
        "bg-(--color-bg) dark:bg-surface-dark",
        "border-border dark:border-border-dark",
        "hover:border-primary dark:hover:border-primary-dark",
        "transition-all duration-200",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
      )}
    >
      <div
        className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-lg",
          colorClass,
        )}
      >
        <Icon aria-hidden="true" />
      </div>
      <div>
        <p className="text-2xl font-black text-text-primary dark:text-text-primary-dark">
          {value}
        </p>
        <p className="text-xs font-bold uppercase tracking-wide text-text-muted dark:text-text-muted-dark">
          {label}
        </p>
      </div>
    </button>
  );
}

export default function AdminOverviewPage() {
  const navigate = useNavigate();
  const [recent, setRecent] = useState([]);
  const [stats, setStats] = useState({
    totalServices: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    totalUsers: 0,
    thisMonth: 0,
  });
  const [pending, setPending] = useState([]);

  useEffect(() => {
    document.title = "Overview — AbilityMap Admin";

    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("abilitymap-token");
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        // 1. Fetch in parallel using Axios
        const [svcRes, usersRes] = await Promise.all([
          API.get("/services/admin/all", { headers }),
          API.get("/users", { headers }),
        ]);

        const allServices = svcRes.data.services || [];
        const allUsers = usersRes.data.users || [];

        // 2. Stats calculation
        const now = new Date();

        const thisMonth = allServices.filter((s) => {
          const d = new Date(s.createdAt);
          return (
            d.getMonth() === now.getMonth() &&
            d.getFullYear() === now.getFullYear()
          );
        }).length;

        setStats({
          totalServices: allServices.length,
          approved: allServices.filter((s) => s.status === "approved").length,
          pending: allServices.filter((s) => s.status === "pending").length,
          rejected: allServices.filter((s) => s.status === "rejected").length,
          totalUsers: allUsers.length,
          thisMonth,
        });

        setPending(
          allServices.filter((s) => s.status === "pending").slice(0, 3),
        );

        // 3. Recent activity (services)
        const serviceActivity = allServices
          .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
          .slice(0, 5)
          .map((s) => ({
            id: s._id,
            action:
              s.status === "approved"
                ? "approved"
                : s.status === "rejected"
                  ? "rejected"
                  : "pending",
            label: `${s.name} ${s.status}`,
            at: new Date(s.updatedAt).toLocaleString(),
          }));

        // 4. Recent activity (users)
        const userActivity = allUsers
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 3)
          .map((u) => ({
            id: u._id,
            action: "new_user",
            label: `${u.name} joined`,
            at: new Date(u.createdAt).toLocaleString(),
          }));

        // 5. Merge activity
        const combined = [...serviceActivity, ...userActivity]
          .sort((a, b) => new Date(b.at) - new Date(a.at))
          .slice(0, 6);

        setRecent(combined);
      } catch (err) {
        console.error("Failed to fetch stats:", err);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="flex flex-col gap-8 max-w-5xl">
      <div>
        <h1 className="text-2xl font-black text-text-primary dark:text-text-primary-dark">
          Overview
        </h1>
        <p className="text-sm mt-1 text-text-muted dark:text-text-muted-dark">
          Everything on AbilityMap Ghana at a glance
        </p>
      </div>

      {/* Stats */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">
          Statistics
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          <StatCard
            icon={FaListAlt}
            label="Total Services"
            value={stats.totalServices}
            colorClass="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
            onClick={() => navigate("/admin/services")}
          />
          <StatCard
            icon={FaCheckCircle}
            label="Approved"
            value={stats.approved}
            colorClass="bg-[var(--color-success-bg)] text-[var(--color-success)] dark:bg-[var(--color-success-bg-dark)] dark:text-[var(--color-success-dark)]"
            onClick={() => navigate("/admin/services?status=approved")}
          />
          <StatCard
            icon={FaClock}
            label="Pending Review"
            value={stats.pending}
            colorClass="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
            onClick={() => navigate("/admin/pending")}
          />
          <StatCard
            icon={FaTimesCircle}
            label="Rejected"
            value={stats.rejected}
            colorClass="bg-[var(--color-danger-bg)] text-[var(--color-danger)] dark:bg-[var(--color-danger-bg-dark)] dark:text-[var(--color-danger-dark)]"
            onClick={() => navigate("/admin/services?status=rejected")}
          />
          <StatCard
            icon={FaUsers}
            label="Total Users"
            value={stats.totalUsers}
            colorClass="bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300"
            onClick={() => navigate("/admin/users")}
          />
          <StatCard
            icon={FaChartBar}
            label="Added This Month"
            value={stats.thisMonth}
            colorClass="bg-[var(--color-primary-light)] text-[var(--color-primary)] dark:bg-[#052e16] dark:text-[var(--color-primary-dark)]"
            onClick={() => navigate("/admin/services")}
          />
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pending queue */}
        <section
          aria-labelledby="pending-heading"
          className={cn(
            "p-5 rounded-2xl border",
            "bg-(--color-bg) dark:bg-surface-dark",
            "border-border dark:border-border-dark",
          )}
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              id="pending-heading"
              className="text-base font-black text-text-primary dark:text-text-primary-dark"
            >
              Needs Review
              {pending.length > 0 && (
                <span className="ml-2 text-xs font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200">
                  {pending.length}
                </span>
              )}
            </h2>
            <button
              type="button"
              onClick={() => navigate("/admin/pending")}
              className="text-xs font-bold text-primary dark:text-primary-dark hover:underline min-h-0"
            >
              View all →
            </button>
          </div>

          {pending.length === 0 ? (
            <p className="text-sm text-center py-6 text-text-muted dark:text-text-muted-dark">
              All caught up 🎉
            </p>
          ) : (
            <ul role="list" className="flex flex-col gap-3 list-none p-0">
              {pending.map((s) => (
                <li
                  // key={s.id}
                  key={s._id}
                  className={cn(
                    "flex items-center justify-between gap-3 p-3 rounded-xl",
                    "bg-surface dark:bg-[#2d3f5a]",
                  )}
                >
                  <div className="min-w-0">
                    <p className="text-sm font-bold truncate text-text-primary dark:text-text-primary-dark">
                      {s.name}
                    </p>
                    <p className="text-xs text-text-muted dark:text-text-muted-dark">
                      {s.badge} · {s.location} · {s.submittedBy?.name}
                      {/* {s.badge} · {s.location} · {s.submittedBy} */}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => navigate("/admin/pending")}
                    aria-label={`Review ${s.name}`}
                    className={cn(
                      "shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold min-h-0",
                      "bg-primary text-(--color-primary-fg)",
                      "dark:bg-primary-dark dark:text-(--color-primary-dark-fg)",
                      "hover:opacity-90 transition-opacity",
                      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                    )}
                  >
                    Review
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Recent activity */}
        <section
          aria-labelledby="activity-heading"
          className={cn(
            "p-5 rounded-2xl border",
            "bg-(--color-bg) dark:bg-surface-dark",
            "border-border dark:border-border-dark",
          )}
        >
          <h2
            id="activity-heading"
            className="text-base font-black mb-4 text-text-primary dark:text-text-primary-dark"
          >
            Recent Activity
          </h2>
          <ul role="list" className="flex flex-col gap-4 list-none p-0">
            {recent.map((item) => (
              <li key={item.id} className="flex items-start gap-3">
                <span
                  className={cn(
                    "inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase shrink-0 mt-0.5",
                    ACTION_BADGE[item.action],
                  )}
                >
                  {item.action === "new_user" ? "User" : item.action}
                </span>
                <div>
                  <p className="text-sm font-bold text-text-primary dark:text-text-primary-dark">
                    {item.label}
                  </p>
                  <p className="text-xs text-text-muted dark:text-text-muted-dark">
                    {item.at}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
