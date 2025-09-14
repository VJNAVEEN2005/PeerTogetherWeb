import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import DocumentList from '../components/DocumentList';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function SearchPage() {
  const { getAllDocuments } = useData();
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    department: '',
    category: '',
    semester: '',
    academicYear: ''
  });
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [allDocuments, setAllDocuments] = useState([]);
  
  // Get all documents once
  useEffect(() => {
    const documents = getAllDocuments();
    setAllDocuments(documents);
  }, [getAllDocuments]);
  
  // Extract unique values for filters
  const departments = [...new Set(allDocuments.map(doc => doc.department))];
  const categories = [...new Set(allDocuments.map(doc => doc.category).filter(Boolean))];
  const semesters = [...new Set(allDocuments.map(doc => doc.semester).filter(Boolean))];
  const years = [...new Set(allDocuments.map(doc => doc.academicYear).filter(Boolean))];
  
  // Filter documents based on search query and filters
  useEffect(() => {
    const results = allDocuments.filter(doc => {
      // Match search query
      const matchesQuery = searchQuery === '' || 
        (doc.documentName && doc.documentName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (doc.subject && doc.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (doc.publishedBy && doc.publishedBy.toLowerCase().includes(searchQuery.toLowerCase()));
      
      // Match filters
      const matchesDepartment = filters.department === '' || doc.department === filters.department;
      const matchesCategory = filters.category === '' || doc.category === filters.category;
      const matchesSemester = filters.semester === '' || doc.semester === filters.semester;
      const matchesYear = filters.academicYear === '' || doc.academicYear === filters.academicYear;
      
      return matchesQuery && matchesDepartment && matchesCategory && matchesSemester && matchesYear;
    });
    
    setFilteredDocuments(results);
  }, [searchQuery, filters, allDocuments]);
  
  const handleFilterChange = (filterName, value) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [filterName]: value
    }));
  };
  
  const resetFilters = () => {
    setSearchQuery('');
    setFilters({
      department: '',
      category: '',
      semester: '',
      academicYear: ''
    });
  };
  
  return (
    <div className="w-full mx-auto py-8">
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Advanced Search</h1>
        
        {/* Search input */}
        <div className="mb-6">
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3"
              placeholder="Search for documents, subjects, or publishers..."
            />
          </div>
        </div>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div>
            <label htmlFor="department" className="block text-sm font-medium text-gray-700 mb-1">
              Department
            </label>
            <select
              id="department"
              value={filters.department}
              onChange={(e) => handleFilterChange('department', e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="semester" className="block text-sm font-medium text-gray-700 mb-1">
              Semester
            </label>
            <select
              id="semester"
              value={filters.semester}
              onChange={(e) => handleFilterChange('semester', e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All Semesters</option>
              {semesters.map(semester => (
                <option key={semester} value={semester}>{semester}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="academicYear" className="block text-sm font-medium text-gray-700 mb-1">
              Academic Year
            </label>
            <select
              id="academicYear"
              value={filters.academicYear}
              onChange={(e) => handleFilterChange('academicYear', e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">All Years</option>
              {years.map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Filter actions */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Reset Filters
          </button>
        </div>
      </div>
      
      {/* Results */}
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Search Results 
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({filteredDocuments.length} documents found)
          </span>
        </h2>
      </div>
      
      <DocumentList documents={filteredDocuments} showFilters={false} />
    </div>
  );
}