import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HomePage from '../pages/HomePage';

function ProtectedHome() {
  const { currentUser } = useAuth();

  // If not authenticated, redirect to login page
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  // User is authenticated, show HomePage
  return <HomePage />;
}

export default ProtectedHome;