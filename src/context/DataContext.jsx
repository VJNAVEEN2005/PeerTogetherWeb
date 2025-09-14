import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { ref, onValue, push, set, remove, update } from 'firebase/database';

const DataContext = createContext();

export function useData() {
  return useContext(DataContext);
}

export function DataProvider({ children }) {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authAttempted, setAuthAttempted] = useState(false);
  
  // Initialize Firebase Auth
  useEffect(() => {
    const auth = getAuth();
    
    // Set up auth state listener
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setAuthAttempted(true);
      if (user) {
        console.log("Firebase auth state: User authenticated", user.uid);
        setIsAuthenticated(true);
      } else {
        console.log("Firebase auth state: No user authenticated");
        setIsAuthenticated(false);
        
        // Try to sign in anonymously if not authenticated
        signInAnonymously(auth)
          .then((userCredential) => {
            console.log("Firebase anonymous auth successful", userCredential.user.uid);
          })
          .catch((error) => {
            console.error("Firebase auth error:", error);
            setError(`Authentication failed: ${error.message}`);
          });
      }
    });
    
    // Clean up the listener
    return () => unsubscribe();
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
        
        setData(sanitizedData);
        setError(null);
      } else {
        setError("No data available from Firebase database.");
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
      // Check if authenticated
      if (!isAuthenticated) {
        reject(new Error('Not authenticated. Please wait for authentication to complete.'));
        return;
      }
      
      // Ensure path exists
      if (!data.Subjects?.[department]?.[category]) {
        reject(new Error(`Path Subjects/${department}/${category} does not exist`));
        return;
      }
      
      const pathRef = ref(db, `Subjects/${department}/${category}/${subjectKey}`);
      
      set(pathRef, subjectValue)
        .then(() => {
          console.log(`Subject added successfully: ${department}/${category}/${subjectKey}`);
          resolve({ key: subjectKey, value: subjectValue });
        })
        .catch((error) => {
          console.error('Error adding subject: ', error);
          reject(error);
        });
    });
  };
  
  // Delete a subject
  const deleteSubject = (department, category, subjectKey) => {
    return new Promise((resolve, reject) => {
      // Check if authenticated
      if (!isAuthenticated) {
        reject(new Error('Not authenticated. Please wait for authentication to complete.'));
        return;
      }
      
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
      // Check if authenticated
      if (!isAuthenticated) {
        reject(new Error('Not authenticated. Please wait for authentication to complete.'));
        return;
      }
      
      if (!data.Subjects?.[department]) {
        reject(new Error(`Department ${department} does not exist in Subjects`));
        return;
      }
      
      const pathRef = ref(db, `Subjects/${department}/${categoryName}`);
      
      set(pathRef, {})
        .then(() => {
          console.log(`Category added successfully: ${department}/${categoryName}`);
          resolve({ department, category: categoryName });
        })
        .catch((error) => {
          console.error('Error adding category: ', error);
          reject(error);
        });
    });
  };
  
  // Delete a category (semester/course type)
  const deleteSubjectCategory = (department, categoryName) => {
    return new Promise((resolve, reject) => {
      // Check if authenticated
      if (!isAuthenticated) {
        reject(new Error('Not authenticated. Please wait for authentication to complete.'));
        return;
      }
      
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
    return new Promise((resolve, reject) => {
      // If auth hasn't been attempted yet, wait for it
      if (!authAttempted) {
        const checkAuth = () => {
          if (authAttempted) {
            clearInterval(authCheckInterval);
            if (isAuthenticated) {
              addDepartment();
            } else {
              reject(new Error('Authentication failed. Please check your Firebase credentials.'));
            }
          }
        };
        
        const authCheckInterval = setInterval(checkAuth, 500);
        
        // Set a timeout to avoid waiting forever
        setTimeout(() => {
          clearInterval(authCheckInterval);
          reject(new Error('Authentication timed out. Please refresh and try again.'));
        }, 10000);
        
        return;
      }
      
      // Check if authenticated after auth has been attempted
      if (!isAuthenticated) {
        reject(new Error('Not authenticated. Firebase authentication failed.'));
        return;
      }
      
      // Function to actually add the department
      function addDepartment() {
        const pathRef = ref(db, `Subjects/${departmentName}`);
        
        set(pathRef, {})
          .then(() => {
            console.log(`Department added successfully: ${departmentName}`);
            resolve({ department: departmentName });
          })
          .catch((error) => {
            console.error('Error adding department: ', error);
            reject(error);
          });
      }
      
      // If we're already authenticated, add the department
      addDepartment();
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
      // Check if authenticated
      if (!isAuthenticated) {
        reject(new Error('Not authenticated. Please wait for authentication to complete.'));
        return;
      }
      
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