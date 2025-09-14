import { useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import DocumentList from '../components/DocumentList';
import Sidebar from '../components/Sidebar';

export default function CategoryPage() {
  const { categoryName } = useParams();
  const { getAllDocuments } = useData();
  const allDocuments = getAllDocuments();
  
  // If category is "all documents", show all, otherwise filter by category
  const documents = categoryName.toLowerCase() === 'all documents'
    ? allDocuments
    : allDocuments.filter(doc => 
        doc.category && doc.category.toLowerCase() === categoryName.toLowerCase()
      );
  
  const decodedCategoryName = decodeURIComponent(categoryName);
  const displayName = decodedCategoryName.charAt(0).toUpperCase() + decodedCategoryName.slice(1);
  
  return (
    <div className="w-full mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Sidebar />
        </div>
        <div className="md:col-span-3">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            {displayName}
          </h1>
          <DocumentList documents={documents} />
        </div>
      </div>
    </div>
  );
}