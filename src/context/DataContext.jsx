import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { ref, onValue, push, set, remove, update, get } from 'firebase/database';

const DataContext = createContext();

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // We're no longer using authentication, so we'll set these to true by default
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [authAttempted, setAuthAttempted] = useState(true);
  
  // We're skipping authentication and relying on database rules instead
  useEffect(() => {
    console.log("Firebase authentication bypassed - using direct database access");
    
    // Mark as authenticated for the UI to work properly
    setAuthAttempted(true);
    setIsAuthenticated(true);
  }, []);

  useEffect(() => {
    // Connect to Firebase and listen for data changes
    const dbRef = ref(db);
    
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const firebaseData = snapshot.val();
      if (firebaseData) {
        // Filter out auth fields from the data before setting to state
        const sanitizedData = { ...firebaseData };
        
        // Remove any 'auth' field from departments
        Object.keys(sanitizedData).forEach(key => {
          if (key !== 'auth' && sanitizedData[key] && typeof sanitizedData[key] === 'object' && sanitizedData[key].auth) {
            delete sanitizedData[key].auth;
          }
        });
        
        // Remove top-level auth object entirely
        if (sanitizedData.auth) {
          delete sanitizedData.auth;
        }
        
        // Make sure the Subjects object exists
        if (!sanitizedData.Subjects) {
          console.log('Creating empty Subjects object in data');
          sanitizedData.Subjects = {};
          
          // Also make sure it exists in the database
          const subjectsRef = ref(db, 'Subjects');
          set(subjectsRef, {})
            .then(() => console.log('Subjects node created in database'))
            .catch(err => console.error('Error creating Subjects node:', err));
        }
        
        setData(sanitizedData);
        setError(null);
        
        // Log the structure for debugging
        console.log('Database structure keys:', Object.keys(sanitizedData));
        if (sanitizedData.Subjects) {
          console.log('Subjects keys:', Object.keys(sanitizedData.Subjects));
        }
      } else {
        console.log('No data found in Firebase, creating initial structure');
        // Initialize with empty structure
        setData({
          Subjects: {}
        });
        setError(null);
      }
      setLoading(false);
    }, (error) => {
      console.error("Firebase data fetch error:", error);
      setError(`Failed to connect to Firebase: ${error.message}`);
      setLoading(false);
    });
    
    // Clean up the listener when component unmounts
    return () => unsubscribe();
  }, []);

  // Get all departments (CSE, ECE, etc.)
  const getDepartments = () => {
    if (!data) return [];
    const departments = Object.keys(data).filter(key => key !== 'Subjects');
    return departments;
  };
  
  // Get all OEC departments
  const getOECDepartments = () => {
    if (!data || !data.OEC) return [];
    return Object.keys(data.OEC);
  };

  // Get documents by department
  const getDocumentsByDepartment = (department) => {
    if (!data[department]) return [];
    
    // Special handling for OEC which has a nested structure
    if (department === 'OEC') {
      const result = [];
      // Flatten OEC structure
      Object.keys(data[department]).forEach(subDept => {
        if (subDept !== 'auth') { // Skip auth field at the department level
          Object.keys(data[department][subDept]).forEach(docId => {
            if (docId !== 'auth') { // Skip auth field at the document level
              const doc = { ...data[department][subDept][docId] };
              if (doc.auth) delete doc.auth; // Remove any auth property within document
              
              result.push({
                id: docId,
                department,
                subDepartment: subDept,
                ...doc
              });
            }
          });
        }
      });
      return result;
    }
    
    // Handle normal department structure
    return Object.keys(data[department])
      .filter(docId => docId !== 'auth') // Filter out auth fields
      .map(docId => {
        const doc = { ...data[department][docId] };
        if (doc.auth) delete doc.auth; // Remove auth property if it exists
        
        return {
          id: docId,
          department,
          ...doc
        };
      });
  };

  // Get all documents across departments
  const getAllDocuments = () => {
    const departments = getDepartments();
    let allDocs = [];
    
    departments.forEach(dept => {
      const deptDocs = getDocumentsByDepartment(dept);
      allDocs = [...allDocs, ...deptDocs];
    });
    
    return allDocs;
  };

  // Delete a document by its ID and department
  const deleteDocument = (department, docId, subDepartment = null) => {
    return new Promise((resolve, reject) => {
      // Check if authenticated
      if (!isAuthenticated) {
        reject(new Error('Not authenticated. Please wait for authentication to complete.'));
        return;
      }
      
      let pathRef;
      
      if (department === 'OEC' && subDepartment) {
        pathRef = ref(db, `${department}/${subDepartment}/${docId}`);
      } else {
        pathRef = ref(db, `${department}/${docId}`);
      }
      
      remove(pathRef)
        .then(() => {
          console.log(`Document successfully deleted: ${department}/${subDepartment || ''}/${docId}`);
          resolve({ success: true });
        })
        .catch((error) => {
          console.error('Error removing document: ', error);
          reject(error);
        });
    });
  };

  // Get subject list by department and semester
  const getSubjects = (department, semester) => {
    if (!data.Subjects?.[department]?.[semester]) return [];
    return data.Subjects[department][semester];
  };
  
  // Get all departments in Subjects
  const getSubjectDepartments = () => {
    if (!data.Subjects) return [];
    return Object.keys(data.Subjects);
  };
  
  // Get all categories/semesters for a department in Subjects
  const getSubjectCategories = (department) => {
    if (!data.Subjects?.[department]) return [];
    return Object.keys(data.Subjects[department]);
  };
  
  // Add a new subject to a department/category/semester
  const addSubject = (department, category, subjectKey, subjectValue) => {
    return new Promise((resolve, reject) => {
      // Check if Subjects exists
      const subjectsRef = ref(db, 'Subjects');
      
      get(subjectsRef)
        .then((snapshot) => {
          if (!snapshot.exists()) {
            return set(subjectsRef, {});
          }
          return Promise.resolve();
        })
        .then(() => {
          // Check if department exists
          const deptRef = ref(db, `Subjects/${department}`);
          return get(deptRef);
        })
        .then((snapshot) => {
          if (!snapshot.exists()) {
            return set(ref(db, `Subjects/${department}`), {});
          }
          return Promise.resolve();
        })
        .then(() => {
          // Check if category exists
          const categoryRef = ref(db, `Subjects/${department}/${category}`);
          return get(categoryRef);
        })
        .then((snapshot) => {
          if (!snapshot.exists()) {
            return set(ref(db, `Subjects/${department}/${category}`), {});
          }
          return Promise.resolve();
        })
        .then(() => {
          // Now we can safely add the subject
          const pathRef = ref(db, `Subjects/${department}/${category}/${subjectKey}`);
          return set(pathRef, subjectValue);
        })
        .then(() => {
          resolve({ key: subjectKey, value: subjectValue });
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  
  // Delete a subject
  const deleteSubject = (department, category, subjectKey) => {
    return new Promise((resolve, reject) => {
      const pathRef = ref(db, `Subjects/${department}/${category}/${subjectKey}`);
      
      remove(pathRef)
        .then(() => {
          console.log(`Subject deleted successfully: ${department}/${category}/${subjectKey}`);
          resolve({ success: true });
        })
        .catch((error) => {
          console.error('Error removing subject: ', error);
          reject(error);
        });
    });
  };
  
  // Add a new category (semester/course type) to a department
  const addSubjectCategory = (department, categoryName) => {
    return new Promise((resolve, reject) => {
      // First ensure Subjects exists
      const subjectsRef = ref(db, 'Subjects');
      
      get(subjectsRef)
        .then((snapshot) => {
          if (!snapshot.exists()) {
            return set(subjectsRef, {});
          }
          return Promise.resolve();
        })
        .then(() => {
          // Check if department exists
          const deptRef = ref(db, `Subjects/${department}`);
          return get(deptRef);
        })
        .then((snapshot) => {
          if (!snapshot.exists()) {
            return set(ref(db, `Subjects/${department}`), {});
          }
          return Promise.resolve();
        })
        .then(() => {
          // Now we can safely add the category
          const pathRef = ref(db, `Subjects/${department}/${categoryName}`);
          return set(pathRef, {});
        })
        .then(() => {
          resolve({ department, category: categoryName });
        })
        .catch((error) => {
          reject(error);
        });
    });
  };
  
  // Delete a category (semester/course type)
  const deleteSubjectCategory = (department, categoryName) => {
    return new Promise((resolve, reject) => {
      const pathRef = ref(db, `Subjects/${department}/${categoryName}`);
      
      remove(pathRef)
        .then(() => {
          console.log(`Category deleted successfully: ${department}/${categoryName}`);
          resolve({ success: true });
        })
        .catch((error) => {
          console.error('Error removing category: ', error);
          reject(error);
        });
    });
  };
  
  // Add a new department to Subjects
  const addSubjectDepartment = (departmentName) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!departmentName || departmentName.includes('/') || departmentName.includes('.')) {
          reject(new Error('Invalid department name. Cannot contain slashes or periods.'));
          return;
        }
        
        // First, ensure the Subjects node exists
        const subjectsRef = ref(db, 'Subjects');
        const subjectsSnapshot = await get(subjectsRef);
        
        if (!subjectsSnapshot.exists()) {
          // Create the Subjects node if it doesn't exist
          await set(subjectsRef, {});
          console.log('Created Subjects node in database');
        }
        
        // Create the department with a placeholder property to ensure it's recognized
        const pathRef = ref(db, `Subjects/${departmentName}`);
        await set(pathRef, { _created: new Date().toISOString() });
        
        // Verify the write succeeded by reading back the data
        const verifyRef = ref(db, `Subjects/${departmentName}`);
        const snapshot = await get(verifyRef);
        
        if (snapshot.exists()) {
          resolve({ department: departmentName });
        } else {
          reject(new Error('Department was not found after writing. The write may have failed.'));
        }
      } catch (error) {
        // More specific error messages based on Firebase error codes
        if (error.code === 'PERMISSION_DENIED') {
          reject(new Error('Permission denied. The database rules might be restricting write access.'));
        } else if (error.code === 'NETWORK_ERROR') {
          reject(new Error('Network error. Please check your internet connection.'));
        } else {
          reject(error);
        }
      }
    });
  };
  
  // Delete a department from Subjects
  const deleteSubjectDepartment = (departmentName) => {
    return new Promise((resolve, reject) => {
      // Check if authenticated
      if (!isAuthenticated) {
        reject(new Error('Not authenticated. Please wait for authentication to complete.'));
        return;
      }
      
      const pathRef = ref(db, `Subjects/${departmentName}`);
      
      remove(pathRef)
        .then(() => {
          console.log(`Department deleted successfully: ${departmentName}`);
          resolve({ success: true });
        })
        .catch((error) => {
          console.error('Error removing department: ', error);
          reject(error);
        });
    });
  };

  // Add a new document
  const addDocument = (department, documentData, subDepartment = null) => {
    return new Promise((resolve, reject) => {
      let pathRef;
      
      if (department === 'OEC' && subDepartment) {
        pathRef = ref(db, `${department}/${subDepartment}`);
      } else {
        pathRef = ref(db, department);
      }
      
      // Generate a new key for the document
      const newDocRef = push(pathRef);
      
      // Set the data at the new key
      set(newDocRef, documentData)
        .then(() => {
          console.log(`Document added successfully: ${newDocRef.key}`);
          resolve({ id: newDocRef.key, ...documentData });
        })
        .catch((error) => {
          console.error('Error adding document: ', error);
          reject(error);
        });
    });
  };
  
  // Update an existing document
  const updateDocument = (department, docId, documentData, subDepartment = null) => {
    return new Promise((resolve, reject) => {
      let pathRef;
      
      if (department === 'OEC' && subDepartment) {
        pathRef = ref(db, `${department}/${subDepartment}/${docId}`);
      } else {
        pathRef = ref(db, `${department}/${docId}`);
      }
      
      update(pathRef, documentData)
        .then(() => {
          console.log(`Document updated successfully: ${department}/${subDepartment || ''}/${docId}`);
          resolve({ id: docId, ...documentData });
        })
        .catch((error) => {
          console.error('Error updating document: ', error);
          reject(error);
        });
    });
  };

  const value = {
    data,
    loading,
    error,
    isAuthenticated,
    authAttempted,
    getDepartments,
    getOECDepartments,
    getDocumentsByDepartment,
    getAllDocuments,
    deleteDocument,
    addDocument,
    updateDocument,
    getSubjects,
    getSubjectDepartments,
    getSubjectCategories,
    addSubject,
    deleteSubject,
    addSubjectCategory,
    deleteSubjectCategory,
    addSubjectDepartment,
    deleteSubjectDepartment
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}