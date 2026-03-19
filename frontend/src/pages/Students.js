import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { studentAPI } from '../utils/api';
import '../styles/list.css';

const getGenderIconClass = (gender) => {
  if (gender === 'Male') return 'fas fa-mars';
  if (gender === 'Female') return 'fas fa-venus';
  return 'fas fa-user';
};

const Students = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalStudents, setTotalStudents] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [search, classFilter, currentPage, pageSize]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await studentAPI.getAll({
        search,
        class: classFilter,
        page: currentPage,
        limit: pageSize,
      });

      setStudents(response.data.data.students || []);
      setTotalPages(response.data.data.pages || 1);
      setTotalStudents(response.data.data.total || 0);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        await studentAPI.delete(id);
        fetchStudents();
      } catch (error) {
        alert(`Error: ${error.response?.data?.message || 'Failed to delete'}`);
      }
    }
  };

  return (
    <Layout>
      <div className="list-page">
        <div className="list-header">
          <h1>Students Management</h1>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/students/add')}
          >
            <i className="fas fa-plus"></i> Add New Student
          </button>
        </div>

        <div className="card">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by name or Aadhar No..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <i className="fas fa-magnifying-glass"></i>
            <select
              value={classFilter}
              onChange={(e) => {
                setClassFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="">All Classes</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((c) => (
                <option key={c} value={c}>
                  Class {c}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="spinner"></div>
          ) : students.length > 0 ? (
            <>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Father Name</th>
                    <th>Class</th>
                    <th>Aadhar No</th>
                    <th>Mobile</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td>
                        <span className="name-with-gender">
                          <i
                            className={`${getGenderIconClass(student.gender)} gender-icon gender-icon-${(student.gender || '').toLowerCase()}`}
                            aria-hidden="true"
                          ></i>
                          <span>{student.name}</span>
                        </span>
                      </td>
                      <td>{student.fatherName}</td>
                      <td>{student.class}</td>
                      <td>{student.aadharNumber}</td>
                      <td>{student.mobileNumber}</td>
                      <td>
                        <span className="badge badge-warning">{student.category}</span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-primary"
                            onClick={() => navigate(`/students/${student._id}`)}
                          >
                            <i className="fas fa-eye"></i> View
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => navigate(`/students/edit/${student._id}`)}
                          >
                            <i className="fas fa-pen"></i> Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(student._id)}
                          >
                            <i className="fas fa-trash"></i> Delete
                          </button>
                        </div>
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
                  <span className="page-info">Total: {totalStudents} students</span>
                </div>

                <div className="pagination-center">
                  <span className="page-indicator">
                    Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                  </span>
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
          ) : (
            <div className="alert alert-info">No students found. Add a new student to get started!</div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Students;
