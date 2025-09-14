import { useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import DocumentList from '../components/DocumentList';
import Sidebar from '../components/Sidebar';

export default function DepartmentPage() {
  const { department, semester } = useParams();
  const { getDocumentsByDepartment } = useData();
  
  let documents = getDocumentsByDepartment(department);
  
  // Ensure auth fields are filtered out
  documents = documents.filter(doc => doc.id !== 'auth');
  
  // Filter by semester if provided
  const filteredDocuments = semester 
    ? documents.filter(doc => doc.semester === semester)
    : documents;
  
  return (
    <div className="w-full mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Sidebar />
        </div>
        <div className="md:col-span-3">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {department} Department
            {semester && ` - ${semester}`}
          </h1>
          <DocumentList documents={filteredDocuments} />
        </div>
      </div>
    </div>
  );
}