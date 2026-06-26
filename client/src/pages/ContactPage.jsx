import {
  FaEnvelope,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
} from "react-icons/fa";

export default function ContactPage() {
  return (
    <main className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="text-4xl font-bold mb-4">Contact Us</h1>

      <p className="text-sm text-[var(--color-text-muted)] mb-8">
        We'd love to hear from you. Whether you have feedback, need assistance,
        or would like to suggest a disability support service, we're here to
        help.
      </p>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Contact Information */}
        <section className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-border-dark)] bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <FaEnvelope
                className="mt-1 text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]"
                aria-hidden="true"
              />
              <div>
                <h3 className="font-semibold">Email</h3>
                <p className="text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-dark)]">
                  support@abilitymapghana.org
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FaPhoneAlt
                className="mt-1 text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]"
                aria-hidden="true"
              />
              <div>
                <h3 className="font-semibold">Phone</h3>
                <p className="text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-dark)]">
                  +233 XX XXX XXXX
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FaMapMarkerAlt
                className="mt-1 text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]"
                aria-hidden="true"
              />
              <div>
                <h3 className="font-semibold">Location</h3>
                <p className="text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-dark)]">
                  Accra, Ghana
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <FaClock
                className="mt-1 text-[var(--color-primary)] dark:text-[var(--color-primary-dark)]"
                aria-hidden="true"
              />
              <div>
                <h3 className="font-semibold">Availability</h3>
                <p className="text-[var(--color-text-secondary)] dark:text-[var(--color-text-secondary-dark)]">
                  Monday – Friday
                  <br />
                  9:00 AM – 5:00 PM (GMT)
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Contacting Us */}
        <section className="rounded-xl border border-[var(--color-border)] dark:border-[var(--color-border-dark)] bg-[var(--color-surface)] dark:bg-[var(--color-surface-dark)] p-6 shadow-sm">
          <h2 className="text-2xl font-semibold mb-6">How We Can Help</h2>

          <p className="mb-4">
            You can contact the AbilityMap Ghana team if you:
          </p>

          <ul className="list-disc pl-6 space-y-2 mb-6">
            <li>Need help using the platform.</li>
            <li>Want to report incorrect service information.</li>
            <li>Would like to recommend a new disability support service.</li>
            <li>Encounter an accessibility issue.</li>
            <li>Have suggestions for improving AbilityMap Ghana.</li>
          </ul>

          <div className="rounded-lg border border-[var(--color-success-border)] bg-[var(--color-success-bg)] dark:bg-[var(--color-success-bg-dark)] p-4">
            <p className="text-sm">
              <strong>Note:</strong> AbilityMap Ghana is currently an academic
              and portfolio project. Contact information shown on this page is
              for demonstration purposes and may be updated in future versions.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
