import { Sparkles, Shield, Zap, BarChart } from 'lucide-react';

const features = [
  {
    title: 'Advanced AI Technology',
    description: 'Our state-of-the-art AI models have been trained on millions of human-written texts to ensure natural, fluent results.',
    icon: Sparkles,
    color: 'text-primary-600 bg-primary-100',
  },
  {
    title: 'Bypass AI Detectors',
    description: 'TextHuman consistently passes AI detectors like Turnitin, GPTZero, and Content at Scale by removing machine patterns.',
    icon: Shield,
    color: 'text-secondary-600 bg-secondary-100',
  },
  {
    title: 'Lightning Fast',
    description: 'Get your humanized text in seconds, not minutes. Our optimized algorithms work quickly without sacrificing quality.',
    icon: Zap,
    color: 'text-accent-600 bg-accent-100',
  },
  {
    title: 'Detailed Analytics',
    description: 'Track your humanization history and see how much you\'ve improved your content over time.',
    icon: BarChart,
    color: 'text-success-600 bg-success-100',
  },
];

export default function FeaturesSection() {
  return (
    <section id="features" className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose TextHuman?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our AI humanizer offers powerful features that make it the preferred choice for content creators, students, and professionals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card p-6 transition-transform duration-300 hover:-translate-y-1">
              <div className={`rounded-lg inline-block p-3 ${feature.color} mb-4`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}