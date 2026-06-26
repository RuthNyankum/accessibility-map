export default function TermsOfUsePage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-4">Terms of Use</h1>

      <p className="text-sm text-[var(--color-text-muted)] mb-8">
        Last Updated: July 2026
      </p>

      <p className="mb-8">
        Welcome to <strong>AbilityMap Ghana</strong>. By using this platform,
        you agree to these Terms of Use.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          1. Purpose of the Platform
        </h2>

        <p>
          AbilityMap Ghana is designed to help individuals with disabilities,
          caregivers, families, and professionals discover disability support
          services throughout Ghana.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Acceptable Use</h2>

        <p className="mb-4">Users agree to:</p>

        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Use the platform responsibly.</li>
          <li>Provide accurate information when submitting services.</li>
          <li>Respect other users.</li>
          <li>Avoid misuse of the platform.</li>
        </ul>

        <p className="mb-4">Users must not:</p>

        <ul className="list-disc pl-6 space-y-2">
          <li>Submit false or misleading information.</li>
          <li>Upload harmful or malicious content.</li>
          <li>Attempt unauthorized access to the system.</li>
          <li>Interfere with the operation of the platform.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Service Information</h2>

        <p>
          Although we aim to keep service information accurate and up to date,
          AbilityMap Ghana cannot guarantee that every listing remains current.
        </p>

        <p className="mt-4">
          Users should verify important information directly with the listed
          service providers.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          4. Intellectual Property
        </h2>

        <p>
          Unless otherwise stated, the content, branding, design, and code of
          AbilityMap Ghana are the property of the project creators.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          5. Limitation of Liability
        </h2>

        <p>
          AbilityMap Ghana serves as an informational directory and is not
          responsible for decisions made based on information provided on the
          platform.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">6. Changes</h2>

        <p>
          These Terms of Use may be updated periodically as the platform
          develops. Continued use of the platform after changes have been made
          constitutes acceptance of the updated terms.
        </p>
      </section>
    </main>
  );
}
