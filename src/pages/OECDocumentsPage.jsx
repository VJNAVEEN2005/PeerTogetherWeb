import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import DocumentList from '../components/DocumentList';
import Sidebar from '../components/Sidebar';

export default function OECDocumentsPage() {
  const { subDepartment } = useParams();
  const { data } = useData();
  const navigate = useNavigate();
  
  // Get documents for the selected OEC sub-department
  const getOECDocuments = () => {
    if (!data.OEC || !data.OEC[subDepartment]) return [];
    
    return Object.keys(data.OEC[subDepartment])
      .filter(docId => docId !== 'auth') // Explicitly filter out any auth field
      .map(docId => {
        // Create a new document object without any auth property
        const docData = { ...data.OEC[subDepartment][docId] };
        if (docData.auth) delete docData.auth;
        
        return {
          id: docId,
          department: 'OEC',
          subDepartment: subDepartment,
          ...docData
        };
      });
  };
  
  const documents = getOECDocuments();
  
  return (
    <div className="w-full mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Sidebar />
        </div>
        <div className="md:col-span-3">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <span 
              className="cursor-pointer hover:text-blue-600 transition-colors" 
              onClick={() => navigate('/department/OEC')}
            >
              OEC
            </span>
            <span>&gt;</span>
            <span className="font-medium text-gray-900">{subDepartment}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            OEC - {subDepartment} Department
          </h1>
          {documents.length > 0 ? (
            <DocumentList documents={documents} />
          ) : (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700">
              No OEC documents found for {subDepartment} department. Please check back later.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}