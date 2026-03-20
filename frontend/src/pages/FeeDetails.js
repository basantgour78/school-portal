import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { feePaymentAPI, studentAPI } from '../utils/api';
import '../styles/list.css';

const getGenderIconClass = (gender) => {
  if (gender === 'Male') return 'fas fa-mars';
  if (gender === 'Female') return 'fas fa-venus';
  return 'fas fa-user';
};

const formatCurrency = (value) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const FeeDetails = () => {
  const navigate = useNavigate();
  const [payments, setPayments] = useState([]);
  const [summary, setSummary] = useState({
    totalPayments: 0,
    totalAmount: 0,
    averageAmount: 0,
    uniqueStudents: 0,
  });
  const [adminBreakdown, setAdminBreakdown] = useState([]);
  const [adminOptions, setAdminOptions] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedAdminId, setSelectedAdminId] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const searchTimeoutRef = useRef(null);

  const filterParams = useMemo(() => {
    const params = {
      page: currentPage,
      limit: pageSize,
      search: searchTerm || undefined,
      class: selectedClass || undefined,
      adminId: selectedAdminId || undefined,
      fromDate: fromDate || undefined,
      toDate: toDate || undefined,
    };

    Object.keys(params).forEach((key) => params[key] === undefined && delete params[key]);
    return params;
  }, [currentPage, pageSize, searchTerm, selectedClass, selectedAdminId, fromDate, toDate]);

  const summaryParams = useMemo(() => {
    const { page, limit, ...rest } = filterParams;
    return rest;
  }, [filterParams]);

  useEffect(() => {
    fetchPageData();
  }, [filterParams, summaryParams]);

  const fetchPageData = async () => {
    setLoading(true);
    setMessage('');
    try {
      const [paymentsResponse, summaryResponse] = await Promise.all([
        feePaymentAPI.getAll(filterParams),
        feePaymentAPI.getSummary(summaryParams),
      ]);

      setPayments(paymentsResponse.data.data.payments || []);
      setTotalPages(paymentsResponse.data.data.pagination?.total_pages || 1);
      setSummary(summaryResponse.data.data.summary || {});
      setAdminBreakdown(summaryResponse.data.data.paymentsByAdmin || []);
      setAdminOptions(summaryResponse.data.data.admins || []);
    } catch (error) {
      setMessage(`Error: ${error.response?.data?.message || 'Failed to load fee details'}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchWithDebounce = (value) => {
    if (selectedStudent) {
      return;
    }

    setSearchTerm(value);
    setShowSearchDropdown(true);
    setCurrentPage(1);

    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (!value.trim()) {
      setSearchResults([]);
      setShowSearchDropdown(false);
      return;
    }

    setSearchLoading(true);

    searchTimeoutRef.current = setTimeout(async () => {
      try {
        const response = await studentAPI.getAll({
          search: value.trim(),
          limit: 10,
        });
        setSearchResults(response.data.data.students || []);
      } catch (error) {
        setSearchResults([]);
      } finally {
        setSearchLoading(false);
      }
    }, 300);
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedStudent(null);
    setSelectedClass('');
    setSelectedAdminId('');
    setFromDate('');
    setToDate('');
    setCurrentPage(1);
    setSearchResults([]);
    setShowSearchDropdown(false);
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

  const handlePrintReceipt = () => {
    setTimeout(() => {
      window.print();
    }, 100);
  };

  return (
    <Layout>
      <div className="list-page">
        <div className="list-header">
          <h1>Fee Details</h1>
          <div className="header-actions">
            <button className="btn btn-primary" onClick={() => navigate('/fee-payment')}>
              <i className="fas fa-plus"></i> Add New Payment
            </button>
          </div>
        </div>

        {message && (
          <div className={`alert ${message.includes('Error') ? 'alert-error' : 'alert-success'}`}>
            {message}
          </div>
        )}

        <div className="card fee-filter-card">
          <div className="filter-header">
            <h3><i className="fas fa-filter"></i> Detailed Fee Filters</h3>
          </div>

          <div className="filter-content">
            <div className="filter-row">
              <div className="filter-group autocomplete-group">
                <label>Search Student</label>
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
                        setCurrentPage(1);
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
                            <strong className="name-with-gender">
                              <i
                                className={`${getGenderIconClass(student.gender)} gender-icon gender-icon-${(student.gender || '').toLowerCase()}`}
                                aria-hidden="true"
                              ></i>
                              <span>{student.name}</span>
                            </strong>
                            <span className="class-badge">Class {student.class}</span>
                          </div>
                        ))
                      ) : searchTerm.trim() ? (
                        <div className="autocomplete-empty">No students found</div>
                      ) : null}
                    </div>
                  )}
                </div>
              </div>

              <div className="filter-group">
                <label>Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => {
                    setSelectedClass(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="filter-input"
                >
                  <option value="">All Classes</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((item) => (
                    <option key={item} value={item}>
                      Class {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>Received By</label>
                <select
                  value={selectedAdminId}
                  onChange={(e) => {
                    setSelectedAdminId(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="filter-input"
                >
                  <option value="">All Admins</option>
                  {adminOptions.map((admin) => (
                    <option key={admin.id} value={admin.id}>
                      {admin.name}
                    </option>
                  ))}
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
              <button className="btn btn-secondary filter-btn" onClick={resetFilters}>
                <i className="fas fa-rotate-right"></i> Reset
              </button>
            </div>
          </div>
        </div>

        <div className="fee-summary-grid">
          <div className="stat-card fee-stat-card">
            <div className="stat-icon">
              <i className="fas fa-money-bill-wave"></i>
            </div>
            <div className="stat-content">
              <h3>Total Collection</h3>
              <p className="stat-number">{formatCurrency(summary.totalAmount)}</p>
            </div>
          </div>
          <div className="stat-card fee-stat-card">
            <div className="stat-icon">
              <i className="fas fa-receipt"></i>
            </div>
            <div className="stat-content">
              <h3>Total Payments</h3>
              <p className="stat-number">{summary.totalPayments || 0}</p>
            </div>
          </div>
          {/* <div className="stat-card fee-stat-card">
            <div className="stat-content">
              <h3>Average Payment</h3>
              <p className="stat-number">{formatCurrency(summary.averageAmount)}</p>
            </div>
          </div> */}
          <div className="stat-card fee-stat-card">
            <div className="stat-icon">
              <i className="fas fa-users"></i>
            </div>
            <div className="stat-content">
              <h3>Students Covered</h3>
              <p className="stat-number">{summary.uniqueStudents || 0}</p>
            </div>
          </div>
        </div>

        <div className="fee-details-grid">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Filtered Fee Entries</h3>
            </div>

            {loading && payments.length === 0 ? (
              <div className="spinner"></div>
            ) : payments.length === 0 ? (
              <div className="empty-state">
                <p>No fee entries found for these filters.</p>
              </div>
            ) : (
              <>
                <table className="table">
                  <thead>
                    <tr>
                      <th>Student Name</th>
                      <th>Father Name</th>
                      <th>Class</th>
                      <th>Mobile No</th>
                      <th>Amount</th>
                      <th>Payment Date</th>
                      <th>Received By</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((payment) => (
                      <tr key={payment.id}>
                        <td>
                          <span className="name-with-gender">
                            <i
                              className={`${getGenderIconClass(payment.gender)} gender-icon gender-icon-${(payment.gender || '').toLowerCase()}`}
                              aria-hidden="true"
                            ></i>
                            <span>{payment.student_name}</span>
                          </span>
                        </td>
                        <td>{payment.fatherName || '-'}</td>
                        <td>{payment.class}</td>
                        <td>{payment.mobileNumber}</td>
                        <td>{formatCurrency(payment.amount)}</td>
                        <td>{new Date(payment.payment_date).toLocaleDateString('en-IN')}</td>
                        <td>{payment.admin_name}</td>
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

                <div className="fee-pagination-section">
                  <div className="pagination-left">
                    <label className="rows-per-page">
                      Rows per page:
                      <select
                        value={pageSize}
                        onChange={(e) => {
                          setPageSize(parseInt(e.target.value, 10));
                          setCurrentPage(1);
                        }}
                        className="page-size-select"
                      >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                      </select>
                    </label>
                    <span className="page-info">Total: {summary.totalPayments || 0} filtered payments</span>
                  </div>

                  <div className="pagination-center">
                    <span className="page-indicator">
                      Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                    </span>
                  </div>

                  <div className="pagination-controls">
                    <button
                      className="btn btn-pagination"
                      onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <i className="fas fa-chevron-left"></i> Previous
                    </button>
                    <button
                      className="btn btn-pagination"
                      onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Next <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">Collection by Admin</h3>
            </div>

            {adminBreakdown.length === 0 ? (
              <div className="empty-state">
                <p>No admin totals available.</p>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Admin</th>
                    <th>Payments</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {adminBreakdown.map((item) => (
                    <tr key={item.admin_id}>
                      <td>{item.admin_name}</td>
                      <td>{item.payment_count}</td>
                      <td>{formatCurrency(item.total_amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

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
                    <p className="name-with-gender">
                      <i
                        className={`${getGenderIconClass(selectedPayment.gender)} gender-icon gender-icon-${(selectedPayment.gender || '').toLowerCase()}`}
                        aria-hidden="true"
                      ></i>
                      <span>{selectedPayment.student_name}</span>
                    </p>
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
                    <p>{formatCurrency(selectedPayment.amount)}</p>
                  </div>
                  <div className="detail-item">
                    <label>Payment Date:</label>
                    <p>{new Date(selectedPayment.payment_date).toLocaleDateString('en-IN')}</p>
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
                    <div className="detail-item detail-item-wide">
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

      </div>

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
                    <p>
                      <strong>Student Name:</strong>
                      <br />
                      <span className="name-with-gender">
                        <i
                          className={`${getGenderIconClass(selectedPayment.gender)} gender-icon gender-icon-${(selectedPayment.gender || '').toLowerCase()}`}
                          aria-hidden="true"
                        ></i>
                        <span>{selectedPayment.student_name}</span>
                      </span>
                    </p>
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
                    <p className="amount">{formatCurrency(selectedPayment.amount)}</p>
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

export default FeeDetails;
