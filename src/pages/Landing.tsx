import { Link } from "react-router-dom";

export default function Landing() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-navy-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-navy-800 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <span className="text-xl font-bold text-navy-900">Applico</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/login" className="px-4 py-2 text-sm font-medium text-navy-700 hover:bg-navy-50 rounded-lg transition-colors">Sign In</Link>
            <Link to="/signup" className="px-4 py-2 text-sm font-medium text-white bg-navy-800 hover:bg-navy-700 rounded-lg transition-colors">Get Started</Link>
          </div>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-20 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-navy-900 leading-tight">
            Build your CV and land your dream job with AI
          </h1>
          <p className="mt-6 text-lg md:text-xl text-navy-600 leading-relaxed">
            Create ATS-friendly CVs, import from LinkedIn/GitHub, and get AI-powered job matches — all in one place.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="px-8 py-3 text-base font-medium text-white bg-navy-800 hover:bg-navy-700 rounded-lg transition-colors">
              Get Started →
            </Link>
            <Link to="/login" className="px-8 py-3 text-base font-medium text-navy-700 border border-navy-200 hover:bg-navy-50 rounded-lg transition-colors">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-navy-900 text-center mb-12">Everything you need to land your next job</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon="📝"
            title="AI-Powered CV Builder"
            description="Build a professional CV from scratch with guided sections, real-time preview, and ATS-friendly formatting."
          />
          <FeatureCard
            icon="🔗"
            title="Social Import"
            description="Import your experience from LinkedIn, GitHub, and other social profiles instantly. No manual entry needed."
          />
          <FeatureCard
            icon="🎯"
            title="Job Matcher"
            description="Get AI-driven job recommendations with match scores based on your CV profile and experience."
          />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-navy-900 text-center mb-12">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <StepCard step={1} title="Create your CV" description="Fill in your details or import from social profiles to build your professional CV." />
          <StepCard step={2} title="Get matched" description="AI analyzes your profile and finds jobs that match your skills and experience." />
          <StepCard step={3} title="Track applications" description="Manage your job search, track applications, and stay organized in one dashboard." />
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="bg-navy-800 rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white">Ready to land your dream job?</h2>
          <p className="mt-4 text-navy-200 text-lg">Join thousands of professionals using Applico to accelerate their job search.</p>
          <Link to="/signup" className="inline-block mt-8 px-8 py-3 text-base font-medium text-navy-900 bg-white hover:bg-navy-50 rounded-lg transition-colors">
            Get Started for Free
          </Link>
        </div>
      </section>

      <footer className="border-t border-navy-100">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-sm text-navy-500">
          © 2026 Applico. Built with ❤️
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="p-6 bg-navy-50 rounded-xl border border-navy-100">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-navy-900">{title}</h3>
      <p className="mt-2 text-sm text-navy-600 leading-relaxed">{description}</p>
    </div>
  );
}

function StepCard({ step, title, description }: { step: number; title: string; description: string }) {
  return (
    <div className="text-center">
      <div className="w-12 h-12 mx-auto bg-navy-800 text-white text-lg font-bold rounded-full flex items-center justify-center mb-4">
        {step}
      </div>
      <h3 className="text-lg font-semibold text-navy-900">{title}</h3>
      <p className="mt-2 text-sm text-navy-600 leading-relaxed">{description}</p>
    </div>
  );
}
