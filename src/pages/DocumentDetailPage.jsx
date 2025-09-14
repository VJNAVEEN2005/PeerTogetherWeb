import { useParams } from 'react-router-dom';
import DocumentDetail from '../components/DocumentDetail';
import Sidebar from '../components/Sidebar';

export default function DocumentDetailPage() {
  return (
    <div className="w-full mx-auto py-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Sidebar />
        </div>
        <div className="md:col-span-3">
          <DocumentDetail />
        </div>
      </div>
    </div>
  );
}