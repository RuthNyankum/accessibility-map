import React from "react";
import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h1
        className="text-6xl font-bold"
        style={{ color: "var(--color-primary)" }}
      >
        404
      </h1>

      <p
        className="mt-4 text-lg"
        style={{ color: "var(--color-text-secondary)" }}
      >
        Oops! The page you're looking for doesn't exist.
      </p>

      <Link
        to="/"
        className="mt-6 px-6 py-2 rounded-lg transition hover:opacity-90"
        style={{
          backgroundColor: "var(--color-primary)",
          color: "var(--color-primary-fg)",
        }}
      >
        Go back home
      </Link>
    </div>
  );
}
