import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { teacherAPI } from '../utils/api';
import '../styles/profile.css';

const TeacherDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTeacher();
  }, [id]);

  const fetchTeacher = async () => {
    try {
      const response = await teacherAPI.getById(id);
      setTeacher(response.data.data.teacher);
    } catch (error) {
      console.error('Error fetching teacher:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await teacherAPI.delete(id);
        navigate('/teachers');
      } catch (error) {
        alert(`Error: ${error.response?.data?.message || 'Failed to delete'}`);
      }
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <Layout>
        <div className="spinner"></div>
      </Layout>
    );
  }

  if (!teacher) {
    return (
      <Layout>
        <div className="alert alert-error">Teacher not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="profile-page">
        <div className="profile-header">
          <h1>{teacher.name}</h1>
          <div className="profile-actions">
            <button className="btn btn-primary" onClick={() => navigate(`/teachers/edit/${id}`)}>
              ✏️ Edit
            </button>
            <button className="btn btn-secondary" onClick={handlePrint}>
              🖨️ Print
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              🗑️ Delete
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/teachers')}>
              ← Back
            </button>
          </div>
        </div>

        <div className="card">
          <div className="profile-content">
            <div className="profile-section">
              <h3>Personal Information</h3>
              <div className="profile-grid">
                <div className="profile-item">
                  <label>Name:</label>
                  <p>{teacher.name}</p>
                </div>
                <div className="profile-item">
                  <label>Subject:</label>
                  <p>{teacher.subject}</p>
                </div>
                <div className="profile-item">
                  <label>Email:</label>
                  <p>{teacher.email}</p>
                </div>
                <div className="profile-item">
                  <label>Mobile Number:</label>
                  <p>{teacher.mobileNumber}</p>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h3>Other Information</h3>
              <div className="profile-grid">
                <div className="profile-item">
                  <label>Joined:</label>
                  <p>{new Date(teacher.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="profile-item">
                  <label>Last Updated:</label>
                  <p>{new Date(teacher.updatedAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherDetail;
