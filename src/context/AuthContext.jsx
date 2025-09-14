import { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../firebase/config';
import { ref, get } from 'firebase/database';
import bcrypt from 'bcryptjs';

const AuthContext = createContext();

// Custom hook to use authentication context
export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminHash, setAdminHash] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  
  // Fetch admin hash from Firebase
  useEffect(() => {
    const fetchAdminHash = async () => {
      try {
        const authRef = ref(db, 'auth/admin');
        const snapshot = await get(authRef);
        if (snapshot.exists()) {
          setAdminHash(snapshot.val());
          console.log('Admin hash loaded successfully');
        } else {
          console.error('No admin hash found in database');
        }
      } catch (error) {
        console.error('Error fetching admin hash:', error);
      } finally {
        setAuthReady(true);
      }
    };
    
    fetchAdminHash();
  }, []);
  
  // Password verification function using bcrypt
  const verifyPassword = async (inputPassword) => {
    if (!adminHash) return false;
    
    try {
      // Compare the input password with the stored hash
      // Note: bcrypt.compare returns a Promise in bcryptjs
      return await bcrypt.compare(inputPassword, adminHash);
    } catch (error) {
      console.error('Error verifying password:', error);
      return false;
    }
  };

  // Initial load - check if user is already logged in from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('peerTogetherUser');
    const storedAdmin = localStorage.getItem('peerTogetherAdmin');

    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
      setIsAdmin(storedAdmin === 'true');
    }
    
    setLoading(false);
  }, []);

  // Admin login function - only requires password
  const login = (password) => {
    return new Promise(async (resolve, reject) => {
      try {
        // Simple validation
        if (!password) {
          reject(new Error('Password is required'));
          return;
        }

        // Check if admin hash is loaded
        if (!adminHash) {
          reject(new Error('Authentication system not ready. Please try again.'));
          return;
        }

        // Verify the password against the stored hash from Firebase
        const isCorrectPassword = await verifyPassword(password);
        
        if (isCorrectPassword) {
          const user = { displayName: 'Administrator' };
          setCurrentUser(user);
          setIsAdmin(true);
          localStorage.setItem('peerTogetherUser', JSON.stringify(user));
          localStorage.setItem('peerTogetherAdmin', 'true');
          resolve(user);
        } else {
          reject(new Error('Invalid password'));
        }
      } catch (error) {
        console.error('Login error:', error);
        reject(new Error('Authentication failed. Please try again.'));
      }
    });
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    setIsAdmin(false);
    localStorage.removeItem('peerTogetherUser');
    localStorage.removeItem('peerTogetherAdmin');
  };

  const value = {
    currentUser,
    isAdmin,
    login,
    logout,
    loading,
    authReady
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}