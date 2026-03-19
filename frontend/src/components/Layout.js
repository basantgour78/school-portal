import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/layout.css';

const Layout = ({ children }) => {
  const navigate = useNavigate();
  const admin = JSON.parse(localStorage.getItem('admin'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    navigate('/login');
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2><i className="fas fa-book"></i> School Portal</h2>
        </div>

        <nav className="sidebar-nav">
          <Link to="/dashboard" className="nav-item">
            <i className="fas fa-chart-bar"></i> Dashboard
          </Link>
          <Link to="/teachers" className="nav-item">
            <i className="fas fa-chalkboard-user"></i> Teachers
          </Link>
          <Link to="/students" className="nav-item">
            <i className="fas fa-graduation-cap"></i> Students
          </Link>
          <Link to="/fee-statement" className="nav-item">
            <i className="fas fa-wallet"></i> Fee Statement
          </Link>
          <Link to="/fee-details" className="nav-item">
            <i className="fas fa-file-invoice-dollar"></i> Fee Details
          </Link>
        </nav>

        <div className="sidebar-footer">
          <div className="admin-info">
            <p><i className="fas fa-user"></i> {admin?.name}</p>
            <small>{admin?.email}</small>
          </div>
          <button className="btn btn-danger btn-block" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </aside>

      <main className="main-content">
        <div className="container">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
