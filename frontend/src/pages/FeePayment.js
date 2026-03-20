import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { feePaymentAPI, studentAPI } from "../utils/api";
import "../styles/form.css";

const getGenderIconClass = (gender) => {
  if (gender === "Male") return "fas fa-mars";
  if (gender === "Female") return "fas fa-venus";
  return "fas fa-user";
};

const FeePayment = ({ isEditMode }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  // State management
  const [formData, setFormData] = useState({
    student_id: "",
    amount: "",
    remark: "",
    payment_date: new Date().toISOString().split("T")[0],
  });

  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  
  const searchTimeoutRef = useRef(null);

  // Fetch payment for edit mode
  useEffect(() => {
    if (isEditMode && id) {
      fetchPayment();
    }
  }, [id, isEditMode]);

  // Fetch payment for edit mode
  const fetchPayment = async () => {
    try {
      const response = await feePaymentAPI.getById(id);
      const payment = response.data.data.payment;

      setFormData({
        student_id: payment.student_id,
        amount: payment.amount,
        remark: payment.remark || "",
        payment_date: payment.payment_date,
      });

      setSearchQuery(payment.student_name);

      // Set selected student with complete data from API
      setSelectedStudent({
        id: payment.student_id,
        name: payment.student_name,
        gender: payment.gender,
        class: payment.class,
        aadharNumber: payment.aadharNumber,
        fatherName: payment.fatherName,
      });
    } catch (error) {
      setMessage(
        `Error: ${error.response?.data?.message || "Failed to fetch payment"}`
      );
    }
  };

  // Search students from API with debouncing
  const handleSearchChange = (value) => {
    setSearchQuery(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!value.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setShowDropdown(true);
    setSearchLoading(true);

    // Debounce API call - 300ms
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await studentAPI.getAll({
          search: value.trim(),
          limit: 10,
        });
        setSearchResults(response.data.data.students || []);
      } catch (error) {
        console.error("Error searching students:", error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  };

  // Handle student selection from search results
  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setSearchQuery(student.name);
    setFormData((prev) => ({
      ...prev,
      student_id: student.id,
    }));
    setShowDropdown(false);
    setSearchResults([]);
    setErrors((prev) => ({
      ...prev,
      student_id: "",
    }));
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};

    if (!formData.student_id || formData.student_id === "") {
      newErrors.student_id = "Please select a student";
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setMessage("");
    setSuccessMessage("");

    try {
      const submitData = {
        ...formData,
        student_id: parseInt(formData.student_id),
        amount: parseFloat(formData.amount),
      };

      if (isEditMode) {
        await feePaymentAPI.update(id, submitData);
        setSuccessMessage("Payment updated successfully!");
      } else {
        await feePaymentAPI.create(submitData);
        setSuccessMessage("Payment recorded successfully!");
      }

      setTimeout(() => {
        navigate("/fee-statement");
      }, 1500);
    } catch (error) {
      setMessage(
        `Error: ${error.response?.data?.message || "Something went wrong"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="form-page">
        <div className="card">
          <div className="form-header">
            <h2>
              <i className="fas fa-wallet"></i>
              {isEditMode ? "Edit Payment" : "Record New Payment"}
            </h2>
            <p>
              {isEditMode
                ? "Update fee payment details"
                : "Record a new fee payment for a student"}
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="alert alert-success" style={{ marginBottom: "20px" }}>
              <i className="fas fa-check-circle"></i>
              {successMessage}
            </div>
          )}

          {/* Error Message */}
          {message && (
            <div className="alert alert-danger" style={{ marginBottom: "20px" }}>
              <i className="fas fa-exclamation-circle"></i>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Section Header */}
            <h3>
              <i className="fas fa-user-graduate"></i> Student & Payment
              Information
            </h3>

          <div className="form-row">
            {/* Student Search */}
            <div className="form-group">
              <label>
                Select Student
                <span className="required">*</span>
              </label>
              <div className="student-search-wrapper">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  onFocus={() => searchQuery && setShowDropdown(true)}
                  onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                  placeholder="Search student by name..."
                  className="student-search-input"
                  autoComplete="off"
                />
                {searchQuery && (
                  <button
                    type="button"
                    className="btn-clear-search"
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                      setShowDropdown(false);
                      setSelectedStudent(null);
                      setFormData(prev => ({ ...prev, student_id: '' }));
                    }}
                    title="Clear search"
                  >
                    <i className="fas fa-times"></i>
                  </button>
                )}

                {/* Search Results Dropdown */}
                {showDropdown && searchQuery && (
                  <div className="student-search-dropdown" onMouseDown={(e) => e.preventDefault()}>
                    {searchLoading ? (
                      <div className="student-search-loading">
                        <i className="fas fa-spinner fa-spin"></i> Searching...
                      </div>
                    ) : searchResults.length > 0 ? (
                      searchResults.map((student) => (
                        <div
                          key={student.id}
                          className="student-search-item"
                          onMouseDown={() => handleSelectStudent(student)}
                        >
                          <div className="student-name name-with-gender">
                            <i
                              className={`${getGenderIconClass(student.gender)} gender-icon gender-icon-${(student.gender || "").toLowerCase()}`}
                              aria-hidden="true"
                            ></i>
                            <span>{student.name}</span>
                          </div>
                          <div className="student-meta">
                            <span className="class-badge">Class {student.class}</span>
                            <span className="aadhar-badge">{student.aadharNumber}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="student-search-empty">
                        No students found
                      </div>
                    )}
                  </div>
                )}
              </div>
              {errors.student_id && (
                <div className="error-message">
                  <i className="fas fa-exclamation-triangle"></i>
                  {errors.student_id}
                </div>
              )}
            </div>

            {/* Amount */}
            
              <div className="form-group">
                <label>
                  Amount (₹)
                  <span className="required">*</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder="Enter amount"
                  step="0.01"
                  min="0"
                  disabled={loading}
                />
                {errors.amount && (
                  <div className="error-message">
                    <i className="fas fa-exclamation-triangle"></i>
                    {errors.amount}
                  </div>
                )}
              </div>
            </div>

            {/* Selected Student Details */}
            {selectedStudent && (
              <div className="selected-student-info">
                <div className="info-badge">
                  <i className="fas fa-info-circle"></i>
                  <span className="badge-label">Selected Student:</span>
                  <span className="badge-value name-with-gender">
                    <i
                      className={`${getGenderIconClass(selectedStudent.gender)} gender-icon gender-icon-${(selectedStudent.gender || "").toLowerCase()}`}
                      aria-hidden="true"
                    ></i>
                    <span>{selectedStudent.name}</span>
                  </span>
                </div>
                <div className="info-row">
                  <div className="info-col">
                    <label>Class</label>
                    <p>{selectedStudent.class}</p>
                  </div>
                  <div className="info-col">
                    <label>Father's Name</label>
                    <p>{selectedStudent.fatherName}</p>
                  </div>
                  <div className="info-col">
                    <label>Aadhar Number</label>
                    <p>{selectedStudent.aadharNumber}</p>
                  </div>
                </div>
              </div>
            )}


            <div className="form-group">
                <label>Remark / Notes</label>
                <textarea
                  name="remark"
                  value={formData.remark}
                  onChange={handleChange}
                  placeholder="Enter any remark about this payment (optional)"
                  rows="4"
                  disabled={loading}
                />
              </div>

            {/* Form Actions */}
            <div className="form-actions">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                <i className="fas fa-save"></i>
                {loading ? "Saving..." : isEditMode ? "Update Payment" : "Save Payment"}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate("/fee-details")}
                disabled={loading}
              >
                <i className="fas fa-times"></i>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      <style>{`
        .form-header {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #f0f0f0;
        }

        .form-header h2 {
          margin: 0 0 8px 0;
          color: #1f2937;
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 24px;
        }

        .form-header h2 i {
          color: #2196F3;
        }

        .form-header p {
          margin: 0;
          color: #6b7280;
          font-size: 14px;
        }

        .alert {
          padding: 14px 16px;
          border-radius: 6px;
          font-size: 14px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .alert-success {
          background-color: #d4edda;
          border: 1px solid #c3e6cb;
          color: #155724;
        }

        .alert-success i {
          color: #28a745;
          font-size: 16px;
        }

        .alert-danger {
          background-color: #f8d7da;
          border: 1px solid #f5c6cb;
          color: #721c24;
        }

        .alert-danger i {
          color: #dc3545;
          font-size: 16px;
        }

        form h3 {
          color: #1f2937;
          margin-top: 30px;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 16px;
          border-bottom: 2px solid #e5e7eb;
          padding-bottom: 10px;
        }

        form h3 i {
          color: #2196F3;
        }

        .required {
          color: #dc3545;
        }

        .selected-student-info {
          background: linear-gradient(135deg, #f0f7ff 0%, #e3f2fd 100%);
          border: 2px solid #2196F3;
          border-left: 5px solid #1976D2;
          border-radius: 8px;
          padding: 20px;
          margin: 25px 0;
          box-shadow: 0 2px 8px rgba(33, 150, 243, 0.15);
        }

        .student-search-wrapper {
          position: relative;
          width: 100%;
        }

        .btn-clear-search {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          color: #2196F3;
          cursor: pointer;
          font-size: 18px;
          padding: 6px 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          border-radius: 4px;
          z-index: 5;
        }

        .btn-clear-search:hover {
          color: #dc3545;
          background-color: rgba(220, 53, 69, 0.1);
          transform: translateY(-50%) scale(1.15);
        }

        .info-badge {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
          padding-bottom: 15px;
          border-bottom: 2px solid rgba(25, 118, 210, 0.2);
        }

        .info-badge i {
          color: #1976D2;
          font-size: 18px;
        }

        .badge-label {
          color: #666;
          font-size: 12px;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.5px;
        }

        .badge-value {
          font-weight: 700;
          color: #1976D2;
          font-size: 16px;
        }

        .info-row {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
        }

        .info-col {
          background: white;
          padding: 14px;
          border-radius: 6px;
          border: 1px solid rgba(33, 150, 243, 0.15);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .info-col label {
          display: block;
          font-size: 11px;
          color: #999;
          margin-bottom: 8px;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 0.3px;
        }

        .info-col p {
          font-weight: 600;
          color: #333;
          margin: 0;
          font-size: 14px;
          word-break: break-word;
        }

        .form-actions {
          display: flex;
          gap: 12px;
          margin-top: 35px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
        }

        .form-actions .btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .btn i {
          font-size: 14px;
        }

        .student-search-wrapper {
          position: relative;
          width: 100%;
        }

        .student-search-input {
          width: 100%;
          padding: 12px 14px;
          border: 2px solid #e0e0e0;
          border-radius: 8px;
          font-size: 14px;
          font-family: inherit;
          transition: all 0.3s ease;
          background: white;
        }

        .student-search-input:focus {
          outline: none;
          border-color: #2196F3;
          box-shadow: 0 0 0 4px rgba(33, 150, 243, 0.1);
        }

        .student-search-input::placeholder {
          color: #999;
        }

        .student-search-dropdown {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          right: 0;
          background: white;
          border: 2px solid #2196F3;
          border-radius: 8px;
          max-height: 320px;
          overflow-y: auto;
          z-index: 1000;
          box-shadow: 0 8px 24px rgba(33, 150, 243, 0.2);
        }

        .student-search-item {
          padding: 12px 16px;
          cursor: pointer;
          border-bottom: 1px solid #f0f0f0;
          transition: background-color 0.2s ease;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
        }

        .student-search-item:last-child {
          border-bottom: none;
        }

        .student-search-item:hover {
          background-color: #f5f7ff;
        }

        .student-name {
          color: #333;
          font-weight: 500;
          font-size: 14px;
          flex: 1;
        }

        .student-meta {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .class-badge,
        .aadhar-badge {
          font-size: 11px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 12px;
          white-space: nowrap;
        }

        .class-badge {
          background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
          color: white;
        }

        .aadhar-badge {
          background: #f0f0f0;
          color: #666;
        }

        .student-search-empty,
        .student-search-loading {
          padding: 16px;
          text-align: center;
          color: #999;
          font-size: 13px;
        }

        .student-search-dropdown::-webkit-scrollbar {
          width: 6px;
        }

        .student-search-dropdown::-webkit-scrollbar-track {
          background: #f0f0f0;
          border-radius: 8px;
        }

        .student-search-dropdown::-webkit-scrollbar-thumb {
          background: #2196F3;
          border-radius: 8px;
        }

        .student-search-dropdown::-webkit-scrollbar-thumb:hover {
          background: #1976D2;
        }

        @media (max-width: 768px) {
          .form-row {
            grid-template-columns: 1fr;
          }

          .form-actions {
            flex-direction: column;
          }

          .form-actions .btn {
            width: 100%;
          }

          .info-row {
            grid-template-columns: 1fr;
          }

          .form-header h2 {
            font-size: 20px;
          }

          .student-meta {
            flex-direction: column;
            gap: 4px;
          }

          .student-search-item {
            flex-direction: column;
            align-items: flex-start;
          }

          .student-name {
            width: 100%;
          }
        }
      `}</style>
    </Layout>
  );
};

export default FeePayment;
