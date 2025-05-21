import { Link } from 'react-router-dom';

export default function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-primary-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to Transform Your AI-Generated Content?
        </h2>
        <p className="text-xl text-primary-100 max-w-3xl mx-auto mb-8">
          Join thousands of content creators, students, and professionals who use TextHuman to make their AI content undetectable.
        </p>
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
          <Link 
            to="/signup" 
            className="btn bg-white text-primary-700 hover:bg-primary-50 px-8 py-3 text-base font-medium shadow-md"
          >
            Get Started Free
          </Link>
          <Link 
            to="/pricing" 
            className="btn border-2 border-white text-white hover:bg-primary-700 px-8 py-3 text-base font-medium"
          >
            View Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}