import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { toast } from 'react-hot-toast';
import { 
  DocumentTextIcon,
  AcademicCapIcon, 
  CalendarIcon, 
  UserIcon,
  TrashIcon,
  ArrowLeftIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

export default function DocumentDetail() {
  const { department, id } = useParams();
  const navigate = useNavigate();
  const { data, deleteDocument } = useData();
  const [confirmDelete, setConfirmDelete] = useState(false);
  
  // Find the document
  const findDocument = () => {
    if (department === 'OEC') {
      for (const subDept in data[department]) {
        if (data[department][subDept][id]) {
          return { 
            ...data[department][subDept][id], 
            id, 
            department, 
            subDepartment: subDept 
          };
        }
      }
      return null;
    }
    
    return data[department] && data[department][id] 
      ? { ...data[department][id], id, department } 
      : null;
  };
  
  const document = findDocument();
  
  if (!document) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <ExclamationCircleIcon className="h-16 w-16 text-red-400" />
        <h3 className="mt-4 text-lg font-medium text-gray-900">Document not found</h3>
        <p className="mt-2 text-sm text-gray-500">The document you're looking for doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-2" />
          Go Back
        </button>
      </div>
    );
  }
  
  const handleDelete = () => {
    deleteDocument(document.department, document.id, document.subDepartment);
    toast.success('Document deleted successfully');
    navigate(-1);
  };
  
  const handleOpenLink = () => {
    if (document.driveLink) {
      window.open(document.driveLink, '_blank', 'noopener,noreferrer');
    } else {
      toast.error('No link available for this document');
    }
  };
  
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Document Details
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            View and manage document information
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-1" />
            Back
          </button>
        </div>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Document name</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {document.documentName || 'Untitled'}
            </dd>
          </div>
          
          {document.department && (
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Department</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {document.department}
                {document.subDepartment && ` (${document.subDepartment})`}
              </dd>
            </div>
          )}
          
          {document.subject && (
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Subject</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {document.subject}
              </dd>
            </div>
          )}
          
          {document.category && (
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Category</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {document.category}
              </dd>
            </div>
          )}
          
          {document.academicYear && (
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Academic Year</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {document.academicYear}
              </dd>
            </div>
          )}
          
          {document.semester && (
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Semester</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {document.semester}
              </dd>
            </div>
          )}
          
          {document.publishedBy && (
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Published By</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {document.publishedBy}
              </dd>
            </div>
          )}
          
          {document.publishedDate && (
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Published Date</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {document.publishedDate}
              </dd>
            </div>
          )}
          
          {document.driveLink && (
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Drive Link</dt>
              <dd className="mt-1 text-sm text-blue-600 sm:mt-0 sm:col-span-2">
                <div className="flex items-center">
                  <a 
                    href={document.driveLink} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:underline break-all"
                  >
                    {document.driveLink}
                  </a>
                </div>
              </dd>
            </div>
          )}
        </dl>
      </div>
      
      {/* Action buttons */}
      <div className="px-4 py-5 sm:px-6 flex justify-end space-x-3">
        {document.driveLink && (
          <button
            onClick={handleOpenLink}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            Open Link
          </button>
        )}
        
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            <TrashIcon className="h-4 w-4 mr-2" />
            Delete
          </button>
        ) : (
          <div className="flex space-x-2">
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Confirm
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}