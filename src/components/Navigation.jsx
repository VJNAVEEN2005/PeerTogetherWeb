import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Navigation() {
  const { getDepartments } = useData();
  const { currentUser, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const departments = getDepartments();
  
  // Don't show navigation on landing page if user is not logged in
  const isLandingPage = location.pathname === '/';
  
  // This function will handle navigation to the home page with a force refresh
  const handleHomeNavigation = () => {
    if (currentUser) {
      // If user is logged in, go to the protected home
      if (location.pathname === '/search') {
        // We're coming from search page, use window.location for a full refresh
        window.location.href = '/home';
      } else {
        // Normal navigation for other routes
        navigate('/home');
      }
    } else {
      // If not logged in, go to the landing page
      navigate('/');
    }
  };

  const categories = [
    "All Documents",
    "Notes",
    "Assignments",
    "Question Papers",
    "CAT Question Papers"
  ];

  return (
    <header className="bg-indigo-600 shadow-lg">
      <nav className="mx-auto flex w-full items-center justify-between p-4 px-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <button onClick={handleHomeNavigation} className="-m-1.5 p-1.5">
            <span className="text-white text-xl font-bold">PeerTogether</span>
          </button>
        </div>
        
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white"
            onClick={() => setMobileMenuOpen(true)}
          >
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        
        <div className="hidden lg:flex lg:gap-x-12">
          {/* Navigation links can be added here if needed in the future */}
        </div>

        {/* Right side buttons */}
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <button 
            onClick={handleHomeNavigation}
            className="text-sm font-semibold leading-6 text-white hover:text-gray-200 mr-4"
          >
            Home
          </button>
          <button 
            onClick={() => navigate('/search')}
            className="text-sm font-semibold leading-6 text-white hover:text-gray-200 mr-4"
          >
            Search
          </button>
          
          {/* Auth related buttons */}
          {currentUser ? (
            <>
              <div className="flex items-center">
                {isAdmin && (
                  <button 
                    onClick={() => navigate('/admin')}
                    className="text-sm font-semibold leading-6 bg-purple-600 hover:bg-purple-700 px-3 py-1 rounded-md text-white mr-3"
                  >
                    Admin
                  </button>
                )}
                {/* <span className="text-white text-sm mr-2">
                  {currentUser.displayName}
                </span> */}
                <button 
                  onClick={() => {
                    logout();
                    navigate('/');
                  }}
                  className="text-sm font-semibold leading-6 bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md text-white"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <button 
              onClick={() => navigate('/login')}
              className="text-sm font-semibold leading-6 bg-green-500 hover:bg-green-600 px-3 py-1 rounded-md text-white"
            >
              Login
            </button>
          )}
        </div>
      </nav>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden" role="dialog" aria-modal="true">
          <div className="fixed inset-0 z-10"></div>
          <div className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto bg-indigo-600 px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
            <div className="flex items-center justify-between">
              <button onClick={() => {
                setMobileMenuOpen(false);
                handleHomeNavigation();
              }} className="-m-1.5 p-1.5">
                <span className="text-white text-xl font-bold">PeerTogether</span>
              </button>
              <button
                type="button"
                className="-m-2.5 rounded-md p-2.5 text-white"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" aria-hidden="true" />
              </button>
            </div>
            <div className="mt-6 flow-root">
              <div className="-my-6 divide-y divide-gray-500/10">
                <div className="space-y-2 py-6">
                  {/* Categories and Departments removed */}
                </div>
                <div className="py-6">
                  <button
                    className="block w-full text-left rounded-lg py-2 pl-3 pr-9 text-base font-semibold leading-7 text-white hover:bg-indigo-700"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      handleHomeNavigation();
                    }}
                  >
                    Home
                  </button>
                  <button
                    className="block w-full text-left rounded-lg py-2 pl-3 pr-9 text-base font-semibold leading-7 text-white hover:bg-indigo-700"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      navigate('/search');
                    }}
                  >
                    Search
                  </button>
                  
                  {/* Auth related buttons for mobile */}
                  {currentUser ? (
                    <>
                      <div className="border-t border-indigo-700 my-2 pt-2">
                        <div className="px-3 text-white mb-2">
                          Signed in as: {currentUser.displayName}
                        </div>
                        {isAdmin && (
                          <button
                            className="block w-full text-left rounded-lg py-2 pl-3 pr-9 text-base font-semibold leading-7 bg-purple-600 text-white hover:bg-purple-700 mb-2"
                            onClick={() => {
                              setMobileMenuOpen(false);
                              navigate('/admin');
                            }}
                          >
                            Admin Dashboard
                          </button>
                        )}
                        <button
                          className="block w-full text-left rounded-lg py-2 pl-3 pr-9 text-base font-semibold leading-7 bg-red-500 text-white hover:bg-red-600"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            logout();
                            navigate('/');
                          }}
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  ) : (
                    <button
                      className="block w-full text-left rounded-lg py-2 pl-3 pr-9 text-base font-semibold leading-7 bg-green-500 text-white hover:bg-green-600"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        navigate('/login');
                      }}
                    >
                      Login
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}