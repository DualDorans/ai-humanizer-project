import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, TextCursorInput, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabase';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  // Check if the current route matches
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and desktop navigation */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center" onClick={closeMenu}>
                <TextCursorInput className="h-8 w-8 text-primary-600" />
                <span className="ml-2 text-xl font-bold text-gray-900">TextHuman</span>
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link
                to="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/') 
                    ? 'border-primary-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Home
              </Link>
              <Link
                to="/pricing"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/pricing')
                    ? 'border-primary-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Pricing
              </Link>
              <Link
                to="/contact"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  isActive('/contact')
                    ? 'border-primary-500 text-gray-900' 
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                }`}
              >
                Contact
              </Link>
            </div>
          </div>
          
          {/* Desktop authentication */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {user ? (
              <div className="flex items-center space-x-4">
                <Link
                  to="/dashboard"
                  className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    isActive('/dashboard')
                      ? 'border-primary-500 text-gray-900' 
                      : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm text-gray-500 hover:text-gray-700"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="btn btn-ghost text-sm font-medium text-gray-500"
                >
                  Log in
                </Link>
                <Link to="/signup" className="btn btn-primary">
                  Sign up
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={toggleMenu}
            >
              <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div
        className={`sm:hidden ${isMenuOpen ? 'block' : 'hidden'}`}
        id="mobile-menu"
      >
        <div className="pt-2 pb-3 space-y-1">
          <Link
            to="/"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive('/')
                ? 'bg-primary-50 border-primary-500 text-primary-700' 
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            }`}
            onClick={closeMenu}
          >
            Home
          </Link>
          <Link
            to="/pricing"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive('/pricing')
                ? 'bg-primary-50 border-primary-500 text-primary-700' 
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            }`}
            onClick={closeMenu}
          >
            Pricing
          </Link>
          <Link
            to="/contact"
            className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
              isActive('/contact')
                ? 'bg-primary-50 border-primary-500 text-primary-700' 
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            }`}
            onClick={closeMenu}
          >
            Contact
          </Link>
          {user && (
            <Link
              to="/dashboard"
              className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                isActive('/dashboard')
                  ? 'bg-primary-50 border-primary-500 text-primary-700' 
                  : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
              }`}
              onClick={closeMenu}
            >
              Dashboard
            </Link>
          )}
        </div>
        
        {/* Mobile authentication */}
        <div className="pt-4 pb-3 border-t border-gray-200">
          {user ? (
            <div className="flex items-center px-4">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <User className="h-6 w-6 text-primary-600" />
                </div>
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">
                  {user.email?.split('@')[0]}
                </div>
                <div className="text-sm font-medium text-gray-500">{user.email}</div>
              </div>
              <button
                onClick={handleLogout}
                className="ml-auto flex-shrink-0 p-1 rounded-full text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Logout</span>
                <LogOut className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
          ) : (
            <div className="flex justify-center space-x-4 px-4">
              <Link
                to="/login"
                className="btn btn-outline w-full justify-center"
                onClick={closeMenu}
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="btn btn-primary w-full justify-center"
                onClick={closeMenu}
              >
                Sign up
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}