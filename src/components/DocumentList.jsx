import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { 
  DocumentTextIcon, 
  AcademicCapIcon, 
  CalendarIcon, 
  UserIcon, 
  TrashIcon
} from '@heroicons/react/24/outline';
import { toast } from 'react-hot-toast';

export default function DocumentList({ documents, showFilters = true }) {
  const { deleteDocument } = useData();
  const [filterText, setFilterText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  
  // Extract unique categories and years for filters
  const categories = [...new Set(documents.map(doc => doc.category).filter(Boolean))];
  const years = [...new Set(documents.map(doc => doc.academicYear).filter(Boolean))];
  
  const filteredDocuments = documents.filter(doc => {
    const matchesText = filterText === '' || 
      (doc.documentName && doc.documentName.toLowerCase().includes(filterText.toLowerCase())) ||
      (doc.subject && doc.subject.toLowerCase().includes(filterText.toLowerCase()));
    
    const matchesCategory = selectedCategory === '' || doc.category === selectedCategory;
    const matchesYear = selectedYear === '' || doc.academicYear === selectedYear;
    
    return matchesText && matchesCategory && matchesYear;
  });
  
  const handleDelete = (doc) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      deleteDocument(doc.department, doc.id, doc.subDepartment);
      toast.success('Document deleted successfully');
    }
  };
  
  const handleOpenLink = (link) => {
    window.open(link, '_blank', 'noopener,noreferrer');
  };
  
  if (!documents || documents.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex flex-col items-center justify-center py-12">
          <DocumentTextIcon className="h-16 w-16 text-gray-400" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">No documents found</h3>
          <p className="mt-2 text-sm text-gray-500">There are no documents available in this category yet.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
      {showFilters && (
        <div className="mb-6 space-y-4">
          <div>
            <label htmlFor="filterText" className="block text-sm font-medium text-gray-700">Search</label>
            <input
              type="text"
              id="filterText"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search by name or subject..."
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">All Categories</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700">Academic Year</label>
              <select
                id="year"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                <option value="">All Years</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
      
      <div className="mt-4">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Documents ({filteredDocuments.length})</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocuments.map((doc) => (
            <div 
              key={doc.id} 
              className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex justify-between">
                <div className="text-lg font-medium text-indigo-600 truncate" title={doc.documentName}>
                  {doc.documentName || "Untitled Document"}
                </div>
                <div className="flex space-x-1">
                  {doc.driveLink && (
                    <button
                      onClick={() => handleOpenLink(doc.driveLink)}
                      className="text-gray-500 hover:text-gray-700"
                      title="Open link"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(doc)}
                    className="text-red-500 hover:text-red-700"
                    title="Delete document"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="mt-4 flex flex-col space-y-2 text-sm">
                {doc.department && (
                  <div className="flex items-center text-gray-600">
                    <AcademicCapIcon className="h-4 w-4 mr-1" />
                    {doc.department} {doc.subDepartment ? `(${doc.subDepartment})` : ''}
                  </div>
                )}
                
                {doc.category && (
                  <div className="flex items-center text-gray-600">
                    <DocumentTextIcon className="h-4 w-4 mr-1" />
                    {doc.category}
                    {doc.subject && ` - ${doc.subject}`}
                  </div>
                )}
                
                {doc.semester && (
                  <div className="flex items-center text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {doc.semester}
                  </div>
                )}
                
                {doc.publishedBy && (
                  <div className="flex items-center text-gray-600">
                    <UserIcon className="h-4 w-4 mr-1" />
                    {doc.publishedBy}
                  </div>
                )}
                
                {doc.publishedDate && (
                  <div className="flex items-center text-gray-600">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {doc.publishedDate}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}