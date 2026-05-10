import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "../../utils/cn";
import { FaEye, FaEyeSlash } from "react-icons/fa";

// ✅ Get API base URL from environment (set in Vercel)
const API_BASE = import.meta.env.VITE_API_URL || "";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const justRegistered = searchParams.get("registered") === "true";

  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const set = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.email.trim()) e.email = "Email address is required";
    if (!form.password) e.password = "Password is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setErrors({});
    setLoading(true);

    try {
      // ✅ Use API_BASE to point to Render backend
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("abilitymap-token", data.token);
      localStorage.setItem("abilitymap-user", JSON.stringify(data.user));
      window.dispatchEvent(new Event("abilitymap-auth"));

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        const from = searchParams.get("from") || "/";
        navigate(from);
      }
    } catch (err) {
      setServerError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    cn(
      "w-full px-4 py-2 rounded-lg border text-sm min-h-[48px]",
      "bg-[var(--color-bg)] dark:bg-[var(--color-surface-dark)]",
      "text-[var(--color-text-primary)] dark:text-[var(--color-text-primary-dark)]",
      "placeholder:text-[var(--color-text-muted)] dark:placeholder:text-[var(--color-text-muted-dark)]",
      "focus:outline-none focus:ring-2 transition-colors duration-200",
      errors[field]
        ? "border-[var(--color-danger)] focus:ring-[var(--color-danger)]"
        : "border-[var(--color-border)] dark:border-[var(--color-border-dark)] focus:ring-[var(--color-primary)] dark:focus:ring-[var(--color-primary-dark)]",
    );

  // ... (rest of the component JSX remains unchanged) ...

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-12 bg-(--color-bg) dark:bg-bg-dark transition-colors duration-300">
      <div className="w-full max-w-md p-8 rounded-2xl border bg-(--color-bg) dark:bg-surface-dark border-border dark:border-border-dark">
        <Link
          to="/"
          className="block text-lg font-black mb-6 min-h-0 text-primary dark:text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-sm"
        >
          AbilityMap Ghana
        </Link>

        <h1 className="text-2xl font-bold mb-1 text-text-primary dark:text-text-primary-dark">
          Sign in
        </h1>
        <p className="text-sm mb-6 text-text-secondary dark:text-text-secondary-dark">
          Sign in to submit or manage services
        </p>

        {justRegistered && (
          <div className="px-4 py-3 rounded-lg text-sm mb-6 border bg-(--color-success-bg) border-(--color-success-border) text-(--color-success) dark:text-success-dark dark:bg-(--color-success-bg-dark)">
            Account created successfully. You can now sign in.
          </div>
        )}

        {serverError && (
          <div className="px-4 py-3 rounded-lg text-sm mb-6 border bg-danger-bg border-danger-border text-danger dark:text-danger-dark dark:bg-danger-bg-dark">
            {serverError}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex flex-col gap-5"
        >
          {/* Email */}
          <div>
            <label
              htmlFor="login-email"
              className="block text-sm font-bold mb-1 text-text-primary dark:text-text-primary-dark"
            >
              Email address
            </label>
            <input
              id="login-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set("email")}
              aria-describedby={errors.email ? "login-email-error" : undefined}
              aria-invalid={!!errors.email}
              className={inputClass("email")}
            />
            {errors.email && (
              <p
                id="login-email-error"
                role="alert"
                className="text-xs mt-1 text-danger dark:text-danger-dark"
              >
                {errors.email}
              </p>
            )}
          </div>

          {/* Password with toggle */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor="login-password"
                className="text-sm font-bold text-text-primary dark:text-text-primary-dark"
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-xs min-h-0 text-primary dark:text-primary-dark hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-sm"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <input
                id="login-password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Your password"
                value={form.password}
                onChange={set("password")}
                aria-describedby={
                  errors.password ? "login-password-error" : undefined
                }
                aria-invalid={!!errors.password}
                className={cn(inputClass("password"), "pr-10")}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted dark:text-text-muted-dark hover:text-text-primary dark:hover:text-text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-sm"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p
                id="login-password-error"
                role="alert"
                className="text-xs mt-1 text-danger dark:text-danger-dark"
              >
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full font-bold text-sm rounded-lg min-h-[52px] mt-2 bg-primary text-(--color-primary-fg) dark:bg-primary-dark dark:text-(--color-primary-dark-fg) hover:bg-primary-hover dark:hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-focus"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-text-secondary dark:text-text-secondary-dark">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-bold min-h-0 text-primary dark:text-primary-dark hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-sm"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}
