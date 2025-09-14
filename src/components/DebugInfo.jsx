import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useData } from '../context/DataContext';

function DebugInfo() {
  const { isAuthenticated, authAttempted, error } = useData();
  const [authDetails, setAuthDetails] = useState(null);
  const [showDebug, setShowDebug] = useState(false);
  
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthDetails({
          uid: user.uid,
          isAnonymous: user.isAnonymous,
          providerId: user.providerId || 'none'
        });
      } else {
        setAuthDetails(null);
      }
    });
    
    return () => unsubscribe();
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
          <span className="font-semibold">Auth State: </span>
          <span className={isAuthenticated ? 'text-green-600' : 'text-red-600'}>
            {isAuthenticated ? 'Authenticated' : 'Not Authenticated'}
          </span>
        </p>
        <p>
          <span className="font-semibold">Auth Attempted: </span>
          <span className={authAttempted ? 'text-green-600' : 'text-blue-600'}>
            {authAttempted ? 'Yes' : 'No'}
          </span>
        </p>
        {error && (
          <p>
            <span className="font-semibold text-red-600">Error: </span>
            <span className="text-red-600">{error}</span>
          </p>
        )}
        {authDetails && (
          <>
            <p><span className="font-semibold">UID: </span>{authDetails.uid}</p>
            <p><span className="font-semibold">Anonymous: </span>{authDetails.isAnonymous ? 'Yes' : 'No'}</p>
            <p><span className="font-semibold">Provider: </span>{authDetails.providerId}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default DebugInfo;