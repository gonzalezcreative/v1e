import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './store/AuthContext';
import { LeadProvider } from './store/LeadContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import BusinessDashboard from './pages/BusinessDashboard';
import AdminDashboard from './pages/AdminDashboard';
import PaymentConfirmation from './pages/PaymentConfirmation';
import { useAuth } from './store/AuthContext';

function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, isAdmin } = useAuth();
  
  if (!user || !isAdmin()) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
}

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/business" element={<BusinessDashboard />} />
        <Route path="/payment-confirmation" element={<PaymentConfirmation />} />
        <Route 
          path="/admin" 
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          } 
        />
      </Routes>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <LeadProvider>
        <AppContent />
      </LeadProvider>
    </AuthProvider>
  );
}

export default App;