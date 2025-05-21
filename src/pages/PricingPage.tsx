import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const plans = [
  {
    id: 'basic',
    name: 'Basic',
    price: 9.99,
    credits: 10000,
    pricePerCredit: 0.001,
    description: 'Perfect for occasional use and small projects.',
    features: [
      '10,000 words',
      'Basic humanization',
      'Web dashboard access',
      'Email support',
      '7-day history',
    ],
    popular: false,
    color: 'border-gray-200',
    buttonClass: 'btn-outline hover:bg-primary-50 hover:text-primary-700 hover:border-primary-300',
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 24.99,
    credits: 50000,
    pricePerCredit: 0.0005,
    description: 'Best for regular content creators and students.',
    features: [
      '50,000 words',
      'Advanced humanization',
      'Priority processing',
      'Priority support',
      '30-day history',
      'Downloadable reports',
    ],
    popular: true,
    color: 'border-primary-500',
    buttonClass: 'btn-primary',
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 99.99,
    credits: 250000,
    pricePerCredit: 0.0004,
    description: 'Ideal for businesses and high-volume users.',
    features: [
      '250,000 words',
      'Premium humanization',
      'Highest priority processing',
      '24/7 priority support',
      'Unlimited history',
      'Advanced analytics',
      'API access',
    ],
    popular: false,
    color: 'border-gray-200',
    buttonClass: 'btn-outline hover:bg-primary-50 hover:text-primary-700 hover:border-primary-300',
  },
];

export default function PricingPage() {
  const { user } = useAuth();
  const [yearlyBilling, setYearlyBilling] = useState(false);
  
  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
  }, []);

  const yearlyDiscount = 0.2; // 20% discount for yearly billing

  return (
    <div className="bg-gray-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Choose the plan that's right for you. All plans include unlimited access to our AI humanizer tool.
          </p>
          
          <div className="flex items-center justify-center mb-8">
            <span className={`text-sm ${!yearlyBilling ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
              Monthly
            </span>
            <button
              type="button"
              className="relative inline-flex mx-4 h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent bg-gray-200 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              role="switch"
              aria-checked={yearlyBilling}
              onClick={() => setYearlyBilling(!yearlyBilling)}
            >
              <span className="sr-only">Toggle yearly billing</span>
              <span
                aria-hidden="true"
                className={`${
                  yearlyBilling ? 'translate-x-5' : 'translate-x-0'
                } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
              ></span>
            </button>
            <span className={`text-sm flex items-center ${yearlyBilling ? 'font-semibold text-gray-900' : 'text-gray-500'}`}>
              Yearly
              <span className="ml-2 bg-success-100 text-success-800 text-xs font-medium px-2.5 py-0.5 rounded">
                Save 20%
              </span>
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => {
            const finalPrice = yearlyBilling
              ? (plan.price * 12 * (1 - yearlyDiscount)).toFixed(2)
              : plan.price.toFixed(2);
            
            return (
              <div
                key={plan.id}
                className={`card relative overflow-hidden border-2 ${plan.color} transition-all duration-300 hover:shadow-lg ${
                  plan.popular ? 'md:-mt-4 md:mb-4' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-primary-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                    MOST POPULAR
                  </div>
                )}
                <div className="p-6 md:p-8">
                  <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  <p className="mt-2 text-gray-600">{plan.description}</p>
                  <div className="mt-6 mb-8">
                    <div className="flex items-end">
                      <span className="text-4xl font-bold text-gray-900">${finalPrice}</span>
                      <span className="ml-1 text-gray-500">
                        {yearlyBilling ? '/year' : '/month'}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {plan.credits.toLocaleString()} words (${plan.pricePerCredit.toFixed(4)}/word)
                    </p>
                  </div>
                  <div className="mb-8">
                    <Link
                      to={user ? `/checkout/${plan.id}` : '/signup'}
                      className={`btn w-full justify-center ${plan.buttonClass}`}
                    >
                      {user ? 'Select Plan' : 'Sign Up & Select'}
                    </Link>
                  </div>
                  <ul className="space-y-4">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle2 className="h-5 w-5 text-success-500 flex-shrink-0 mr-2" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
        
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Need a custom plan?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-6">
            For enterprise customers or those with specific needs, we offer custom plans tailored to your requirements.
          </p>
          <Link to="/contact" className="btn btn-outline hover:bg-primary-50 hover:text-primary-700 hover:border-primary-300">
            Contact Sales
          </Link>
        </div>
      </div>
    </div>
  );
}