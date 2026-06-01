import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { cn } from "../../utils/cn";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import API from "../../services/api";

export default function ResetPasswordPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [validToken, setValidToken] = useState(true);

  useEffect(() => {
    // Optional: validate token format or make a quick API call
    if (!token) setValidToken(false);
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);

    if (!password) {
      setError("Password is required");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const res = await API.post("/auth/reset-password", {
        token,
        password,
      });

      setMessage("Password reset successful! Redirecting to login...");

      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Reset failed");
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

  if (!validToken) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6 py-12">
        <div className="text-center">
          <p className="text-danger dark:text-danger-dark">
            Invalid or missing reset token. Please request a new password reset.
          </p>
          <Link
            to="/forgot-password"
            className="mt-4 inline-block text-primary dark:text-primary-dark underline"
          >
            Request new link
          </Link>
        </div>
      </div>
    );
  }

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
          Create new password
        </h1>
        <p className="text-sm mb-6 text-text-secondary dark:text-text-secondary-dark">
          Enter a new password for your account.
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
              htmlFor="new-password"
              className="block text-sm font-bold mb-1 text-text-primary dark:text-text-primary-dark"
            >
              New password
            </label>
            <div className="relative">
              <input
                id="new-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                placeholder="At least 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(inputClass(), "pr-10")}
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
          </div>

          <div>
            <label
              htmlFor="confirm-password"
              className="block text-sm font-bold mb-1 text-text-primary dark:text-text-primary-dark"
            >
              Confirm password
            </label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirm ? "text" : "password"}
                autoComplete="new-password"
                placeholder="Repeat your password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                className={cn(inputClass(), "pr-10")}
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
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full font-bold text-sm rounded-lg min-h-[52px] mt-2 bg-primary text-(--color-primary-fg) dark:bg-primary-dark dark:text-(--color-primary-dark-fg) hover:bg-primary-hover dark:hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-focus"
          >
            {loading ? "Resetting..." : "Reset password"}
          </button>
        </form>

        <p className="text-sm text-center mt-6 text-text-secondary dark:text-text-secondary-dark">
          <Link
            to="/login"
            className="font-bold min-h-0 text-primary dark:text-primary-dark hover:underline underline-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus rounded-sm"
          >
            Back to sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
