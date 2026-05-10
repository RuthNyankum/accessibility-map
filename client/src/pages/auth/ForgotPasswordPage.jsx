import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "../../utils/cn";
import API from "../../services/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!email.trim()) {
      setError("Email address is required");
      return;
    }

    setLoading(true);
    try {
      const res = await API.post("/api/auth/forgot-password", { email });
      setMessage(
        "If an account with that email exists, we've sent a password reset link.",
      );
      setEmail("");
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = () =>
    cn(
      "w-full px-4 py-2 rounded-lg border text-sm min-h-[48px]",
      "bg-[var(--color-bg)] dark:bg-[var(--color-surface-dark)]",
      "text-[var(--color-text-primary)] dark:text-[var(--color-text-primary-dark)]",
      "placeholder:text-[var(--color-text-muted)] dark:placeholder:text-[var(--color-text-muted-dark)]",
      "focus:outline-none focus:ring-2 transition-colors duration-200",
      "border-[var(--color-border)] dark:border-[var(--color-border-dark)] focus:ring-[var(--color-primary)] dark:focus:ring-[var(--color-primary-dark)]",
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
          Reset your password
        </h1>
        <p className="text-sm mb-6 text-text-secondary dark:text-text-secondary-dark">
          Enter your email address and we'll send you a link to reset your
          password.
        </p>

        {message && (
          <div className="px-4 py-3 rounded-lg text-sm mb-6 border bg-(--color-success-bg) border-(--color-success-border) text-(--color-success) dark:text-success-dark dark:bg-(--color-success-bg-dark)">
            {message}
          </div>
        )}

        {error && (
          <div className="px-4 py-3 rounded-lg text-sm mb-6 border bg-danger-bg border-danger-border text-danger dark:text-danger-dark dark:bg-danger-bg-dark">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <label
              htmlFor="reset-email"
              className="block text-sm font-bold mb-1 text-text-primary dark:text-text-primary-dark"
            >
              Email address
            </label>
            <input
              id="reset-email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass()}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full font-bold text-sm rounded-lg min-h-[52px] mt-2 bg-primary text-(--color-primary-fg) dark:bg-primary-dark dark:text-(--color-primary-dark-fg) hover:bg-primary-hover dark:hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-focus"
          >
            {loading ? "Sending..." : "Send reset link"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-text-secondary dark:text-text-secondary-dark">
          Remember your password?{" "}
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
