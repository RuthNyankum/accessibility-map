export default function AccessibilityStatementPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-4">Accessibility Statement</h1>

      <p className="text-sm text-[var(--color-text-muted)] mb-8">
        Last Updated: July 2026
      </p>

      <p className="mb-8">
        Accessibility is at the heart of <strong>AbilityMap Ghana</strong>. Our
        mission is to make disability support information easy to discover and
        use for everyone, regardless of ability.
      </p>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>

        <p>
          AbilityMap Ghana is designed with accessibility as a core requirement
          rather than an afterthought.
        </p>

        <p className="mt-4">
          We aim to follow the principles of the Web Content Accessibility
          Guidelines (WCAG) 2.1 Level AA wherever practical.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Accessibility Features</h2>

        <p className="mb-4">Our platform includes:</p>

        <ul className="list-disc pl-6 space-y-2">
          <li>Keyboard-accessible navigation.</li>
          <li>Visible keyboard focus indicators.</li>
          <li>Semantic HTML structure.</li>
          <li>Screen reader-friendly content.</li>
          <li>Accessible forms with proper labels.</li>
          <li>High color contrast.</li>
          <li>Light and Dark Mode.</li>
          <li>Adjustable text size.</li>
          <li>Responsive layouts across devices.</li>
          <li>Read Aloud functionality.</li>
          <li>Reduced motion support where appropriate.</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Browser Support</h2>

        <p>
          AbilityMap Ghana is designed to work with modern browsers and commonly
          used assistive technologies to provide an inclusive experience for all
          users.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Continuous Improvement</h2>

        <p>
          Accessibility is an ongoing process. We regularly review and improve
          the platform to better serve people with disabilities and welcome
          feedback that helps us make AbilityMap Ghana more inclusive.
        </p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Need Assistance?</h2>

        <p>
          If you encounter an accessibility barrier while using AbilityMap
          Ghana, please contact us so we can investigate the issue and continue
          improving the experience for everyone.
        </p>
      </section>
    </main>
  );
}
