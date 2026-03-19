import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { feePaymentAPI, studentAPI } from '../utils/api';
import '../styles/list.css';

const FeeStatement = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  
  // Filter and search state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  
  // API-based search with debouncing
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const searchTimeoutRef = useRef(null);
  
  // Detail view state
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    fetchPayments();
  }, [currentPage, pageSize]);

  // Fetch payments when filters change (search, class, dates)
  useEffect(() => {
    if (currentPage === 1) {
      fetchPayments();
    }
  }, [selectedStudent, selectedClass, fromDate, toDate]);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
        class: selectedClass || undefined,
        fromDate: fromDate || undefined,
        toDate: toDate || undefined,
      };
      
      // Remove undefined values
      Object.keys(params).forEach(key => params[key] === undefined && delete params[key]);
      
      const response = await feePaymentAPI.getAll(params);
      setPayments(response.data.data.payments || []);
      setTotalPages(response.data.data.pagination.total_pages || 1);
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || 'Failed to fetch payments'}`);
    } finally {
      setLoading(false);
    }
  };

  // Debounced search for student autocomplete
  const handleSearchWithDebounce = (value) => {
    // Don't allow typing if a student is already selected
    if (selectedStudent) {
      return;
    }

    setSearchTerm(value);
    setShowSearchDropdown(true);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!value.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

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
        console.error('Error searching students:', error);
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  };

  const handleFilterChange = () => {
    setCurrentPage(1);
    fetchPayments();
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleViewDetails = async (paymentId) => {
    try {
      const response = await feePaymentAPI.getById(paymentId);
      setSelectedPayment(response.data.data.payment);
      setShowDetails(true);
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || 'Failed to fetch payment details'}`);
    }
  };

  const handleDelete = async (paymentId) => {
    if (window.confirm('Are you sure you want to delete this payment?')) {
      try {
        await feePaymentAPI.delete(paymentId);
        setMessage('Payment deleted successfully!');
        setShowDetails(false);
        fetchPayments();
      } catch (error) {
        setMessage(`Error: ${error.response?.data?.message || 'Failed to delete'}`);
      }
    }
  };

  const handleEdit = (paymentId) => {
    navigate(`/fee-payment/edit/${paymentId}`);
  };

  const handleApplyFilters = () => {
    handleFilterChange();
  };

  const handlePrintReceipt = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };

  const handleResetFilters = async () => {
    setSearchTerm('');
    setSelectedStudent(null);
    setSelectedClass('');
    setFromDate('');
    setToDate('');
    setCurrentPage(1);
    
    // Fetch immediately with reset filters
    setLoading(true);
    try {
      const params = {
        page: 1,
        limit: pageSize,
      };
      
      const response = await feePaymentAPI.getAll(params);
      setPayments(response.data.data.payments || []);
      setTotalPages(response.data.data.pagination.total_pages || 1);
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || 'Failed to fetch payments'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loading && payments.length === 0) {
    return (
      <Layout>
        <div className="spinner"></div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="list-page">
        <div className="list-header">
          <h1>Fee Statement</h1>
          <button className="btn btn-primary" onClick={() => navigate('/fee-payment')}>
            <i className="fas fa-plus"></i> Add Payment
          </button>
        </div>

        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
            {message}
          </div>
        )}

        {/* Filter Section */}
        <div className="card fee-filter-card">
          <div className="filter-header">
            <h3><i className="fas fa-magnifying-glass"></i> Search & Filter Payments</h3>
          </div>
          
          <div className="filter-content">
            <div className="filter-row">
              <div className="filter-group autocomplete-group">
                <label>Search Student by Name</label>
                <div className="autocomplete-wrapper">
                  <input
                    type="text"
                    placeholder="Type student name..."
                    value={searchTerm}
                    onChange={(e) => handleSearchWithDebounce(e.target.value)}
                    onFocus={() => {
                      if (searchTerm.trim() && !selectedStudent) {
                        setShowSearchDropdown(true);
                      }
                    }}
                    className="filter-input"
                    autoComplete="off"
                    disabled={selectedStudent !== null}
                  />
                  {selectedStudent && (
                    <button
                      className="btn-clear-student"
                      onClick={() => {
                        setSelectedStudent(null);
                        setSearchTerm('');
                        setSearchResults([]);
                        setShowSearchDropdown(false);
                        setPayments([]);
                      }}
                      title="Clear student selection"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                  {showSearchDropdown && !selectedStudent && (
                    <div className="autocomplete-dropdown">
                      {searchLoading ? (
                        <div className="autocomplete-loading">
                          <i className="fas fa-spinner fa-spin"></i> Searching...
                        </div>
                      ) : searchResults.length > 0 ? (
                        searchResults.map((student) => (
                          <div
                            key={student.id}
                            className="autocomplete-item"
                            onMouseDown={(e) => {
                              e.preventDefault();
                              setSelectedStudent(student);
                              setSearchTerm(student.name);
                              setShowSearchDropdown(false);
                              setSearchResults([]);
                              setCurrentPage(1);
                            }}
                          >
                            <strong>{student.name}</strong>
                            <span className="class-badge">Class {student.class}</span>
                          </div>
                        ))
                      ) : searchTerm.trim() ? (
                        <div className="autocomplete-empty">
                          No students found
                        </div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>

              <div className="filter-group">
                <label>Select Class</label>
                <select value={selectedClass} onChange={(e) => {
                  setSelectedClass(e.target.value);
                  setCurrentPage(1);
                }} className="filter-input">
                  <option value="">All Classes</option>
                  <option value="1">Class 1</option>
                  <option value="2">Class 2</option>
                  <option value="3">Class 3</option>
                  <option value="4">Class 4</option>
                  <option value="5">Class 5</option>
                  <option value="6">Class 6</option>
                  <option value="7">Class 7</option>
                  <option value="8">Class 8</option>
                  <option value="9">Class 9</option>
                  <option value="10">Class 10</option>
                  <option value="11">Class 11</option>
                  <option value="12">Class 12</option>
                </select>
              </div>

              <div className="filter-group">
                <label>From Date</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => {
                    setFromDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label>To Date</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => {
                    setToDate(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="filter-input"
                />
              </div>
            </div>

            <div className="filter-actions">
              <button className="btn btn-primary filter-btn" onClick={handleApplyFilters}>
                <i className="fas fa-magnifying-glass"></i> Apply Filters
              </button>
              <button className="btn btn-secondary filter-btn" onClick={handleResetFilters}>
                <i className="fas fa-rotate-right"></i> Reset
              </button>
            </div>
          </div>
        </div>

        {/* Payments Table */}
        <div className="card">
          {payments.length === 0 ? (
            <div className="empty-state">
              <p>No payments found</p>
            </div>
          ) : (
            <>
              <table className="table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Class</th>
                    <th>Amount</th>
                    <th>Payment Date</th>
                    <th>Admin Name</th>
                    <th>Aadhar</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
                    <tr key={payment.id}>
                      <td>{payment.student_name}</td>
                      <td>{payment.class}</td>
                      <td>₹{parseFloat(payment.amount).toFixed(2)}</td>
                      <td>{new Date(payment.payment_date).toLocaleDateString()}</td>
                      <td>{payment.admin_name}</td>
                      <td>{payment.aadharNumber}</td>
                      <td>
                        <button
                          className="btn btn-sm btn-info"
                          onClick={() => handleViewDetails(payment.id)}
                        >
                          <i className="fas fa-eye"></i> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination */}
              <div className="fee-pagination-section">
                <div className="pagination-left">
                  <label className="rows-per-page">
                    Rows per page:
                    <select value={pageSize} onChange={(e) => {
                      setPageSize(parseInt(e.target.value));
                      setCurrentPage(1);
                    }} className="page-size-select">
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                    </select>
                  </label>
                  <span className="page-info">Total: {payments.length} payments on this page</span>
                </div>

                <div className="pagination-center">
                  <span className="page-indicator">Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong></span>
                </div>

                <div className="pagination-controls">
                  <button
                    className="btn btn-pagination"
                    onClick={handlePreviousPage}
                    disabled={currentPage === 1}
                    title="Previous Page"
                  >
                    <i className="fas fa-chevron-left"></i> Previous
                  </button>
                  <button
                    className="btn btn-pagination"
                    onClick={handleNextPage}
                    disabled={currentPage === totalPages}
                    title="Next Page"
                  >
                    Next <i className="fas fa-chevron-right"></i>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Detail Modal */}
      {showDetails && selectedPayment && (
        <div className="modal-overlay" onClick={() => setShowDetails(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Payment Details</h2>
              <button className="modal-close" onClick={() => setShowDetails(false)}>
                <i className="fas fa-xmark"></i>
              </button>
            </div>

            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                  <label>Student Name:</label>
                  <p>{selectedPayment.student_name}</p>
                </div>
                <div className="detail-item">
                  <label>Father's Name:</label>
                  <p>{selectedPayment.fatherName}</p>
                </div>
                <div className="detail-item">
                  <label>Aadhar Number:</label>
                  <p>{selectedPayment.aadharNumber}</p>
                </div>
                <div className="detail-item">
                  <label>Class:</label>
                  <p>{selectedPayment.class}</p>
                </div>
                <div className="detail-item">
                  <label>Amount:</label>
                  <p>₹{parseFloat(selectedPayment.amount).toFixed(2)}</p>
                </div>
                <div className="detail-item">
                  <label>Payment Date:</label>
                  <p>{new Date(selectedPayment.payment_date).toLocaleDateString()}</p>
                </div>
                <div className="detail-item">
                  <label>Payment Received By:</label>
                  <p>{selectedPayment.admin_name}</p>
                </div>
                <div className="detail-item">
                  <label>Admin Email:</label>
                  <p>{selectedPayment.admin_email}</p>
                </div>
                {selectedPayment.remark && (
                  <div className="detail-item" style={{ gridColumn: 'span 2' }}>
                    <label>Remark:</label>
                    <p>{selectedPayment.remark}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-primary"
                onClick={handlePrintReceipt}
              >
                <i className="fas fa-print"></i> Print Receipt
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Receipt for Printing */}
      {selectedPayment && (
        <div className="receipt-container">
          <div className="receipt">
            <div className="receipt-header">
              <h1 className="receipt-title">FEE PAYMENT RECEIPT</h1>
              <div className="receipt-line"></div>
            </div>

            <div className="receipt-body">
              <div className="receipt-section">
                <h3>SCHOOL DETAILS</h3>
                <p><strong>School Name:</strong> ABC School & College</p>
                <p><strong>Address:</strong> School Road, City</p>
                <p><strong>Contact:</strong> (123) 456-7890</p>
              </div>

              <div className="receipt-line-divider"></div>

              <div className="receipt-section">
                <h3>STUDENT INFORMATION</h3>
                <div className="receipt-row">
                  <div className="receipt-col">
                    <p><strong>Student Name:</strong><br />{selectedPayment.student_name}</p>
                  </div>
                  <div className="receipt-col">
                    <p><strong>Class:</strong><br />{selectedPayment.class}</p>
                  </div>
                </div>
                <div className="receipt-row">
                  <div className="receipt-col">
                    <p><strong>Father's Name:</strong><br />{selectedPayment.fatherName}</p>
                  </div>
                  <div className="receipt-col">
                    <p><strong>Aadhar Number:</strong><br />{selectedPayment.aadharNumber}</p>
                  </div>
                </div>
              </div>

              <div className="receipt-line-divider"></div>

              <div className="receipt-section">
                <h3>PAYMENT DETAILS</h3>
                <div className="receipt-row">
                  <div className="receipt-col">
                    <p><strong>Amount Paid:</strong></p>
                    <p className="amount">₹{parseFloat(selectedPayment.amount).toFixed(2)}</p>
                  </div>
                  <div className="receipt-col">
                    <p><strong>Payment Date:</strong><br />{new Date(selectedPayment.payment_date).toLocaleDateString('en-IN')}</p>
                  </div>
                </div>
                {selectedPayment.remark && (
                  <div className="receipt-row">
                    <p><strong>Remarks:</strong><br />{selectedPayment.remark}</p>
                  </div>
                )}
              </div>

              <div className="receipt-line-divider"></div>

              <div className="receipt-section">
                <h3>RECEIVED BY</h3>
                <div className="receipt-row">
                  <div className="receipt-col">
                    <p><strong>Name:</strong><br />{selectedPayment.admin_name}</p>
                  </div>
                  <div className="receipt-col">
                    <p><strong>Email:</strong><br />{selectedPayment.admin_email}</p>
                  </div>
                </div>
              </div>

              <div className="receipt-footer">
                <p><strong>Receipt ID:</strong> RCP{selectedPayment.id}</p>
                <p className="receipt-timestamp">Printed on: {new Date().toLocaleString('en-IN')}</p>
              </div>
            </div>

            <div className="receipt-bottom-line"></div>
            <p className="receipt-thank-you">Thank You for Your Payment</p>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default FeeStatement;

const styles = `
  /* Fee Filter Card Styling */
  .fee-filter-card {
    margin-bottom: 25px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border: none;
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
  }

  .filter-header {
    margin-bottom: 20px;
  }

  .filter-header h3 {
    color: white;
    margin: 0;
    font-size: 18px;
    font-weight: 600;
  }

  .filter-content {
    background: white;
    padding: 20px;
    border-radius: 8px;
  }

  .filter-row {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
    margin-bottom: 20px;
  }

  .filter-group {
    display: flex;
    flex-direction: column;
  }

  .filter-group label {
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .filter-input {
    padding: 10px 12px;
    border: 2px solid #e0e0e0;
    border-radius: 6px;
    font-size: 14px;
    transition: all 0.3s ease;
    font-family: inherit;
    width: 100%;
  }

  .filter-input:focus {
    outline: none;
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .filter-input::placeholder {
    color: #999;
  }

  .filter-actions {
    display: flex;
    gap: 12px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .filter-btn {
    padding: 10px 24px;
    font-weight: 500;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
  }

  .btn.btn-primary.filter-btn {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .btn.btn-primary.filter-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
  }

  .btn.btn-secondary.filter-btn {
    background: #f0f0f0;
    color: #333;
    border: 1px solid #ddd;
  }

  .btn.btn-secondary.filter-btn:hover {
    background: #e8e8e8;
    border-color: #999;
  }

  /* Pagination Styling */
  .fee-pagination-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    border-top: 1px solid #e0e0e0;
    flex-wrap: wrap;
    gap: 15px;
    background: #fafafa;
  }

  .pagination-left,
  .pagination-center,
  .pagination-controls {
    display: flex;
    align-items: center;
    gap: 15px;
  }

  .rows-per-page {
    display: flex;
    align-items: center;
    gap: 10px;
    font-weight: 500;
    color: #333;
    font-size: 13px;
  }

  .page-size-select {
    padding: 6px 12px;
    border: 2px solid #ddd;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 500;
    background: white;
    transition: all 0.3s ease;
  }

  .page-size-select:focus {
    outline: none;
    border-color: #667eea;
  }

  .page-info {
    color: #666;
    font-size: 13px;
  }

  .page-indicator {
    color: #666;
    font-weight: 500;
    font-size: 14px;
  }

  .pagination-controls {
    gap: 10px;
  }

  .btn.btn-pagination {
    padding: 8px 18px;
    border: 2px solid #667eea;
    background: white;
    color: #667eea;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
    font-size: 13px;
  }

  .btn.btn-pagination:hover:not(:disabled) {
    background: #667eea;
    color: white;
  }

  .btn.btn-pagination:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    border-color: #ccc;
    color: #999;
  }

  /* Modal Styling */
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    backdrop-filter: blur(3px);
  }

  .modal-content {
    background: white;
    border-radius: 12px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    width: 90%;
    max-width: 600px;
    max-height: 85vh;
    overflow-y: auto;
    animation: slideUp 0.3s ease;
  }

  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 2px solid #f0f0f0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }

  .modal-header h2 {
    color: white;
    margin: 0;
    font-size: 20px;
  }

  .modal-close {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: white;
    font-size: 24px;
    cursor: pointer;
    padding: 0;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
    transition: all 0.3s ease;
  }

  .modal-close:hover {
    background: rgba(255, 255, 255, 0.3);
  }

  .modal-body {
    padding: 30px 24px;
  }

  .detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
  }

  .detail-item {
    display: flex;
    flex-direction: column;
  }

  .detail-item label {
    font-weight: 600;
    color: #667eea;
    margin-bottom: 8px;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .detail-item p {
    color: #333;
    margin: 0;
    font-size: 15px;
    word-break: break-word;
    font-weight: 500;
  }

  .modal-footer {
    display: flex;
    gap: 12px;
    padding: 20px 24px;
    border-top: 2px solid #f0f0f0;
    background: #fafafa;
    justify-content: flex-end;
    flex-wrap: wrap;
  }

  .modal-footer .btn {
    padding: 10px 24px;
    font-weight: 500;
    border-radius: 6px;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
    font-size: 14px;
  }

  .modal-footer .btn-danger {
    background: #f44336;
    color: white;
  }

  .modal-footer .btn-danger:hover {
    background: #d32f2f;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
  }

  .modal-footer .btn-secondary {
    background: #e0e0e0;
    color: #333;
  }

  .modal-footer .btn-secondary:hover {
    background: #d0d0d0;
    transform: translateY(-2px);
  }

  /* Autocomplete Styles */
  .autocomplete-group {
    position: relative;
  }

  .autocomplete-wrapper {
    position: relative;
    width: 100%;
  }

  .autocomplete-dropdown {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 2px solid #667eea;
    border-top: none;
    border-radius: 0 0 8px 8px;
    max-height: 280px;
    overflow-y: auto;
    z-index: 100;
    box-shadow: 0 8px 16px rgba(102, 126, 234, 0.15);
  }

  .autocomplete-item {
    padding: 12px 16px;
    cursor: pointer;
    border-bottom: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: background-color 0.2s ease;
  }

  .autocomplete-item:last-child {
    border-bottom: none;
  }

  .autocomplete-item:hover {
    background-color: #f5f7ff;
  }

  .autocomplete-item strong {
    color: #333;
    font-size: 14px;
  }

  .class-badge {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    margin-left: 10px;
  }

  /* Receipt Styling */
  .receipt-container {
    display: none;
    position: absolute;
    top: 0;
    left: 0;
  }

  .receipt {
    width: 80mm;
    height: auto;
    margin: 0;
    padding: 0;
    font-family: 'Arial', sans-serif;
  }

  .receipt-header {
    text-align: center;
    padding: 8mm 5mm;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
  }

  .receipt-title {
    font-size: 14px;
    font-weight: bold;
    margin: 0 0 4px 0;
    letter-spacing: 1px;
  }

  .receipt-line {
    height: 1px;
    background: white;
    width: 90%;
    margin: 4px auto;
  }

  .receipt-body {
    padding: 6mm 5mm;
    font-size: 9px;
    line-height: 1.4;
  }

  .receipt-section {
    margin-bottom: 8px;
  }

  .receipt-section h3 {
    font-size: 10px;
    font-weight: bold;
    color: #333;
    margin: 0 0 5px 0;
    border-bottom: 1px solid #ddd;
    padding-bottom: 2px;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .receipt-section p {
    margin: 2px 0;
    color: #333;
  }

  .receipt-row {
    display: flex;
    gap: 10px;
    margin-bottom: 4px;
  }

  .receipt-col {
    flex: 1;
  }

  .amount {
    font-size: 13px;
    font-weight: bold;
    color: #667eea;
    margin-top: 2px;
  }

  .receipt-line-divider {
    border-top: 1px dashed #999;
    margin: 8px 0;
  }

  .receipt-footer {
    padding: 5px 0;
    text-align: center;
    font-size: 8px;
    border-top: 1px solid #ddd;
    margin-top: 8px;
  }

  .receipt-timestamp {
    color: #666;
    font-style: italic;
    margin-top: 2px;
  }

  .receipt-bottom-line {
    text-align: center;
    border-bottom: 2px solid #667eea;
    margin: 8px 5mm;
  }

  .receipt-thank-you {
    text-align: center;
    font-size: 10px;
    font-weight: bold;
    color: #667eea;
    margin: 6px 0 0 0;
    padding: 0 5mm;
  }

  /* Print Media Queries */
  @media print {
    * {
      -webkit-print-color-adjust: exact !important;
      print-color-adjust: exact !important;
      color-adjust: exact !important;
    }

    body {
      margin: 0;
      padding: 0;
      background: white;
    }

    .receipt-container {
      display: block;
      position: static;
      width: 100%;
      height: 100%;
    }

    .receipt {
      width: 100%;
      height: 100%;
      margin: 0;
      padding: 0;
      page-break-after: always;
    }

    /* Hide all elements except receipt during print */
    .list-page,
    .modal-overlay,
    .modal-content,
    nav,
    .btn,
    input,
    select {
      display: none !important;
    }
  }

  /* Responsive Design */
  @media (max-width: 768px) {
    .filter-row {
      grid-template-columns: 1fr;
    }

    .fee-pagination-section {
      flex-direction: column;
      align-items: stretch;
    }

    .pagination-left,
    .pagination-center,
    .pagination-controls {
      width: 100%;
      justify-content: center;
    }

    .modal-content {
      width: 95%;
    }

    .detail-grid {
      grid-template-columns: 1fr;
    }
  }
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.textContent = styles;
document.head.appendChild(styleSheet);
