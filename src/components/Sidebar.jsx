import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate, useLocation } from 'react-router-dom';
import { useData } from '../context/DataContext';

export default function Sidebar() {
  const { getDepartments } = useData();
  const departments = getDepartments();
  const { department: currentDepartment, semester: urlSemester } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedSemester, setSelectedSemester] = useState('');
  
  const categories = [
    "All Documents",
    "Notes",
    "Assignments", 
    "Question Papers",
    "CAT Question Papers"
  ];
  
  const semesters = [
    "SEM I", "SEM II", "SEM III", "SEM IV", 
    "SEM V", "SEM VI", "SEM VII", "SEM VIII"
  ];
  
  // Set the selected semester based on URL params whenever they change
  useEffect(() => {
    if (urlSemester) {
      setSelectedSemester(urlSemester);
    } else {
      // Reset selection when navigating away from a semester page
      setSelectedSemester('');
    }
  }, [urlSemester, location.pathname]);
  
  const handleSemesterChange = (e) => {
    const semester = e.target.value;
    setSelectedSemester(semester);
    
    if (semester === '') {
      // If they select "Select Semester" (empty value), navigate to department page without semester
      if (currentDepartment) {
        navigate(`/department/${currentDepartment}`);
      }
    } else if (currentDepartment) {
      // If we're on a department page, filter by semester
      navigate(`/department/${currentDepartment}/semester/${semester}`);
    } else {
      // If we're not on a department page, show a message or handle appropriately
      alert("Please select a department first to filter by semester.");
      setSelectedSemester(''); // Reset the selection
    }
  };
  
  return (
    <div className="bg-white p-6 shadow-md rounded-lg">
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">Departments</h2>
        <ul className="space-y-2">
          {departments.map(department => (
            <li key={department}>
              <Link
                to={`/department/${department}`}
                className={`block px-3 py-2 rounded-md ${
                  currentDepartment === department 
                    ? 'bg-indigo-100 text-indigo-700 font-medium' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {department}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">Categories</h2>
        <ul className="space-y-2">
          {categories.map(category => (
            <li key={category}>
              <Link
                to={`/category/${encodeURIComponent(category.toLowerCase())}`}
                className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
              >
                {category}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mb-6">
        <h2 className="text-lg font-semibold mb-3 text-gray-800">Filter by Semester</h2>
        <select
          value={selectedSemester}
          onChange={handleSemesterChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Select Semester</option>
          {semesters.map(semester => (
            <option key={semester} value={semester}>
              {semester}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}