import { useState, useEffect, useMemo } from "react";
import { cn } from "../../utils/cn";
import { FaTrash, FaUserShield, FaUser, FaEye, FaTimes } from "react-icons/fa";
import { Badge } from "../../components/common/Badge";
import API from "../../services/api";

const STATUS_PILL = {
  approved:
    "bg-success-bg text-success dark:bg-success-bg-dark dark:text-success-dark",
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200",
  rejected:
    "bg-danger-bg text-danger dark:bg-danger-bg-dark dark:text-danger-dark",
};

function UserServicesModal({ user, onClose }) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserServices = async () => {
      try {
        const res = await API.get("/services/admin/all");

        const all = res.data.services || [];

        setServices(all.filter((s) => s.submittedBy?._id === user._id));
      } catch (err) {
        console.error("Failed to fetch services:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserServices();

    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKey);

    return () => window.removeEventListener("keydown", handleKey);
  }, [user._id, onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="user-services-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className={cn(
          "relative w-full max-w-lg max-h-[80vh] flex flex-col rounded-2xl border z-10",
          "bg-bg dark:bg-surface-dark",
          "border-border dark:border-border-dark",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border dark:border-border-dark">
          <div>
            <h3
              id="user-services-title"
              className="text-base font-black text-text-primary dark:text-text-primary-dark"
            >
              {user.name}'s Submissions
            </h3>
            <p className="text-xs text-text-muted dark:text-text-muted-dark mt-0.5">
              {user.email}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className={cn(
              "w-8 h-8 flex items-center justify-center rounded-lg",
              "text-text-muted dark:text-text-muted-dark",
              "hover:bg-surface dark:hover:bg-surface-dark",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
            )}
          >
            <FaTimes aria-hidden="true" />
          </button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-5">
          {loading ? (
            <p className="text-sm text-center py-8 text-text-muted dark:text-text-muted-dark">
              Loading...
            </p>
          ) : services.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <span aria-hidden="true" className="text-3xl">
                📭
              </span>
              <p className="text-sm text-text-muted dark:text-text-muted-dark">
                No submissions yet
              </p>
            </div>
          ) : (
            <ul role="list" className="flex flex-col gap-3 list-none p-0">
              {services.map((s) => (
                <li
                  key={s._id}
                  className={cn(
                    "flex items-center justify-between gap-3 p-4 rounded-xl border",
                    "bg-surface dark:bg-surface-dark",
                    "border-border dark:border-border-dark",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold truncate text-text-primary dark:text-text-primary-dark">
                      {s.name}
                    </p>
                    <p className="text-xs text-text-muted dark:text-text-muted-dark mt-0.5">
                      {s.location} ·{" "}
                      {new Date(s.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge type={s.badgeColor} label={s.badge} />
                    <span
                      className={cn(
                        "px-2 py-1 rounded-full text-[10px] font-black uppercase",
                        STATUS_PILL[s.status],
                      )}
                    >
                      {s.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {!loading && services.length > 0 && (
          <div className="px-5 py-3 border-t border-border dark:border-border-dark">
            <p className="text-xs text-text-muted dark:text-text-muted-dark">
              {services.length} submission{services.length !== 1 ? "s" : ""}{" "}
              total
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewServicesUser, setViewServicesUser] = useState(null);
  const [toast, setToast] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    document.title = "Users — AbilityMap Admin";

    const fetchUsers = async () => {
      try {
        const res = await API.get("/users");
        setUsers(res.data.users || []);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const filtered = useMemo(
    () =>
      users.filter((u) => {
        const matchSearch =
          !search ||
          u.name.toLowerCase().includes(search.toLowerCase()) ||
          u.email.toLowerCase().includes(search.toLowerCase());
        const matchRole = roleFilter === "all" || u.role === roleFilter;
        return matchSearch && matchRole;
      }),
    [users, search, roleFilter],
  );

  const toggleRole = async (id) => {
    try {
      const user = users.find((u) => u._id === id);
      if (!user) return;

      const newRole = user.role === "admin" ? "user" : "admin";

      await API.patch(`/users/${id}/role`, {
        role: newRole,
      });

      setUsers((p) =>
        p.map((u) => (u._id === id ? { ...u, role: newRole } : u)),
      );

      showToast(
        `${user.name} is now ${
          newRole === "admin" ? "an admin" : "a regular user"
        }`,
      );
    } catch (err) {
      console.error("Role update failed:", err);
      showToast("Failed to update role");
    }
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/users/${id}`);

      setUsers((p) => p.filter((u) => u._id !== id));
      setDeleteConfirm(null);

      showToast("User deleted");
    } catch (err) {
      console.error("Delete failed:", err);
      showToast("Failed to delete user");
    }
  };

  const filterBtn = (val) =>
    cn(
      "px-4 py-2 rounded-lg text-sm font-bold min-h-[40px] transition-colors duration-200",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
      roleFilter === val
        ? "bg-primary text-primary-fg dark:bg-primary-dark dark:text-primary-dark-fg"
        : "border border-border dark:border-border-dark text-text-secondary dark:text-text-secondary-dark hover:bg-surface dark:hover:bg-surface-dark",
    );

  return (
    <div className="flex flex-col gap-6 max-w-4xl">
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-4 right-4 z-50 px-5 py-3 rounded-xl text-sm font-bold bg-success-bg text-success border border-success-border"
        >
          {toast}
        </div>
      )}

      {viewServicesUser && (
        <UserServicesModal
          user={viewServicesUser}
          onClose={() => setViewServicesUser(null)}
        />
      )}

      {deleteConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="del-user-title"
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
              id="del-user-title"
              className="text-base font-black mb-2 text-text-primary dark:text-text-primary-dark"
            >
              Delete user?
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

      <div>
        <h1 className="text-2xl font-black text-text-primary dark:text-text-primary-dark">
          Users
        </h1>
        <p className="text-sm mt-1 text-text-muted dark:text-text-muted-dark">
          {filtered.length} of {users.length} users
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex-1 min-w-[200px]">
          <label htmlFor="user-search" className="sr-only">
            Search users
          </label>
          <input
            id="user-search"
            type="search"
            placeholder="Search by name or email..."
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
        <div role="group" aria-label="Filter by role" className="flex gap-2">
          {["all", "user", "admin"].map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => setRoleFilter(v)}
              aria-pressed={roleFilter === v}
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
        <table className="w-full text-sm" aria-label="All users">
          <thead>
            <tr
              className={cn(
                "border-b text-left",
                "bg-surface dark:bg-surface-dark",
                "border-border dark:border-border-dark",
              )}
            >
              {["User", "Role", "Joined", "Submissions", "Actions"].map((h) => (
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
            {filtered.map((u, i) => (
              <tr
                key={u._id}
                className={cn(
                  "border-b transition-colors duration-150 hover:bg-surface dark:hover:bg-surface-dark",
                  "border-border dark:border-border-dark",
                  i === filtered.length - 1 && "border-b-0",
                )}
              >
                <td className="px-4 py-3">
                  <p className="font-bold text-text-primary dark:text-text-primary-dark">
                    {u.name}
                  </p>
                  <p className="text-xs text-text-muted dark:text-text-muted-dark">
                    {u.email}
                  </p>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black uppercase",
                      u.role === "admin"
                        ? "bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-200"
                        : "bg-surface-2 text-text-secondary dark:bg-surface-dark dark:text-text-secondary-dark",
                    )}
                  >
                    {u.role === "admin" ? (
                      <FaUserShield
                        aria-hidden="true"
                        className="text-[10px]"
                      />
                    ) : (
                      <FaUser aria-hidden="true" className="text-[10px]" />
                    )}
                    {u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-text-secondary dark:text-text-secondary-dark">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-center font-bold text-text-primary dark:text-text-primary-dark">
                  {u.submissionsCount ?? 0}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setViewServicesUser(u)}
                      aria-label={`View ${u.name}'s submissions`}
                      className={cn(
                        "w-8 h-8 flex items-center justify-center rounded-lg text-xs border",
                        "border-border dark:border-border-dark",
                        "text-primary dark:text-primary-dark",
                        "hover:bg-surface dark:hover:bg-surface-dark",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                      )}
                    >
                      <FaEye aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleRole(u._id)}
                      aria-label={
                        u.role === "admin"
                          ? `Remove admin from ${u.name}`
                          : `Make ${u.name} an admin`
                      }
                      className={cn(
                        "w-8 h-8 flex items-center justify-center rounded-lg text-xs border",
                        "border-border dark:border-border-dark",
                        "text-text-secondary dark:text-text-secondary-dark",
                        "hover:bg-surface dark:hover:bg-surface-dark",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus",
                      )}
                    >
                      <FaUserShield aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteConfirm(u)}
                      aria-label={`Delete ${u.name}`}
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
    </div>
  );
}
