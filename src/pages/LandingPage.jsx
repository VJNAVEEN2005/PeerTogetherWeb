import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function LandingPage() {
  const { currentUser } = useAuth();
  
  // Create refs for animated elements
  const heroRef = useRef(null);
  const heroImageRef = useRef(null);
  const featuresRef = useRef(null);
  const featureCardsRef = useRef([]);
  const howItWorksRef = useRef(null);
  const stepsRef = useRef([]);
  const ctaRef = useRef(null);
  
  useEffect(() => {
    // Hero section animations
    gsap.fromTo(
      heroRef.current, 
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 1, ease: 'power3.out' }
    );
    
    gsap.fromTo(
      heroImageRef.current,
      { opacity: 0, x: 100 },
      { opacity: 1, x: 0, duration: 1.2, delay: 0.3, ease: 'power3.out' }
    );
    
    // Features section animations with ScrollTrigger
    gsap.fromTo(
      featuresRef.current,
      { opacity: 0, y: 50 },
      { 
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 80%',
        },
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        ease: 'power2.out' 
      }
    );
    
    // Animate feature cards
    featureCardsRef.current.forEach((card, index) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 50 },
        { 
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
          },
          opacity: 1, 
          y: 0, 
          duration: 0.7, 
          delay: index * 0.2, 
          ease: 'power2.out' 
        }
      );
    });
    
    // How It Works section animations
    gsap.fromTo(
      howItWorksRef.current,
      { opacity: 0, y: 50 },
      { 
        scrollTrigger: {
          trigger: howItWorksRef.current,
          start: 'top 80%',
        },
        opacity: 1, 
        y: 0, 
        duration: 0.8, 
        ease: 'power2.out' 
      }
    );
    
    // Animate steps
    stepsRef.current.forEach((step, index) => {
      gsap.fromTo(
        step,
        { opacity: 0, y: 30 },
        { 
          scrollTrigger: {
            trigger: step,
            start: 'top 85%',
          },
          opacity: 1, 
          y: 0, 
          duration: 0.7, 
          delay: index * 0.3, 
          ease: 'back.out(1.2)' 
        }
      );
    });
    
    // CTA section animation
    gsap.fromTo(
      ctaRef.current,
      { opacity: 0, scale: 0.95 },
      { 
        scrollTrigger: {
          trigger: ctaRef.current,
          start: 'top 85%',
        },
        opacity: 1, 
        scale: 1, 
        duration: 1, 
        ease: 'elastic.out(1, 0.5)' 
      }
    );
    
    // Cleanup function
    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  
  return (
    <div className="w-full max-w-6xl mx-auto px-4">
      {/* Hero Section */}
      <div className="py-20 md:py-28" ref={heroRef}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
                Welcome to <span className="text-indigo-600 relative inline-block">
                  PeerTogether
                  <span className="absolute bottom-0 left-0 w-full h-1 bg-indigo-400 transform -translate-y-1"></span>
                </span>
              </h1>
              <p className="text-xl text-gray-600 mt-6 leading-relaxed">
                A collaborative platform for students to share and access educational resources across departments. 
                Find lecture notes, assignments, past papers, and study materials shared by your peers.
              </p>
            </div>
            <div className="flex flex-wrap gap-6">
              <a
                href="/downloads/peer-together-app.zip"
                className="px-8 py-4 bg-indigo-600 text-white font-medium rounded-lg shadow-lg hover:bg-indigo-700 transition-all duration-300 flex items-center hover:shadow-xl hover:-translate-y-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download App
              </a>
              {/* <Link
                to="/login"
                className="px-8 py-4 bg-white border-2 border-indigo-600 text-indigo-600 font-medium rounded-lg shadow-md hover:bg-indigo-50 transition-all duration-300 flex items-center hover:-translate-y-1"
              >
                Get Started
              </Link> */}
            </div>
          </div>
          <div className="hidden md:block overflow-hidden" ref={heroImageRef}>
            <img 
              src="/assets/hero-image.png" 
              alt="PeerTogether App" 
              className="rounded-xl shadow-2xl transform hover:scale-105 transition-transform duration-700 object-cover w-full"
              onError={(e) => {
                e.target.src = "https://placehold.co/600x400?text=PeerTogether";
                e.target.onerror = null;
              }} 
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 border-t border-gray-200" ref={featuresRef}>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Why Use <span className="text-indigo-600">PeerTogether</span>?</h2>
          <div className="w-24 h-1 bg-indigo-600 mx-auto rounded-full"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div 
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2"
            ref={el => featureCardsRef.current[0] = el}
          >
            <div className="bg-indigo-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto transform transition-transform hover:rotate-6 hover:scale-110 duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-center">Access Study Materials</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Find comprehensive notes, assignments, and past papers shared by fellow students across various departments.
            </p>
          </div>
          <div 
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2"
            ref={el => featureCardsRef.current[1] = el}
          >
            <div className="bg-indigo-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto transform transition-transform hover:rotate-6 hover:scale-110 duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-center">Collaborate with Peers</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Connect with fellow students, share resources, and contribute to a growing knowledge base for your academic success.
            </p>
          </div>
          <div 
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:-translate-y-2"
            ref={el => featureCardsRef.current[2] = el}
          >
            <div className="bg-indigo-100 p-4 rounded-full w-16 h-16 flex items-center justify-center mb-6 mx-auto transform transition-transform hover:rotate-6 hover:scale-110 duration-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-semibold mb-4 text-center">Easy Search & Browse</h3>
            <p className="text-gray-600 text-center leading-relaxed">
              Find exactly what you need with our powerful search functionality and intuitive department-based organization.
            </p>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 border-t border-gray-200" ref={howItWorksRef}>
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">How It Works</h2>
          <div className="w-24 h-1 bg-indigo-600 mx-auto rounded-full"></div>
        </div>
        <div className="flex flex-col md:flex-row gap-12 justify-between max-w-4xl mx-auto relative">
          {/* Connecting line for desktop */}
          <div className="hidden md:block absolute h-1 bg-indigo-200 top-8 left-[15%] right-[15%] z-0"></div>
          
          <div 
            className="flex flex-col items-center text-center relative z-10"
            ref={el => stepsRef.current[0] = el}
          >
            <div className="bg-indigo-600 rounded-full w-20 h-20 flex items-center justify-center mb-6 shadow-lg hover:shadow-indigo-200 transition-all duration-500 hover:scale-110">
              <span className="text-3xl font-bold text-white">1</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4">Create an Account</h3>
            <p className="text-gray-600 max-w-xs leading-relaxed">
              Sign up using your institutional email to get started with PeerTogether in just seconds.
            </p>
          </div>
          
          <div 
            className="flex flex-col items-center text-center relative z-10"
            ref={el => stepsRef.current[1] = el}
          >
            <div className="bg-indigo-600 rounded-full w-20 h-20 flex items-center justify-center mb-6 shadow-lg hover:shadow-indigo-200 transition-all duration-500 hover:scale-110">
              <span className="text-3xl font-bold text-white">2</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4">Browse Resources</h3>
            <p className="text-gray-600 max-w-xs leading-relaxed">
              Navigate through departments and categories to find relevant study materials with our intuitive interface.
            </p>
          </div>
          
          <div 
            className="flex flex-col items-center text-center relative z-10"
            ref={el => stepsRef.current[2] = el}
          >
            <div className="bg-indigo-600 rounded-full w-20 h-20 flex items-center justify-center mb-6 shadow-lg hover:shadow-indigo-200 transition-all duration-500 hover:scale-110">
              <span className="text-3xl font-bold text-white">3</span>
            </div>
            <h3 className="text-2xl font-semibold mb-4">Download & Share</h3>
            <p className="text-gray-600 max-w-xs leading-relaxed">
              Download resources for offline use and share your own materials to help fellow students succeed.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-24 border-t border-gray-200" ref={ctaRef}>
        <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 rounded-3xl p-10 md:p-16 text-center shadow-2xl relative overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute w-64 h-64 rounded-full bg-indigo-500 opacity-20 -top-20 -left-20"></div>
            <div className="absolute w-40 h-40 rounded-full bg-indigo-400 opacity-10 bottom-10 right-10"></div>
            <div className="absolute w-20 h-20 rounded-full bg-white opacity-10 top-20 right-20"></div>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Get PeerTogether Now!</h2>
            <p className="text-indigo-100 mb-10 max-w-2xl mx-auto text-lg">
              Download the PeerTogether app today and access a wealth of educational resources
              shared by students like you - anywhere, anytime.
            </p>
            <div className="flex flex-wrap justify-center gap-6">
              <a
                href="/downloads/peer-together-app.zip"
                className="px-8 py-4 bg-white text-indigo-600 font-medium rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center text-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Download App
              </a>
              {/* <Link
                to="/login"
                className="px-8 py-4 bg-transparent border-2 border-white text-white font-medium rounded-lg hover:bg-white hover:text-indigo-600 transition-all duration-300 flex items-center text-lg hover:-translate-y-1"
              >
                Create Account
              </Link> */}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-200">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-indigo-600">PeerTogether</h3>
              <p className="text-gray-500 mt-2">Empowering students through collaboration</p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
              <a href="#" className="text-gray-500 hover:text-indigo-600 transition-colors">
                <span className="sr-only">Instagram</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
          <div className="border-t border-gray-200 pt-8 text-center text-gray-500">
            <p>© {new Date().getFullYear()} PeerTogether. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}