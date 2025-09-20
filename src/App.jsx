import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { DataProvider } from './context/DataContext';
import { AuthProvider } from './context/AuthContext';
import Navigation from './components/Navigation';
import ProtectedRoute from './components/ProtectedRoute';
import ProtectedHome from './components/ProtectedHome';
import HomePage from './pages/HomePage';
import LandingPage from './pages/LandingPage';
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
            <Routes>
              <Route path="/" element={null} />
              <Route path="*" element={<Navigation />} />
            </Routes>
            <main>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/home" element={
                  <div className="py-8 px-0">
                    <ProtectedHome />
                  </div>
                } />
                <Route path="/login" element={
                  <div className="py-8 px-0">
                    <LoginPage />
                  </div>
                } />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requireAdmin={true}>
                      <div className="py-8 px-0">
                        <AdminPage />
                      </div>
                    </ProtectedRoute>
                  } 
                />
                <Route path="/department/OEC" element={
                  <ProtectedRoute>
                    <div className="py-8 px-0">
                      <OECDepartmentPage />
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="/department/OEC/:subDepartment" element={
                  <ProtectedRoute>
                    <div className="py-8 px-0">
                      <OECDocumentsPage />
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="/department/:department" element={
                  <ProtectedRoute>
                    <div className="py-8 px-0">
                      <DepartmentPage />
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="/department/:department/semester/:semester" element={
                  <ProtectedRoute>
                    <div className="py-8 px-0">
                      <DepartmentPage />
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="/department/:department/document/:id" element={
                  <ProtectedRoute>
                    <div className="py-8 px-0">
                      <DocumentDetailPage />
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="/category/:categoryName" element={
                  <ProtectedRoute>
                    <div className="py-8 px-0">
                      <CategoryPage />
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="/search" element={
                  <ProtectedRoute>
                    <div className="py-8 px-0">
                      <SearchPage />
                    </div>
                  </ProtectedRoute>
                } />
                <Route path="*" element={
                  <ProtectedRoute>
                    <div className="py-8 px-0">
                      <NotFoundPage />
                    </div>
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
