import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { studentAPI } from '../utils/api';
import '../styles/profile.css';

const StudentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStudent();
  }, [id]);

  const fetchStudent = async () => {
    try {
      const response = await studentAPI.getById(id);
      setStudent(response.data.data.student);
    } catch (error) {
      console.error('Error fetching student:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentAPI.delete(id);
        navigate('/students');
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

  if (!student) {
    return (
      <Layout>
        <div className="alert alert-error">Student not found</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="profile-page">
        <div className="profile-header">
          <h1>{student.name}</h1>
          <div className="profile-actions">
            <button className="btn btn-primary" onClick={() => navigate(`/students/edit/${id}`)}>
              ✏️ Edit
            </button>
            <button className="btn btn-secondary" onClick={handlePrint}>
              🖨️ Print
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              🗑️ Delete
            </button>
            <button className="btn btn-secondary" onClick={() => navigate('/students')}>
              ← Back
            </button>
          </div>
        </div>

        <div className="card">
          <div className="profile-content">
            {/* Personal Information */}
            <div className="profile-section">
              <h3>Personal Information</h3>
              <div className="profile-grid">
                <div className="profile-item">
                  <label>Name:</label>
                  <p>{student.name}</p>
                </div>
                <div className="profile-item">
                  <label>Father's Name:</label>
                  <p>{student.fatherName}</p>
                </div>
                <div className="profile-item">
                  <label>Mother's Name:</label>
                  <p>{student.motherName}</p>
                </div>
                <div className="profile-item">
                  <label>Class:</label>
                  <p>{student.class}</p>
                </div>
                <div className="profile-item">
                  <label>Date of Birth:</label>
                  <p>{new Date(student.dob).toLocaleDateString()}</p>
                </div>
                <div className="profile-item">
                  <label>Date of Admission:</label>
                  <p>{new Date(student.doa).toLocaleDateString()}</p>
                </div>
                <div className="profile-item">
                  <label>Caste:</label>
                  <p>{student.caste}</p>
                </div>
                <div className="profile-item">
                  <label>Category:</label>
                  <p>{student.category}</p>
                </div>
                <div className="profile-item">
                  <label>Mobile Number:</label>
                  <p>{student.mobileNumber}</p>
                </div>
                <div className="profile-item" style={{ gridColumn: 'span 2' }}>
                  <label>Address:</label>
                  <p>{student.address}</p>
                </div>
              </div>
            </div>

            {/* ID Information */}
            <div className="profile-section">
              <h3>ID Information</h3>
              <div className="profile-grid">
                <div className="profile-item">
                  <label>Aadhar Number:</label>
                  <p>{student.aadharNumber}</p>
                </div>
                <div className="profile-item">
                  <label>Samagra ID:</label>
                  <p>{student.samagra_id}</p>
                </div>
                <div className="profile-item">
                  <label>Family ID (Samagra):</label>
                  <p>{student.familyId}</p>
                </div>
              </div>
            </div>

            {/* Parental Information */}
            <div className="profile-section">
              <h3>Parental Information</h3>
              <div className="profile-grid">
                <div className="profile-item">
                  <label>Father's Aadhar Number:</label>
                  <p>{student.fatherAadharNo}</p>
                </div>
                <div className="profile-item">
                  <label>Mother's Aadhar Number:</label>
                  <p>{student.motherAadharNo}</p>
                </div>
              </div>
            </div>

            {/* Banking Information */}
            {(student.accountNumber || student.ifscCode || student.bankName) && (
              <div className="profile-section">
                <h3>Banking Information</h3>
                <div className="profile-grid">
                  {student.accountNumber && (
                    <div className="profile-item">
                      <label>Account Number:</label>
                      <p>{student.accountNumber}</p>
                    </div>
                  )}
                  {student.ifscCode && (
                    <div className="profile-item">
                      <label>IFSC Code:</label>
                      <p>{student.ifscCode}</p>
                    </div>
                  )}
                  {student.bankName && (
                    <div className="profile-item">
                      <label>Bank Name:</label>
                      <p>{student.bankName}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Documents */}
            {student.documents && student.documents.length > 0 && (
              <div className="profile-section">
                <h3>Documents</h3>
                <ul>
                  {student.documents.map((doc, idx) => (
                    <li key={idx}>
                      {doc.fileName} - Uploaded on {new Date(doc.uploadedAt).toLocaleDateString()}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentDetail;
