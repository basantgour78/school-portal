import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { studentAPI } from '../utils/api';
import {
  validateEmail,
  validatePhoneNumber,
  validateAadhar,
  validateAccountNumber,
  validateIFSC,
  validateDOB,
} from '../utils/validation';
import '../styles/form.css';

const StudentForm = ({ isEditMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    // Personal
    name: '',
    fatherName: '',
    motherName: '',
    class: '',
    dob: '',
    doa: '',
    caste: '',
    category: 'General',
    address: '',
    mobileNumber: '',
    // IDs
    aadharNumber: '',
    samagra_id: '',
    familyId: '',
    // Parental IDs
    fatherAadharNo: '',
    motherAadharNo: '',
    // Banking
    accountNumber: '',
    ifscCode: '',
    bankName: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (isEditMode && id) {
      fetchStudent();
    }
  }, [id, isEditMode]);

  const fetchStudent = async () => {
    try {
      const response = await studentAPI.getById(id);
      const student = response.data.data.student;
      setFormData({
        ...formData,
        ...student,
        dob: new Date(student.dob).toISOString().split('T')[0],
        doa: new Date(student.doa).toISOString().split('T')[0],
      });
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || 'Failed to fetch student'}`);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.fatherName.trim()) newErrors.fatherName = 'Father name is required';
    if (!formData.motherName.trim()) newErrors.motherName = 'Mother name is required';
    if (!formData.class) newErrors.class = 'Class is required';
    if (!formData.dob) newErrors.dob = 'DOB is required';
    if (!validateDOB(formData.dob)) newErrors.dob = 'Student must be at least 3 years old';
    if (!formData.doa) newErrors.doa = 'DOA is required';
    if (!formData.caste.trim()) newErrors.caste = 'Caste is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!validatePhoneNumber(formData.mobileNumber))
      newErrors.mobileNumber = 'Mobile number must be 10 digits';
    if (!validateAadhar(formData.aadharNumber))
      newErrors.aadharNumber = 'Aadhar must be 12 digits';
    if (!formData.samagra_id.trim()) newErrors.samagra_id = 'Samagra ID is required';
    if (!formData.familyId.trim()) newErrors.familyId = 'Family ID is required';
    if (!validateAadhar(formData.fatherAadharNo))
      newErrors.fatherAadharNo = 'Father Aadhar must be 12 digits';
    if (!validateAadhar(formData.motherAadharNo))
      newErrors.motherAadharNo = 'Mother Aadhar must be 12 digits';

    if (formData.accountNumber && !validateAccountNumber(formData.accountNumber)) {
      newErrors.accountNumber = 'Invalid account number';
    }
    if (formData.ifscCode && !validateIFSC(formData.ifscCode)) {
      newErrors.ifscCode = 'Invalid IFSC code';
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
        await studentAPI.update(id, formData);
        setMessage('Student updated successfully!');
      } else {
        await studentAPI.create(formData);
        setMessage('Student created successfully!');
      }

      setTimeout(() => {
        navigate('/students');
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
          <h1>{isEditMode ? 'Edit Student' : 'Add New Student'}</h1>
          <button className="btn btn-secondary" onClick={() => navigate('/students')}>
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
            {/* Personal Information */}
            <h3>Personal Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Student Name *</label>
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
                <label>Class *</label>
                <select name="class" value={formData.class} onChange={handleChange}>
                  <option value="">Select Class</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((c) => (
                    <option key={c} value={c}>
                      Class {c}
                    </option>
                  ))}
                </select>
                {errors.class && <div className="error-message">{errors.class}</div>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Father's Name *</label>
                <input
                  type="text"
                  name="fatherName"
                  value={formData.fatherName}
                  onChange={handleChange}
                  placeholder="Enter father's name"
                />
                {errors.fatherName && <div className="error-message">{errors.fatherName}</div>}
              </div>

              <div className="form-group">
                <label>Mother's Name *</label>
                <input
                  type="text"
                  name="motherName"
                  value={formData.motherName}
                  onChange={handleChange}
                  placeholder="Enter mother's name"
                />
                {errors.motherName && <div className="error-message">{errors.motherName}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Date of Birth *</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                />
                {errors.dob && <div className="error-message">{errors.dob}</div>}
              </div>

              <div className="form-group">
                <label>Date of Admission *</label>
                <input
                  type="date"
                  name="doa"
                  value={formData.doa}
                  onChange={handleChange}
                />
                {errors.doa && <div className="error-message">{errors.doa}</div>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Caste *</label>
                <input
                  type="text"
                  name="caste"
                  value={formData.caste}
                  onChange={handleChange}
                  placeholder="Enter caste"
                />
                {errors.caste && <div className="error-message">{errors.caste}</div>}
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select name="category" value={formData.category} onChange={handleChange}>
                  <option value="General">General</option>
                  <option value="OBC">OBC</option>
                  <option value="SC">SC</option>
                  <option value="ST">ST</option>
                </select>
                {errors.category && <div className="error-message">{errors.category}</div>}
              </div>
            </div>

            <div className="form-group">
              <label>Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter full address"
              />
              {errors.address && <div className="error-message">{errors.address}</div>}
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

            {/* ID Information */}
            <h3 style={{ marginTop: '30px' }}>ID Information</h3>

            <div className="form-row-three">
              <div className="form-group">
                <label>Aadhar Number *</label>
                <input
                  type="text"
                  name="aadharNumber"
                  value={formData.aadharNumber}
                  onChange={handleChange}
                  placeholder="12-digit Aadhar number"
                  maxLength="12"
                />
                {errors.aadharNumber && <div className="error-message">{errors.aadharNumber}</div>}
              </div>

              <div className="form-group">
                <label>Samagra ID *</label>
                <input
                  type="text"
                  name="samagra_id"
                  value={formData.samagra_id}
                  onChange={handleChange}
                  placeholder="Enter Samagra ID"
                />
                {errors.samagra_id && <div className="error-message">{errors.samagra_id}</div>}
              </div>

              <div className="form-group">
                <label>Family ID (Samagra) *</label>
                <input
                  type="text"
                  name="familyId"
                  value={formData.familyId}
                  onChange={handleChange}
                  placeholder="Enter Family ID"
                />
                {errors.familyId && <div className="error-message">{errors.familyId}</div>}
              </div>
            </div>

            {/* Parental Information */}
            <h3 style={{ marginTop: '30px' }}>Parental Information</h3>

            <div className="form-row">
              <div className="form-group">
                <label>Father's Aadhar Number *</label>
                <input
                  type="text"
                  name="fatherAadharNo"
                  value={formData.fatherAadharNo}
                  onChange={handleChange}
                  placeholder="12-digit Aadhar number"
                  maxLength="12"
                />
                {errors.fatherAadharNo && <div className="error-message">{errors.fatherAadharNo}</div>}
              </div>

              <div className="form-group">
                <label>Mother's Aadhar Number *</label>
                <input
                  type="text"
                  name="motherAadharNo"
                  value={formData.motherAadharNo}
                  onChange={handleChange}
                  placeholder="12-digit Aadhar number"
                  maxLength="12"
                />
                {errors.motherAadharNo && <div className="error-message">{errors.motherAadharNo}</div>}
              </div>
            </div>

            {/* Banking Information */}
            <h3 style={{ marginTop: '30px' }}>Banking Information (Optional)</h3>

            <div className="form-row-three">
              <div className="form-group">
                <label>Account Number</label>
                <input
                  type="text"
                  name="accountNumber"
                  value={formData.accountNumber}
                  onChange={handleChange}
                  placeholder="Enter account number"
                />
                {errors.accountNumber && <div className="error-message">{errors.accountNumber}</div>}
              </div>

              <div className="form-group">
                <label>IFSC Code</label>
                <input
                  type="text"
                  name="ifscCode"
                  value={formData.ifscCode}
                  onChange={handleChange}
                  placeholder="e.g., HDFC0000123"
                  style={{ textTransform: 'uppercase' }}
                />
                {errors.ifscCode && <div className="error-message">{errors.ifscCode}</div>}
              </div>

              <div className="form-group">
                <label>Bank Name</label>
                <input
                  type="text"
                  name="bankName"
                  value={formData.bankName}
                  onChange={handleChange}
                  placeholder="Enter bank name"
                />
              </div>
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Student'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/students')}
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

export default StudentForm;
