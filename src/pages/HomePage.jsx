import { useData } from '../context/DataContext';
import { Link } from 'react-router-dom';
import DocumentList from '../components/DocumentList';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorDisplay from '../components/ErrorDisplay';

export default function HomePage() {
  const { getAllDocuments, getDepartments, loading, error } = useData();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (error) {
    return <ErrorDisplay message={error} />;
  }
  
  const allDocuments = getAllDocuments();
  const departments = getDepartments();
  
  // Get recent documents (last 6)
  const recentDocuments = [...allDocuments]
    .sort((a, b) => {
      // Sort by published date if available
      if (a.publishedDate && b.publishedDate) {
        return new Date(b.publishedDate) - new Date(a.publishedDate);
      }
      return 0;
    })
    .slice(0, 6);
  
  return (
    <div className="w-full mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Sidebar />
        </div>
        
        <div className="md:col-span-3">
          {/* Hero section */}
          <div className="bg-indigo-700 rounded-lg shadow-lg p-8 mb-8 text-white">
            <h1 className="text-3xl font-bold mb-4">Welcome to PeerTogether</h1>
            <p className="mb-6 text-indigo-100">
              Access educational resources shared by your peers across different departments.
              Find notes, assignments, question papers, and more.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/search"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Search Resources
              </Link>
              <Link
                to="/category/all%20documents"
                className="inline-flex items-center px-4 py-2 border border-white text-sm font-medium rounded-md shadow-sm text-white hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Browse All Documents
              </Link>
            </div>
          </div>
          
          {/* Recent documents section */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Recent Uploads</h2>
              <Link
                to="/category/all%20documents"
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                View all
              </Link>
            </div>
            <DocumentList documents={recentDocuments} showFilters={false} />
          </div>
          
          {/* Departments section */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Browse by Department</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {departments.map(department => (
                <Link
                  key={department}
                  to={`/department/${department}`}
                  className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 flex items-center justify-between"
                >
                  <div>
                    <h3 className="font-medium text-gray-900">{department}</h3>
                    <p className="text-sm text-gray-500">
                      Browse resources
                    </p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}