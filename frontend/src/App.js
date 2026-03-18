import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import './styles/global.css';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Teachers from './pages/Teachers';
import TeacherForm from './pages/TeacherForm';
import TeacherDetail from './pages/TeacherDetail';
import Students from './pages/Students';
import StudentForm from './pages/StudentForm';
import StudentDetail from './pages/StudentDetail';
import FeeStatement from './pages/FeeStatement';
import FeePayment from './pages/FeePayment';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        {/* Teacher Routes */}
        <Route
          path="/teachers"
          element={
            <ProtectedRoute>
              <Teachers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teachers/add"
          element={
            <ProtectedRoute>
              <TeacherForm isEditMode={false} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teachers/edit/:id"
          element={
            <ProtectedRoute>
              <TeacherForm isEditMode={true} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/teachers/:id"
          element={
            <ProtectedRoute>
              <TeacherDetail />
            </ProtectedRoute>
          }
        />

        {/* Student Routes */}
        <Route
          path="/students"
          element={
            <ProtectedRoute>
              <Students />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/add"
          element={
            <ProtectedRoute>
              <StudentForm isEditMode={false} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/edit/:id"
          element={
            <ProtectedRoute>
              <StudentForm isEditMode={true} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/students/:id"
          element={
            <ProtectedRoute>
              <StudentDetail />
            </ProtectedRoute>
          }
        />

        {/* Fee Payment Routes */}
        <Route
          path="/fee-statement"
          element={
            <ProtectedRoute>
              <FeeStatement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fee-payment"
          element={
            <ProtectedRoute>
              <FeePayment isEditMode={false} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/fee-payment/edit/:id"
          element={
            <ProtectedRoute>
              <FeePayment isEditMode={true} />
            </ProtectedRoute>
          }
        />

        {/* Default redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
