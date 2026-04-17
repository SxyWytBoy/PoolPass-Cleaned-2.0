import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const userType = user?.user_metadata?.user_type || 'guest';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-95 backdrop-blur-sm shadow-sm">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img
              src="/logo.png"
              alt="PoolPass Logo"
              className="h-16 md:h-20 w-auto"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/pools" className="text-gray-600 hover:text-pool-primary transition-colors">
              Find Pools
            </Link>
            <Link to="/how-it-works" className="text-gray-600 hover:text-pool-primary transition-colors">
              How It Works
            </Link>
            <Link to="/host" className="text-gray-600 hover:text-pool-primary transition-colors">
              Become a Host
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link to={userType === 'host' ? '/host-dashboard' : '/dashboard'}>
                  <Button variant="ghost" className="text-gray-700 hover:text-pool-primary">
                    Dashboard
                  </Button>
                </Link>
                <Button
                  onClick={handleSignOut}
                  className="bg-pool-primary hover:bg-pool-secondary text-white"
                >
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Link to="/sign-in">
                  <Button variant="ghost" className="text-gray-700 hover:text-pool-primary">
                    Sign In
                  </Button>
                </Link>
                <Link to="/sign-up">
                  <Button className="bg-pool-primary hover:bg-pool-secondary text-white">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="md:hidden rounded-md p-2 text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={cn("md:hidden", mobileMenuOpen ? "block" : "hidden")}>
          <div className="pt-2 pb-4 space-y-1">
            <Link to="/pools" className="block py-2 text-base text-gray-700 hover:text-pool-primary">
              Find Pools
            </Link>
            <Link to="/how-it-works" className="block py-2 text-base text-gray-700 hover:text-pool-primary">
              How It Works
            </Link>
            <Link to="/host" className="block py-2 text-base text-gray-700 hover:text-pool-primary">
              Become a Host
            </Link>
            <div className="pt-4 flex flex-col space-y-2">
              {user ? (
                <>
                  <Link to={userType === 'host' ? '/host-dashboard' : '/dashboard'}>
                    <Button variant="outline" className="w-full justify-center">
                      Dashboard
                    </Button>
                  </Link>
                  <Button
                    onClick={handleSignOut}
                    className="w-full justify-center bg-pool-primary hover:bg-pool-secondary"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link to="/sign-in">
                    <Button variant="outline" className="w-full justify-center">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/sign-up">
                    <Button className="w-full justify-center bg-pool-primary hover:bg-pool-secondary">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
