import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { humanizeText } from '../../lib/supabase';
import { toast } from 'react-toastify';

export default function HeroSection() {
  const { user } = useAuth();
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim()) {
      toast.error('Please enter some text to humanize');
      return;
    }
    
    if (!user) {
      toast.info('Please sign up or log in to humanize text');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const result = await humanizeText(inputText);
      
      if (result.success) {
        setOutputText(result.data || '');
        toast.success('Text humanized successfully!');
      } else {
        toast.error(result.error || 'Failed to humanize text');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Transform AI Text Into <span className="text-primary-600">Human-like Content</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Make your AI-generated content indistinguishable from human writing with our powerful humanizer tool.
          </p>
          
          {!user && (
            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/signup" className="btn btn-primary px-8 py-3 text-base">
                Get Started Free
              </Link>
              <Link to="/pricing" className="btn btn-outline px-8 py-3 text-base">
                View Pricing
              </Link>
            </div>
          )}
        </div>
        
        <div className="bg-white rounded-xl shadow-soft overflow-hidden border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Input section */}
            <div className="p-6 border-b md:border-b-0 md:border-r border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">AI-Generated Text</h2>
                <button
                  className="text-sm text-primary-600 hover:text-primary-700"
                  onClick={() => setInputText('')}
                  disabled={!inputText || isLoading}
                >
                  Clear
                </button>
              </div>
              <textarea
                className="w-full h-64 p-4 rounded-lg border border-gray-300 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none"
                placeholder="Paste your AI-generated text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={isLoading}
              ></textarea>
            </div>
            
            {/* Output section */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Humanized Text</h2>
                {outputText && (
                  <button
                    className="text-sm text-primary-600 hover:text-primary-700"
                    onClick={() => {
                      navigator.clipboard.writeText(outputText);
                      toast.success('Copied to clipboard');
                    }}
                  >
                    Copy
                  </button>
                )}
              </div>
              <textarea
                className="w-full h-64 p-4 rounded-lg border border-gray-300 bg-gray-50 resize-none"
                placeholder="Humanized text will appear here..."
                value={outputText}
                readOnly
              ></textarea>
            </div>
          </div>
          
          <div className="p-6 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-center">
              <div className="mb-4 sm:mb-0">
                {user ? (
                  <p className="text-sm text-gray-600">
                    You're ready to humanize text with your account.
                  </p>
                ) : (
                  <p className="text-sm text-gray-600">
                    <Link to="/signup" className="text-primary-600 hover:text-primary-700">
                      Sign up
                    </Link>{' '}
                    or{' '}
                    <Link to="/login" className="text-primary-600 hover:text-primary-700">
                      log in
                    </Link>{' '}
                    to humanize text and save your projects.
                  </p>
                )}
              </div>
              <button 
                className="btn btn-primary w-full sm:w-auto"
                onClick={handleSubmit}
                disabled={isLoading || !inputText.trim()}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Humanizing Text...
                  </span>
                ) : (
                  'Humanize Text'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}