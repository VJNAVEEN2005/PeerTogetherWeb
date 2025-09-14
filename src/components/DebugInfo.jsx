import React, { useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { ref, child, get, set, remove } from 'firebase/database';
import { toast } from 'react-hot-toast';
import { useData } from '../context/DataContext';

function DebugInfo() {
  const { isAuthenticated, authAttempted, error } = useData();
  const [showDebug, setShowDebug] = useState(false);
  const [dbConnected, setDbConnected] = useState(false);
  const [testWriteResult, setTestWriteResult] = useState(null);

  useEffect(() => {
    // Try to read from database to test connection
    const dbRef = ref(db);
    
    // Test database connection with a simple read operation
    get(dbRef).then((snapshot) => {
      setDbConnected(true);
      console.log("Database connection confirmed");
    }).catch(err => {
      console.error("Database connection test failed:", err);
      setDbConnected(false);
    });
  }, []);
  
  if (!showDebug) {
    return (
      <div className="fixed bottom-2 right-2">
        <button 
          onClick={() => setShowDebug(true)}
          className="bg-gray-200 text-gray-700 p-1 rounded text-xs"
        >
          Show Debug Info
        </button>
      </div>
    );
  }
  
  return (
    <div className="fixed bottom-2 right-2 bg-gray-100 p-3 rounded shadow-md text-xs max-w-xs">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold">Firebase Debug Info</h3>
        <button 
          onClick={() => setShowDebug(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-1">
        <p>
          <span className="font-semibold">Firebase Config: </span>
          <span className="text-green-600">Using Full Config</span>
        </p>
        <p>
          <span className="font-semibold">Auth Needed: </span>
          <span className="text-green-600">No</span>
        </p>
        <p>
          <span className="font-semibold">DB Connected: </span>
          <span className={dbConnected ? 'text-green-600' : 'text-red-600'}>
            {dbConnected ? 'Yes' : 'No'}
          </span>
        </p>
        <p>
          <span className="font-semibold">Database URL: </span>
          <span className="text-blue-600 text-xs">
            https://peer-together-default-rtdb.firebaseio.com
          </span>
        </p>
        {error && (
          <p>
            <span className="font-semibold text-red-600">Error: </span>
            <span className="text-red-600">{error}</span>
          </p>
        )}
        <div className="mt-2 flex gap-2">
          <button 
            onClick={() => {
              window.location.reload();
            }}
            className="bg-blue-500 text-white p-1 rounded text-xs"
          >
            Reload Page
          </button>
          <button 
            onClick={() => {
              // Try to write a test value to Firebase
              const testRef = ref(db, 'test_debug');
              set(testRef, { timestamp: Date.now() })
                .then(() => {
                  setTestWriteResult("Success: Write test passed");
                  toast.success("Database write test successful");
                })
                .catch(err => {
                  setTestWriteResult(`Error: ${err.message}`);
                  toast.error(`Database write test failed: ${err.message}`);
                });
            }}
            className="bg-green-500 text-white p-1 rounded text-xs"
          >
            Test Write
          </button>
        </div>
        {testWriteResult && (
          <p className={testWriteResult.startsWith('Success') ? 'text-green-600' : 'text-red-600'}>
            {testWriteResult}
          </p>
        )}
      </div>
    </div>
  );
}

export default DebugInfo;