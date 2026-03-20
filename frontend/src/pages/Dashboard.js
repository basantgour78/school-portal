import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { studentAPI, teacherAPI, feePaymentAPI } from '../utils/api';
import '../styles/dashboard.css';

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    studentsByClass: [],
    studentsByCategory: [],
    lastMonthCollection: 0,
    lastMonthPayments: 0,
    lastMonthStudentsCovered: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const today = new Date();
      const lastMonth = new Date();
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      const formatDate = (date) => date.toISOString().split('T')[0];

      const [studentStats, teacherRes, feeSummaryRes] = await Promise.all([
        studentAPI.getStatistics(),
        teacherAPI.getAll({ limit: 100 }),
        feePaymentAPI.getSummary({
          fromDate: formatDate(lastMonth),
          toDate: formatDate(today),
        }),
      ]);

      const feeSummary = feeSummaryRes.data.data.summary || {};

      setStats({
        totalStudents: studentStats.data.data.totalStudents || 0,
        totalTeachers: teacherRes.data.data.total || 0,
        studentsByClass: studentStats.data.data.studentsByClass || [],
        studentsByCategory: studentStats.data.data.studentsByCategory || [],
        lastMonthCollection: feeSummary.totalAmount || 0,
        lastMonthPayments: feeSummary.totalPayments || 0,
        lastMonthStudentsCovered: feeSummary.uniqueStudents || 0,
      });
    } catch (error) {
      console.error('Error fetching statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="spinner"></div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="dashboard">
        <h1>Dashboard</h1>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-user-graduate"></i>
            </div>
            <div className="stat-content">
              <h3>Total Students</h3>
              <p className="stat-number">{stats.totalStudents}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-chalkboard-user"></i>
            </div>
            <div className="stat-content">
              <h3>Total Teachers</h3>
              <p className="stat-number">{stats.totalTeachers}</p>
            </div>
          </div>
        </div>

        <div className="section-header">
          <h2>Last One Month Fee Summary</h2>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-money-bill-wave"></i>
            </div>
            <div className="stat-content">
              <h3>Total Collection</h3>
              <p className="stat-number stat-number-money">{formatCurrency(stats.lastMonthCollection)}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-receipt"></i>
            </div>
            <div className="stat-content">
              <h3>Total Payments</h3>
              <p className="stat-number">{stats.lastMonthPayments}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-content">
              <h3>Students Covered</h3>
              <p className="stat-number">{stats.lastMonthStudentsCovered}</p>
            </div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Students by Class</h3>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Class</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {stats.studentsByClass.map((item) => (
                  <tr key={item._id}>
                    <td>Class {item._id}</td>
                    <td>
                      <span className="badge badge-success">{item.count}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Students by Category</h3>
            </div>
            <table className="table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                {stats.studentsByCategory.map((item) => (
                  <tr key={item._id}>
                    <td>{item._id}</td>
                    <td>
                      <span className="badge badge-warning">{item.count}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
