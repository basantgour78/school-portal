import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { teacherAPI } from '../utils/api';
import { validateEmail, validatePhoneNumber } from '../utils/validation';
import '../styles/form.css';

const TeacherForm = ({ isEditMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    subject: '',
    email: '',
    mobileNumber: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isEditMode && id) {
      fetchTeacher();
    }
  }, [id, isEditMode]);

  const fetchTeacher = async () => {
    try {
      const response = await teacherAPI.getById(id);
      setFormData(response.data.data.teacher);
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || 'Failed to fetch teacher'}`);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }
    if (!validateEmail(formData.email)) {
      newErrors.email = 'Valid email is required';
    }
    if (!validatePhoneNumber(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Mobile number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      if (isEditMode) {
        await teacherAPI.update(id, formData);
        setMessage('Teacher updated successfully!');
      } else {
        await teacherAPI.create(formData);
        setMessage('Teacher created successfully!');
      }

      setTimeout(() => {
        navigate('/teachers');
      }, 1500);
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || 'Something went wrong'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="form-page">
        <div className="form-header">
          <h1>{isEditMode ? 'Edit Teacher' : 'Add New Teacher'}</h1>
          <button className="btn btn-secondary" onClick={() => navigate('/teachers')}>
            ← Back
          </button>
        </div>

        <div className="card">
          {message && (
            <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Teacher Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter full name"
              />
              {errors.name && <div className="error-message">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label>Subject *</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Enter subject"
              />
              {errors.subject && <div className="error-message">{errors.subject}</div>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                />
                {errors.email && <div className="error-message">{errors.email}</div>}
              </div>

              <div className="form-group">
                <label>Mobile Number *</label>
                <input
                  type="text"
                  name="mobileNumber"
                  value={formData.mobileNumber}
                  onChange={handleChange}
                  placeholder="Enter 10-digit mobile number"
                  maxLength="10"
                />
                {errors.mobileNumber && <div className="error-message">{errors.mobileNumber}</div>}
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Teacher'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/teachers')}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default TeacherForm;
