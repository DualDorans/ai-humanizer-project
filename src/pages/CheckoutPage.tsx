import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../contexts/AuthContext';
import { CreditCard, Shield, ArrowLeft } from 'lucide-react';

const plans = {
  basic: {
    name: 'Basic',
    price: 9.99,
    credits: 10000,
  },
  pro: {
    name: 'Pro',
    price: 24.99,
    credits: 50000,
  },
  premium: {
    name: 'Premium',
    price: 99.99,
    credits: 250000,
  },
};

export default function CheckoutPage() {
  const { planId } = useParams<{ planId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Scroll to top on component mount
    window.scrollTo(0, 0);
    
    // Redirect if user is not logged in
    if (!user) {
      toast.error('Please log in to purchase credits');
      navigate('/login');
    }
    
    // Redirect if invalid plan ID
    if (planId && !['basic', 'pro', 'premium'].includes(planId)) {
      toast.error('Invalid plan selected');
      navigate('/pricing');
    }
  }, [user, planId, navigate]);

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format expiry date as MM/YY
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    
    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    
    return v;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!cardNumber || !cardName || !expiryDate || !cvc) {
      toast.error('Please fill in all payment details');
      return;
    }
    
    if (cardNumber.replace(/\s+/g, '').length !== 16) {
      toast.error('Please enter a valid 16-digit card number');
      return;
    }
    
    if (expiryDate.length !== 5) {
      toast.error('Please enter a valid expiry date (MM/YY)');
      return;
    }
    
    if (cvc.length !== 3) {
      toast.error('Please enter a valid 3-digit CVC');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast.success(`Successfully purchased ${plans[planId as keyof typeof plans].name} plan!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // If there's no valid plan ID, we shouldn't render the component
  if (!planId || !plans[planId as keyof typeof plans]) {
    return null;
  }

  const plan = plans[planId as keyof typeof plans];

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/pricing" className="inline-flex items-center text-primary-600 mb-8">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Pricing
        </Link>
        
        <div className="card overflow-hidden">
          <div className="bg-primary-600 text-white px-6 py-4">
            <h1 className="text-2xl font-bold">Complete Your Purchase</h1>
            <p className="text-primary-100">You're purchasing the {plan.name} plan</p>
          </div>
          
          <div className="p-6 md:p-8">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
              {/* Order Summary */}
              <div className="md:col-span-2 order-2 md:order-1">
                <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Summary</h2>
                  
                  <div className="border-t border-gray-200 pt-4 pb-2">
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-600">{plan.name} Plan</span>
                      <span className="text-gray-900 font-medium">${plan.price.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between mb-4">
                      <span className="text-gray-600">Words included</span>
                      <span className="text-gray-900 font-medium">{plan.credits.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 pb-2">
                    <div className="flex justify-between text-lg font-semibold">
                      <span className="text-gray-900">Total</span>
                      <span className="text-gray-900">${plan.price.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center mb-4">
                      <Shield className="h-5 w-5 text-success-600 mr-2" />
                      <span className="text-sm text-gray-600">Secure payment processing</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      By completing this purchase, you agree to our{' '}
                      <a href="#" className="text-primary-600 hover:text-primary-500">
                        Terms of Service
                      </a>{' '}
                      and{' '}
                      <a href="#" className="text-primary-600 hover:text-primary-500">
                        Privacy Policy
                      </a>
                      .
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Payment form */}
              <div className="md:col-span-3 order-1 md:order-2">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Information</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="card-number" className="block text-sm font-medium text-gray-700 mb-1">
                        Card Number
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="card-number"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                          className="input pl-10"
                          placeholder="XXXX XXXX XXXX XXXX"
                          maxLength={19}
                          required
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <CreditCard className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="card-name" className="block text-sm font-medium text-gray-700 mb-1">
                        Name on Card
                      </label>
                      <input
                        type="text"
                        id="card-name"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        className="input"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="expiry-date" className="block text-sm font-medium text-gray-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          id="expiry-date"
                          value={expiryDate}
                          onChange={(e) => setExpiryDate(formatExpiryDate(e.target.value))}
                          className="input"
                          placeholder="MM/YY"
                          maxLength={5}
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="cvc" className="block text-sm font-medium text-gray-700 mb-1">
                          CVC
                        </label>
                        <input
                          type="text"
                          id="cvc"
                          value={cvc}
                          onChange={(e) => setCvc(e.target.value.replace(/[^0-9]/g, ''))}
                          className="input"
                          placeholder="XXX"
                          maxLength={3}
                          required
                        />
                      </div>
                    </div>
                    
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="btn btn-primary w-full justify-center py-3"
                    >
                      {isLoading ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        `Complete Purchase - $${plan.price.toFixed(2)}`
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}