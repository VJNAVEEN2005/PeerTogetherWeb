import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedHome from './components/ProtectedHome';
import HomePage from './pages/HomePage';
import DepartmentPage from './pages/DepartmentPage';
import CategoryPage from './pages/CategoryPage';
import DocumentDetailPage from './pages/DocumentDetailPage';
import SearchPage from './pages/SearchPage';
import NotFoundPage from './pages/NotFoundPage';
import OECDepartmentPage from './pages/OECDepartmentPage';
import OECDocumentsPage from './pages/OECDocumentsPage';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import './App.css';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="min-h-screen bg-gray-100">
            <Toaster position="top-right" />
            <Navigation />
            <main className="py-8 px-0">
              <Routes>
                <Route path="/" element={<ProtectedHome />} />
                <Route path="/login" element={<LoginPage />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <AdminPage />
                    </ProtectedRoute>
                  } 
                />
                <Route path="/department/OEC" element={
                  <ProtectedRoute>
                    <OECDepartmentPage />
                  </ProtectedRoute>
                } />
                <Route path="/department/OEC/:subDepartment" element={
                  <ProtectedRoute>
                    <OECDocumentsPage />
                  </ProtectedRoute>
                } />
                <Route path="/department/:department" element={
                  <ProtectedRoute>
                    <DepartmentPage />
                  </ProtectedRoute>
                } />
                <Route path="/department/:department/semester/:semester" element={
                  <ProtectedRoute>
                    <DepartmentPage />
                  </ProtectedRoute>
                } />
                <Route path="/department/:department/document/:id" element={
                  <ProtectedRoute>
                    <DocumentDetailPage />
                  </ProtectedRoute>
                } />
                <Route path="/category/:categoryName" element={
                  <ProtectedRoute>
                    <CategoryPage />
                  </ProtectedRoute>
                } />
                <Route path="/search" element={
                  <ProtectedRoute>
                    <SearchPage />
                  </ProtectedRoute>
                } />
                <Route path="*" element={
                  <ProtectedRoute>
                    <NotFoundPage />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;
