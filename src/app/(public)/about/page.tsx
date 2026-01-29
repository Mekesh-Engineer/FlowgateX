export default function AboutPage() {
  return (
    <div className="min-h-screen py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">About FlowGateX</h1>
        <div className="prose prose-lg dark:prose-invert mx-auto">
          <p className="text-lg text-[var(--text-secondary)] text-center mb-12">
            Revolutionizing event management with IoT-powered smart access control
          </p>
          
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-[var(--text-secondary)]">
              FlowGateX is an enterprise-grade event management platform that combines 
              cutting-edge IoT technology with intuitive user experiences. We help 
              organizers create seamless, secure, and memorable events while providing 
              attendees with effortless access and engagement.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Key Features</h2>
            <div className="grid md:grid-cols-2 gap-6 mt-6">
              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-2">Smart Access Control</h3>
                <p className="text-[var(--text-muted)]">
                  IoT-powered gates with real-time monitoring and automated check-ins
                </p>
              </div>
              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-2">Crowd Analytics</h3>
                <p className="text-[var(--text-muted)]">
                  Live capacity tracking, heatmaps, and predictive crowd management
                </p>
              </div>
              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-2">Seamless Ticketing</h3>
                <p className="text-[var(--text-muted)]">
                  QR-based tickets with multi-tier pricing and promo code support
                </p>
              </div>
              <div className="card p-6">
                <h3 className="text-xl font-semibold mb-2">Revenue Management</h3>
                <p className="text-[var(--text-muted)]">
                  Comprehensive financial tracking with automated payouts
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
            <p className="text-[var(--text-secondary)]">
              Have questions? Reach out to our team at{' '}
              <a href="mailto:support@flowgatex.com" className="text-[var(--primary)] hover:underline">
                support@flowgatex.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
