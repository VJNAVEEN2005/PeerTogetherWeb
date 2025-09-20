import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LandingPage() {
  const { currentUser } = useAuth();
  
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Hero Section */}
      <div className="py-16 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-indigo-600">PeerTogether</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              A collaborative platform for students to share and access educational resources across departments. 
              Find lecture notes, assignments, past papers, and study materials shared by your peers.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/downloads/peer-together-app.zip"
                className="px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg shadow-md hover:bg-indigo-700 transition-colors flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download App
              </a>
            </div>
          </div>
          <div className="hidden md:block">
            <img 
              src="/assets/hero-image.png" 
              alt="PeerTogether App" 
              className="rounded-lg shadow-xl"
              onError={(e) => {
                e.target.src = "https://placehold.co/600x400?text=PeerTogether";
                e.target.onerror = null;
              }} 
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 border-t border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-12">Why Use PeerTogether?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-indigo-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Access Study Materials</h3>
            <p className="text-gray-600">
              Find comprehensive notes, assignments, and past papers shared by fellow students across various departments.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-indigo-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Collaborate with Peers</h3>
            <p className="text-gray-600">
              Connect with fellow students, share resources, and contribute to a growing knowledge base for your academic success.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="bg-indigo-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3">Easy Search & Browse</h3>
            <p className="text-gray-600">
              Find exactly what you need with our powerful search functionality and intuitive department-based organization.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 border-t border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="flex flex-col md:flex-row gap-8 justify-between">
          <div className="flex flex-col items-center text-center">
            <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-indigo-600">1</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Create an Account</h3>
            <p className="text-gray-600">
              Sign up using your institutional email to get started with PeerTogether.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-indigo-600">2</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Browse Resources</h3>
            <p className="text-gray-600">
              Navigate through departments and categories to find relevant study materials.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="bg-indigo-100 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-indigo-600">3</span>
            </div>
            <h3 className="text-xl font-semibold mb-3">Download & Share</h3>
            <p className="text-gray-600">
              Download resources for offline use and share your own materials with peers.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 border-t border-gray-200">
        <div className="bg-indigo-600 rounded-xl p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Get PeerTogether Now!</h2>
          <p className="text-indigo-100 mb-6 max-w-2xl mx-auto">
            Download the PeerTogether app today and access a wealth of educational resources
            shared by students like you - anywhere, anytime.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="/downloads/peer-together-app.zip"
              className="px-6 py-3 bg-white text-indigo-600 font-medium rounded-lg shadow-md hover:bg-indigo-50 transition-colors flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
              Download App
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-200">
        <div className="text-center text-gray-500">
          <p>© {new Date().getFullYear()} PeerTogether. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}