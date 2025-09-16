import { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { db } from '../firebase/config';
import { ref, update } from 'firebase/database';
import { generateHash } from '../utils/hashUtils';
import { PlusIcon, TrashIcon, ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import DebugInfo from '../components/DebugInfo';
import DeleteConfirmationDialog from '../components/DeleteConfirmationDialog';

function AdminPage() {
  const { isAdmin, currentUser } = useAuth();
  const { 
    getAllDocuments, 
    deleteDocument, 
    data,
    isAuthenticated,
    authAttempted,
    getSubjectDepartments, 
    getSubjectCategories, 
    addSubject,
    deleteSubject,
    addSubjectCategory,
    deleteSubjectCategory,
    addSubjectDepartment,
    deleteSubjectDepartment
  } = useData();
  

  
  // Document management state
  const [filterDepartment, setFilterDepartment] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  
  // Subjects management state
  const [activeTab, setActiveTab] = useState('documents'); // documents, subjects
  const [expandedDepts, setExpandedDepts] = useState({});
  const [expandedCategories, setExpandedCategories] = useState({});
  
  // Delete confirmation state
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteType, setDeleteType] = useState(null); // 'subject', 'category', 'department'
  const [itemToDelete, setItemToDelete] = useState(null);
  const [newDeptName, setNewDeptName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [newSubjectKey, setNewSubjectKey] = useState('');
  const [newSubjectValue, setNewSubjectValue] = useState('');
  const [addingDept, setAddingDept] = useState(false);
  const [addingCategory, setAddingCategory] = useState(false);
  const [addingSubject, setAddingSubject] = useState(false);
  const [keyUpdateTrigger, setKeyUpdateTrigger] = useState(0); // Trigger for key updates
  
  // Display authentication status message
  useEffect(() => {
    if (!isAuthenticated && !authAttempted) {
      toast.loading('Authenticating with Firebase...', { id: 'auth-toast' });
    } else if (isAuthenticated) {
      toast.success('Firebase authentication successful', { id: 'auth-toast' });
    } else if (authAttempted && !isAuthenticated) {
      toast.error('Firebase authentication failed. Changes will not be saved.', { id: 'auth-toast', duration: 5000 });
    }
  }, [isAuthenticated, authAttempted]);
  
  // Calculate the next available subject key
  const calculateNextSubjectKey = () => {
    if (selectedDept && selectedCategory && data.Subjects?.[selectedDept]?.[selectedCategory]) {
      // Get existing subject keys and find the highest number
      const existingKeys = Object.keys(data.Subjects[selectedDept][selectedCategory]);
      let highestNum = 0;
      
      existingKeys.forEach(key => {
        // Extract numbers from keys like "SUB-1", "SUB-2", etc.
        const match = key.match(/\d+$/);
        if (match) {
          const num = parseInt(match[0], 10);
          if (num > highestNum) {
            highestNum = num;
          }
        }
      });
      
      // Return the next number
      return `SUB-${highestNum + 1}`;
    } else {
      // Default to SUB-1 if no existing subjects or category is not selected
      return 'SUB-1';
    }
  };
  
  // Auto-generate subject key when needed
  useEffect(() => {
    const nextKey = calculateNextSubjectKey();
    setNewSubjectKey(nextKey);
  }, [selectedDept, selectedCategory, keyUpdateTrigger]);
  
  // Get all documents and filter if necessary
  const documents = getAllDocuments().filter(doc => 
    !filterDepartment || doc.department === filterDepartment
  );
  
  // Get unique departments for filter
  const departments = [...new Set(getAllDocuments().map(doc => doc.department))];
  
  // Subject departments 
  const subjectDepartments = getSubjectDepartments();
  
  // Handle toggling department expansion
  const toggleDeptExpansion = (dept) => {
    setExpandedDepts(prev => ({
      ...prev,
      [dept]: !prev[dept]
    }));
  };
  
  // Handle toggling category expansion
  const toggleCategoryExpansion = (dept, category) => {
    const key = `${dept}-${category}`;
    setExpandedCategories(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  // Handle adding new department
  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!newDeptName.trim()) {
      toast.error('Department name cannot be empty');
      return;
    }
    
    const loadingToast = toast.loading('Adding department...', { id: 'add-dept-toast' });
    
    try {
      setAddingDept(true);
      
      // Add the department
      await addSubjectDepartment(newDeptName);
      
      toast.success(`Department "${newDeptName}" added successfully`, { id: 'add-dept-toast' });
      setNewDeptName('');
      
      // Manually update the local state to include the new department
      // This approach avoids a full page reload
      if (!data.Subjects) {
        data.Subjects = {};
      }
      
      // Create the new department in our local data
      if (!data.Subjects[newDeptName]) {
        data.Subjects[newDeptName] = {};
      }
      
      // Expand the new department to make it visible
      setExpandedDepts(prev => ({
        ...prev,
        [newDeptName]: true
      }));
      
    } catch (error) {
      console.error('Error adding department:', error);
      toast.error(`Failed to add department: ${error.message}`, { id: 'add-dept-toast' });
    } finally {
      setAddingDept(false);
    }
  };
  
  // Handle adding new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!selectedDept) {
      toast.error('Please select a department first');
      return;
    }
    
    if (!newCategoryName || !newCategoryName.trim()) {
      toast.error('Please select or enter a category name');
      return;
    }
    
    const loadingToast = toast.loading('Adding category...', { id: 'add-category-toast' });
    
    try {
      setAddingCategory(true);
      await addSubjectCategory(selectedDept, newCategoryName);
      toast.success(`Category "${newCategoryName}" added successfully to ${selectedDept}`, { id: 'add-category-toast' });
      setNewCategoryName('');
      
      // Expand the department to show the new category
      setExpandedDepts(prev => ({
        ...prev,
        [selectedDept]: true
      }));
      
      // Manually update the local state to include the new category
      // This approach avoids a full page reload
      if (!data.Subjects) {
        data.Subjects = {};
      }
      
      if (!data.Subjects[selectedDept]) {
        data.Subjects[selectedDept] = {};
      }
      
      // Create the new category in our local data
      if (!data.Subjects[selectedDept][newCategoryName]) {
        data.Subjects[selectedDept][newCategoryName] = {};
      }
      
      // Expand the new category to make it visible
      const key = `${selectedDept}-${newCategoryName}`;
      setExpandedCategories(prev => ({
        ...prev,
        [key]: true
      }));
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error(`Failed to add category: ${error.message}`, { id: 'add-category-toast' });
    } finally {
      setAddingCategory(false);
    }
  };
  
  // Handle adding new subject
  const handleAddSubject = async (e) => {
    e.preventDefault();
    if (!selectedDept || !selectedCategory) {
      toast.error('Please select both a department and category');
      return;
    }
    
    if (!newSubjectKey.trim() || !newSubjectValue.trim()) {
      toast.error('Subject key and value cannot be empty');
      return;
    }
    
    const loadingToast = toast.loading('Adding subject...', { id: 'add-subject-toast' });
    
    try {
      setAddingSubject(true);
      await addSubject(selectedDept, selectedCategory, newSubjectKey, newSubjectValue);
      toast.success(`Subject added successfully`, { id: 'add-subject-toast' });
      
      // Reset the subject value
      setNewSubjectValue('');
      
      // Trigger the recalculation of the next subject key
      // This will cause the useEffect to run again with updated data
      setKeyUpdateTrigger(prev => prev + 1);
      
      // Expand the category to show the new subject
      const key = `${selectedDept}-${selectedCategory}`;
      setExpandedCategories(prev => ({
        ...prev,
        [key]: true
      }));
      
      // Manually update the local state to include the new subject
      // This approach avoids a full page reload
      if (!data.Subjects) {
        data.Subjects = {};
      }
      
      if (!data.Subjects[selectedDept]) {
        data.Subjects[selectedDept] = {};
      }
      
      if (!data.Subjects[selectedDept][selectedCategory]) {
        data.Subjects[selectedDept][selectedCategory] = {};
      }
      
      // Create a new reference to ensure React detects the change
      const updatedSubjects = {
        ...data.Subjects,
        [selectedDept]: {
          ...data.Subjects[selectedDept],
          [selectedCategory]: {
            ...data.Subjects[selectedDept][selectedCategory],
            [newSubjectKey]: newSubjectValue
          }
        }
      };
      
      // Update the data object with the new reference
      data.Subjects = updatedSubjects;
    } catch (error) {
      console.error('Error adding subject:', error);
      toast.error(`Failed to add subject: ${error.message}`, { id: 'add-subject-toast' });
    } finally {
      setAddingSubject(false);
    }
  };
  
  // Prepare subject deletion
  const handleDeleteSubjectClick = (dept, category, subjectKey) => {
    setDeleteType('subject');
    setItemToDelete({ dept, category, subjectKey });
    setConfirmDelete(true);
  };
  
  // Handle deleting a subject (after confirmation)
  const handleDeleteSubject = async () => {
    if (!itemToDelete) return;
    
    const { dept, category, subjectKey } = itemToDelete;
    try {
      await deleteSubject(dept, category, subjectKey);
      toast.success('Subject deleted successfully');
      setConfirmDelete(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting subject:', error);
      toast.error(`Failed to delete subject: ${error.message}`);
    }
  };
  
  // Prepare category deletion
  const handleDeleteCategoryClick = (dept, category) => {
    setDeleteType('category');
    setItemToDelete({ dept, category });
    setConfirmDelete(true);
  };
  
  // Handle deleting a category (after confirmation)
  const handleDeleteCategory = async () => {
    if (!itemToDelete) return;
    
    const { dept, category } = itemToDelete;
    try {
      await deleteSubjectCategory(dept, category);
      toast.success('Category deleted successfully');
      setConfirmDelete(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(`Failed to delete category: ${error.message}`);
    }
  };
  
  // Prepare department deletion
  const handleDeleteDepartmentClick = (dept) => {
    setDeleteType('department');
    setItemToDelete({ dept });
    setConfirmDelete(true);
  };
  
  // Handle deleting a department (after confirmation)
  const handleDeleteDepartment = async () => {
    if (!itemToDelete) return;
    
    const { dept } = itemToDelete;
    try {
      await deleteSubjectDepartment(dept);
      toast.success('Department deleted successfully');
      setConfirmDelete(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Error deleting department:', error);
      toast.error(`Failed to delete department: ${error.message}`);
    }
  };
  
  // Handle document deletion
  const handleDelete = (doc) => {
    if (window.confirm(`Are you sure you want to delete "${doc.title || doc.documentName}"?`)) {
      if (doc.department === 'OEC' && doc.subDepartment) {
        deleteDocument(doc.department, doc.id, doc.subDepartment);
      } else {
        deleteDocument(doc.department, doc.id);
      }
      toast.success('Document deleted successfully');
    }
  };
  
  // Handle password change
  const handleChangePassword = async (e) => {
    e.preventDefault();
    
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    try {
      setChangingPassword(true);
      
      // Generate new hash
      const newHash = await generateHash(newPassword);
      
      // Update in Firebase
      const adminRef = ref(db, 'auth');
      await update(adminRef, { admin: newHash });
      
      // Reset form
      setNewPassword('');
      setConfirmPassword('');
      
      toast.success('Admin password updated successfully');
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error('Failed to update password');
    } finally {
      setChangingPassword(false);
    }
  };
  
  // If not admin, show access denied
  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-10">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4">
          <p className="font-bold">Access Denied</p>
          <p>You must be an administrator to view this page.</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-4">
      {/* Admin Dashboard Header */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="text-sm text-gray-600">
            Logged in as: <span className="font-semibold">{currentUser?.displayName}</span>
          </div>
        </div>
        
        {/* Admin Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-blue-700">Total Documents</h3>
            <p className="text-2xl">{getAllDocuments().length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-green-700">Departments</h3>
            <p className="text-2xl">{departments.length}</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg shadow-sm">
            <h3 className="font-semibold text-purple-700">Latest Update</h3>
            <p className="text-sm">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
        
        {/* Admin Password Change Section */}
        {/* <div className="border-t pt-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Change Admin Password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
                minLength={6}
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            
            <div>
              <button
                type="submit"
                disabled={changingPassword}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-400"
              >
                {changingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div> */}
        
        {/* Content Tabs */}
        <div className="mb-6 border-t pt-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('documents')}
                className={`${
                  activeTab === 'documents'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
              >
                Documents
              </button>
              <button
                onClick={() => setActiveTab('subjects')}
                className={`${
                  activeTab === 'subjects'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm`}
              >
                Subjects
              </button>
            </nav>
          </div>
          
          {/* Document Management Tab */}
          {activeTab === 'documents' && (
            <div className="pt-4">
              <h2 className="text-xl font-semibold mb-4">Document Management</h2>
              
              {/* Filter */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Department</label>
                <select 
                  value={filterDepartment} 
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  className="mt-1 block w-full md:w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="">All Departments</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              {/* Documents Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Title
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Author
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Semester
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {documents.map((doc) => (
                      <tr key={`${doc.department}-${doc.id}`} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{doc.documentName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {doc.department}
                            {doc.subDepartment && ` / ${doc.subDepartment}`}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{doc.publishedBy || 'Unknown'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{doc.semester || 'N/A'}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => handleDelete(doc)} 
                            className="text-red-600 hover:text-red-900 mr-4"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {documents.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No documents found
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Subject Management Tab */}
          {activeTab === 'subjects' && (
            <div className="pt-4">
              <h2 className="text-xl font-semibold mb-4">Subject Management</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Subject Tree */}
                <div className="lg:col-span-2">
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <h3 className="font-medium text-gray-700 mb-2">Subject Structure</h3>
                    <div className="overflow-auto max-h-[500px]">
                      {subjectDepartments.length > 0 ? (
                        <ul className="space-y-2">
                          {subjectDepartments.map(dept => (
                            <li key={dept} className="border border-gray-200 rounded bg-white">
                              <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-gray-50" 
                                   onClick={() => toggleDeptExpansion(dept)}>
                                <div className="flex items-center">
                                  {expandedDepts[dept] ? (
                                    <ChevronDownIcon className="w-5 h-5 text-gray-500 mr-2" />
                                  ) : (
                                    <ChevronRightIcon className="w-5 h-5 text-gray-500 mr-2" />
                                  )}
                                  <span className="font-medium">{dept}</span>
                                </div>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteDepartmentClick(dept);
                                  }}
                                  className="text-red-500 hover:text-red-700"
                                  title="Delete department"
                                >
                                  <TrashIcon className="w-4 h-4" />
                                </button>
                              </div>
                              
                              {expandedDepts[dept] && data.Subjects?.[dept] && (
                                <ul className="pl-8 pr-3 pb-3">
                                  {Object.keys(data.Subjects[dept]).map(category => (
                                    <li key={`${dept}-${category}`} className="mt-2 border border-gray-100 rounded bg-gray-50">
                                      <div 
                                        className="flex items-center justify-between p-2 cursor-pointer hover:bg-gray-100"
                                        onClick={() => toggleCategoryExpansion(dept, category)}
                                      >
                                        <div className="flex items-center">
                                          {expandedCategories[`${dept}-${category}`] ? (
                                            <ChevronDownIcon className="w-4 h-4 text-gray-500 mr-1" />
                                          ) : (
                                            <ChevronRightIcon className="w-4 h-4 text-gray-500 mr-1" />
                                          )}
                                          <span>{category}</span>
                                        </div>
                                        <button 
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteCategoryClick(dept, category);
                                          }}
                                          className="text-red-500 hover:text-red-700"
                                          title="Delete category"
                                        >
                                          <TrashIcon className="w-4 h-4" />
                                        </button>
                                      </div>
                                      
                                      {expandedCategories[`${dept}-${category}`] && data.Subjects?.[dept]?.[category] && (
                                        <ul className="pl-6 pr-2 pb-2">
                                          {Object.keys(data.Subjects[dept][category]).map(subjectKey => (
                                            <li key={`${dept}-${category}-${subjectKey}`} className="mt-1 flex items-center justify-between text-sm p-1 hover:bg-gray-100 rounded">
                                              <div>
                                                <strong>{subjectKey}:</strong> {data.Subjects[dept][category][subjectKey]}
                                              </div>
                                              <button 
                                                onClick={() => handleDeleteSubjectClick(dept, category, subjectKey)}
                                                className="text-red-500 hover:text-red-700"
                                                title="Delete subject"
                                              >
                                                <TrashIcon className="w-3 h-3" />
                                              </button>
                                            </li>
                                          ))}
                                        </ul>
                                      )}
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-center py-4 text-gray-500">
                          No subjects data found
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Add Forms */}
                <div className="lg:col-span-1">
                  {/* Add Department Form */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                    <h3 className="font-medium text-gray-800 mb-3">Add Department</h3>
                    <form onSubmit={handleAddDepartment} className="space-y-3">
                      <div>
                        <label htmlFor="newDeptName" className="block text-sm font-medium text-gray-700">
                          Department Name
                        </label>
                        <input
                          type="text"
                          id="newDeptName"
                          value={newDeptName}
                          onChange={(e) => setNewDeptName(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={addingDept}
                        className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 w-full"
                      >
                        {addingDept ? 'Adding...' : (
                          <>
                            <PlusIcon className="w-4 h-4 mr-1" />
                            Add Department
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                  
                  {/* Add Category Form */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200 mb-4">
                    <h3 className="font-medium text-gray-800 mb-3">Add Category/Semester</h3>
                    <form onSubmit={handleAddCategory} className="space-y-3">
                      <div>
                        <label htmlFor="selectedDept" className="block text-sm font-medium text-gray-700">
                          Department
                        </label>
                        <select
                          id="selectedDept"
                          value={selectedDept}
                          onChange={(e) => setSelectedDept(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                          required
                        >
                          <option value="">Select Department</option>
                          {subjectDepartments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="newCategoryName" className="block text-sm font-medium text-gray-700">
                          Category/Semester Name
                        </label>
                        <select
                          id="newCategoryName"
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                          required
                        >
                          <option value="">Select Category/Semester</option>
                          <option value="SEM-I">SEM-I</option>
                          <option value="SEM-II">SEM-II</option>
                          <option value="SEM-III">SEM-III</option>
                          <option value="SEM-IV">SEM-IV</option>
                          <option value="SEM-V">SEM-V</option>
                          <option value="SEM-VI">SEM-VI</option>
                          <option value="SEM-VII">SEM-VII</option>
                          <option value="PEC">PEC</option>
                          <option value="OEC">OEC</option>
                        </select>
                        {newCategoryName === "Other" && (
                          <input
                            type="text"
                            placeholder="Enter custom category name"
                            className="mt-2 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                            onChange={(e) => setNewCategoryName(e.target.value)}
                          />
                        )}
                      </div>
                      <button
                        type="submit"
                        disabled={addingCategory}
                        className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 w-full"
                      >
                        {addingCategory ? 'Adding...' : (
                          <>
                            <PlusIcon className="w-4 h-4 mr-1" />
                            Add Category
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                  
                  {/* Add Subject Form */}
                  <div className="bg-white rounded-lg p-4 border border-gray-200">
                    <h3 className="font-medium text-gray-800 mb-3">Add Subject</h3>
                    <form onSubmit={handleAddSubject} className="space-y-3">
                      <div>
                        <label htmlFor="selectedDeptForSubject" className="block text-sm font-medium text-gray-700">
                          Department
                        </label>
                        <select
                          id="selectedDeptForSubject"
                          value={selectedDept}
                          onChange={(e) => {
                            setSelectedDept(e.target.value);
                            setSelectedCategory(''); // Reset category when department changes
                          }}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                          required
                        >
                          <option value="">Select Department</option>
                          {subjectDepartments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>
                      
                      {selectedDept && (
                        <div>
                          <label htmlFor="selectedCategory" className="block text-sm font-medium text-gray-700">
                            Category/Semester
                          </label>
                          <select
                            id="selectedCategory"
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                            required
                          >
                            <option value="">Select Category</option>
                            {data.Subjects?.[selectedDept] && 
                              Object.keys(data.Subjects[selectedDept]).map(category => (
                                <option key={category} value={category}>{category}</option>
                              ))
                            }
                          </select>
                        </div>
                      )}
                      
                      <div>
                        <label htmlFor="newSubjectKey" className="block text-sm font-medium text-gray-700">
                          Subject Key (Auto-generated)
                        </label>
                        <input
                          type="text"
                          id="newSubjectKey"
                          value={newSubjectKey}
                          readOnly
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-50 text-gray-600 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm cursor-not-allowed"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="newSubjectValue" className="block text-sm font-medium text-gray-700">
                          Subject Name
                        </label>
                        <input
                          type="text"
                          id="newSubjectValue"
                          value={newSubjectValue}
                          onChange={(e) => setNewSubjectValue(e.target.value)}
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                          required
                        />
                      </div>
                      
                      <button
                        type="submit"
                        disabled={addingSubject || !selectedDept || !selectedCategory}
                        className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-400 w-full"
                      >
                        {addingSubject ? 'Adding...' : (
                          <>
                            <PlusIcon className="w-4 h-4 mr-1" />
                            Add Subject
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <DebugInfo />
      
      {/* Delete Confirmation Dialog */}
      <DeleteConfirmationDialog
        isOpen={confirmDelete}
        onClose={() => {
          setConfirmDelete(false);
          setItemToDelete(null);
        }}
        onConfirm={() => {
          if (deleteType === 'subject') {
            handleDeleteSubject();
          } else if (deleteType === 'category') {
            handleDeleteCategory();
          } else if (deleteType === 'department') {
            handleDeleteDepartment();
          }
        }}
        title={`Delete ${deleteType ? deleteType.charAt(0).toUpperCase() + deleteType.slice(1) : 'Item'}`}
        message={
          deleteType === 'subject' && itemToDelete 
            ? `Are you sure you want to delete subject "${itemToDelete.subjectKey}" from ${itemToDelete.dept} > ${itemToDelete.category}?`
            : deleteType === 'category' && itemToDelete
              ? `Are you sure you want to delete category "${itemToDelete.category}" from ${itemToDelete.dept}? This will delete all subjects within it.`
              : deleteType === 'department' && itemToDelete
                ? `Are you sure you want to delete department "${itemToDelete.dept}"? This will delete all categories and subjects within it.`
                : "Are you sure you want to delete this item?"
        }
        confirmText="Delete"
        cancelText="Cancel"
      />
    </div>
  );
}

export default AdminPage;