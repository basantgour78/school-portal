import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { studentAPI, teacherAPI } from '../utils/api';
import '../styles/dashboard.css';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    studentsByClass: [],
    studentsByCategory: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      const [studentStats, teacherRes] = await Promise.all([
        studentAPI.getStatistics(),
        teacherAPI.getAll({ limit: 100 }),
      ]);
      setStats({
        totalStudents: studentStats.data.data.totalStudents || 0,
        totalTeachers: teacherRes.data.data.total || 0,
        studentsByClass: studentStats.data.data.studentsByClass || [],
        studentsByCategory: studentStats.data.data.studentsByCategory || [],
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
            <div className="stat-icon">👨‍🎓</div>
            <div className="stat-content">
              <h3>Total Students</h3>
              <p className="stat-number">{stats.totalStudents}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon">👨‍🏫</div>
            <div className="stat-content">
              <h3>Total Teachers</h3>
              <p className="stat-number">{stats.totalTeachers}</p>
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
