import { useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import Sidebar from '../components/Sidebar';

export default function OECDepartmentPage() {
  const navigate = useNavigate();
  const { data } = useData();
  
  // Get all departments inside OEC
  const oecDepartments = Object.keys(data.OEC || {});
  
  const handleDepartmentSelect = (subDept) => {
    navigate(`/department/OEC/${subDept}`);
  };
  
  return (
    <div className="w-full mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1">
          <Sidebar />
        </div>
        <div className="md:col-span-3">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            Open Elective Courses (OEC)
          </h1>
          <p className="text-gray-600 mb-6">
            Select a department to view OEC materials offered by that department:
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {oecDepartments.map(subDept => (
              <div
                key={subDept}
                onClick={() => handleDepartmentSelect(subDept)}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg text-gray-900">{subDept}</h3>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  View OEC resources offered by {subDept} department
                </p>
              </div>
            ))}
          </div>
          
          {oecDepartments.length === 0 && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md text-yellow-700">
              No OEC departments found. Please check back later for OEC resources.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}