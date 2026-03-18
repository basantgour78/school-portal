import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import StudentSearch from '../components/StudentSearch';
import { feePaymentAPI, studentAPI } from '../utils/api';
import '../styles/form.css';

const FeePayment = ({ isEditMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    student_id: '',
    amount: '',
    remark: '',
    payment_date: new Date().toISOString().split('T')[0],
  });
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchStudent, setSearchStudent] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchStudents();
    if (isEditMode && id) {
      fetchPayment();
    }
  }, [id, isEditMode]);

  const fetchStudents = async () => {
    try {
      const response = await studentAPI.getAll({ limit: 1000 });
      setStudents(response.data.data.students || []);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchPayment = async () => {
    try {
      const response = await feePaymentAPI.getById(id);
      const payment = response.data.data.payment;
      setFormData({
        student_id: payment.student_id,
        amount: payment.amount,
        remark: payment.remark || '',
        payment_date: payment.payment_date,
      });
      setSearchStudent(payment.student_name);
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || 'Failed to fetch payment'}`);
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.student_id) newErrors.student_id = 'Student is required';
    if (!formData.amount || parseFloat(formData.amount) <= 0)
      newErrors.amount = 'Amount must be greater than 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleStudentSelect = (student) => {
    setFormData((prev) => ({
      ...prev,
      student_id: student.id,
    }));
    setSelectedStudent(student);
    setSearchStudent(student.name);
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
      const submitData = {
        ...formData,
        student_id: parseInt(formData.student_id),
      };

      if (isEditMode) {
        await feePaymentAPI.update(id, submitData);
        setMessage('Payment updated successfully!');
      } else {
        await feePaymentAPI.create(submitData);
        setMessage('Payment created successfully!');
      }

      setTimeout(() => {
        navigate('/fee-statement');
      }, 1500);
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || 'Something went wrong'}`);
    } finally {
      setLoading(false);
    }
  };

  const getSelectedStudentInfo = () => {
    return students.find((s) => s.id === parseInt(formData.student_id));
  };

  // Use selectedStudent from state if available, otherwise get from students list
  const displaySelectedStudent = selectedStudent || getSelectedStudentInfo();

  return (
    <Layout>
      <div className="form-page">
        <div className="form-header">
          <h1>{isEditMode ? 'Edit Fee Payment' : 'Record Fee Payment'}</h1>
          <button className="btn btn-secondary" onClick={() => navigate('/fee-statement')}>
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
            {/* Student Selection */}
            <h3>Student & Payment Details</h3>

            <div className="form-group">
              <StudentSearch
                students={students}
                value={searchStudent}
                onChange={setSearchStudent}
                onSelect={handleStudentSelect}
                placeholder="Search student by name"
                label="Select Student"
                required={true}
              />
              {errors.student_id && <div className="error-message">{errors.student_id}</div>}

              {displaySelectedStudent && (
                <div className="selected-student-info">
                  <div className="info-badge">
                    <span className="badge-label">Selected:</span>
                    <span className="badge-value">{displaySelectedStudent.name}</span>
                  </div>
                  <div className="info-row">
                    <div className="info-col">
                      <label>Class:</label>
                      <p>{displaySelectedStudent.class}</p>
                    </div>
                    <div className="info-col">
                      <label>Father's Name:</label>
                      <p>{displaySelectedStudent.fatherName}</p>
                    </div>
                    <div className="info-col">
                      <label>Aadhar Number:</label>
                      <p>{displaySelectedStudent.aadharNumber}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Amount (₹) *</label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  step="0.01"
                  min="0"
                />
                {errors.amount && <div className="error-message">{errors.amount}</div>}
              </div>
            </div>

            <div className="form-group">
              <label>Remark / Notes</label>
              <textarea
                name="remark"
                value={formData.remark}
                onChange={handleChange}
                placeholder="Enter any remark about this payment (optional)"
                rows="4"
              />
            </div>

            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Payment'}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/fee-statement')}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .selected-student-info {
          margin-top: 15px;
          padding: 12px;
          background-color: #f0f7ff;
          border-left: 4px solid #2196F3;
          border-radius: 4px;
        }

        .info-badge {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }

        .badge-label {
          color: #666;
          font-size: 12px;
          text-transform: uppercase;
        }

        .badge-value {
          font-weight: 600;
          color: #1976D2;
        }

        .info-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
        }

        .info-col label {
          display: block;
          font-size: 12px;
          color: #666;
          margin-bottom: 4px;
        }

        .info-col p {
          font-weight: 500;
          color: #333;
        }
      `}</style>
    </Layout>
  );
};

export default FeePayment;
