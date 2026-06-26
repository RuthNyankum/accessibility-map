export default function PrivacyPolicyPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>

      <p className="text-sm text-[var(--color-text-muted)] mb-8">
        Last Updated: July 2026
      </p>

      <p className="mb-6">
        At AbilityMap Ghana, we value your privacy and are committed to
        protecting any personal information you share with us. This Privacy
        Policy explains how information is collected, used, and protected when
        you use our platform.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          1. Information We Collect
        </h2>

        <p className="mb-4">
          AbilityMap Ghana may collect the following information when you
          interact with the platform:
        </p>

        <ul className="list-disc pl-6 space-y-2">
          <li>Name (when submitting a service)</li>
          <li>Email address (if provided)</li>
          <li>Phone number (for service listings)</li>
          <li>Service information submitted by users</li>
          <li>General usage data such as pages visited and search activity</li>
        </ul>

        <p className="mt-4">
          We do not intentionally collect sensitive personal information unless
          it is voluntarily provided.
        </p>
      </section>

      {/* Continue the other sections in the same pattern */}
    </main>
  );
}
