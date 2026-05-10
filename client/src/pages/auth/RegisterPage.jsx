import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { cn } from "../../utils/cn";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../../services/api";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");

  const set = (field) => (e) =>
    setForm((p) => ({ ...p, [field]: e.target.value }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Full name is required";
    if (!form.email.trim()) e.email = "Email address is required";
    else if (!form.email.includes("@") || !form.email.includes("."))
      e.email = "Enter a valid email address";
    if (!form.password) e.password = "Password is required";
    else if (form.password.length < 8)
      e.password = "Password must be at least 8 characters";
    if (!form.confirm) e.confirm = "Please confirm your password";
    else if (form.confirm !== form.password)
      e.confirm = "Passwords do not match";
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
      // Use Axios instance (already imported)
      const res = await API.post("/api/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      // Axios automatically parses JSON – no need for res.json()
      const data = res.data;
      if (!res.status === 201)
        throw new Error(data.message || "Registration failed");
      navigate("/login?registered=true");
    } catch (err) {
      setServerError(
        err.response?.data?.message || err.message || "Registration failed",
      );
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
          Create an account
        </h1>
        <p className="text-sm mb-6 text-text-secondary dark:text-text-secondary-dark">
          Register to submit a disability support service
        </p>

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
          {/* Name */}
          <div>
            <label
              htmlFor="reg-name"
              className="block text-sm font-bold mb-1 text-text-primary dark:text-text-primary-dark"
            >
              Full name
            </label>
            <input
              id="reg-name"
              type="text"
              autoComplete="name"
              placeholder="Your full name"
              value={form.name}
              onChange={set("name")}
              aria-describedby={errors.name ? "reg-name-error" : undefined}
              aria-invalid={!!errors.name}
              className={inputClass("name")}
            />
            {errors.name && (
              <p
                id="reg-name-error"
                role="alert"
                className="text-xs mt-1 text-danger dark:text-danger-dark"
              >
                {errors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="reg-email"
              className="block text-sm font-bold mb-1 text-text-primary dark:text-text-primary-dark"
            >
              Email address
            </label>
            <input
              id="reg-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={set("email")}
              aria-describedby={errors.email ? "reg-email-error" : undefined}
              aria-invalid={!!errors.email}
              className={inputClass("email")}
            />
            {errors.email && (
              <p
                id="reg-email-error"
                role="alert"
                className="text-xs mt-1 text-danger dark:text-danger-dark"
              >
                {errors.email}
              </p>
            )}
          </div>

          {/* Password with toggle */}
          <div>
            <label
              htmlFor="reg-password"
              className="block text-sm font-bold mb-1 text-text-primary dark:text-text-primary-dark"
            >
              Password
            </label>
            <div className="relative">
              <input
                id="reg-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={form.password}
                onChange={set("password")}
                aria-describedby={
                  errors.password ? "reg-password-error" : "reg-password-hint"
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
            <p
              id="reg-password-hint"
              className="text-xs mt-1 text-text-muted dark:text-text-muted-dark"
            >
              Minimum 8 characters
            </p>
            {errors.password && (
              <p
                id="reg-password-error"
                role="alert"
                className="text-xs mt-1 text-danger dark:text-danger-dark"
              >
                {errors.password}
              </p>
            )}
          </div>

          {/* Confirm password with toggle */}
          <div>
            <label
              htmlFor="reg-confirm"
              className="block text-sm font-bold mb-1 text-text-primary dark:text-text-primary-dark"
            >
              Confirm password
            </label>
            <div className="relative">
              <input
                id="reg-confirm"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Repeat your password"
                value={form.confirm}
                onChange={set("confirm")}
                aria-describedby={
                  errors.confirm ? "reg-confirm-error" : undefined
                }
                aria-invalid={!!errors.confirm}
                className={cn(inputClass("confirm"), "pr-10")}
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                aria-label={showConfirm ? "Hide password" : "Show password"}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted dark:text-text-muted-dark hover:text-text-primary dark:hover:text-text-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-sm"
              >
                {showConfirm ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirm && (
              <p
                id="reg-confirm-error"
                role="alert"
                className="text-xs mt-1 text-danger dark:text-danger-dark"
              >
                {errors.confirm}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full font-bold text-sm rounded-lg min-h-[52px] mt-2 bg-primary text-(--color-primary-fg) dark:bg-primary-dark dark:text-(--color-primary-dark-fg) hover:bg-primary-hover dark:hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-focus"
          >
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-text-secondary dark:text-text-secondary-dark">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold min-h-0 text-primary dark:text-primary-dark hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-sm"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
