import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { teacherAPI } from '../utils/api';
import '../styles/list.css';

const Teachers = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTeachers();
  }, [search, currentPage, pageSize]);

  const fetchTeachers = async () => {
    setLoading(true);
    try {
      const response = await teacherAPI.getAll({
        search,
        page: currentPage,
        limit: pageSize,
      });

      setTeachers(response.data.data.teachers || []);
      setTotalPages(response.data.data.pages || 1);
      setTotalTeachers(response.data.data.total || 0);
    } catch (error) {
      console.error('Error fetching teachers:', error);
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
    if (window.confirm('Are you sure you want to delete this teacher?')) {
      try {
        await teacherAPI.delete(id);
        fetchTeachers();
      } catch (error) {
        alert(`Error: ${error.response?.data?.message || 'Failed to delete'}`);
      }
    }
  };

  return (
    <Layout>
      <div className="list-page">
        <div className="list-header">
          <h1>Teachers Management</h1>
          <button
            className="btn btn-primary"
            onClick={() => navigate('/teachers/add')}
          >
            <i className="fas fa-plus"></i> Add New Teacher
          </button>
        </div>

        <div className="card">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by name, subject, or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />
            <i className="fas fa-magnifying-glass"></i>
          </div>

          {loading ? (
            <div className="spinner"></div>
          ) : teachers.length > 0 ? (
            <>
              <table className="table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Subject</th>
                    <th>Email</th>
                    <th>Mobile</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {teachers.map((teacher) => (
                    <tr key={teacher._id}>
                      <td>{teacher.name}</td>
                      <td>{teacher.subject}</td>
                      <td>{teacher.email}</td>
                      <td>{teacher.mobileNumber}</td>
                      <td>
                        <div className="action-buttons">
                          <button
                            className="btn btn-primary"
                            onClick={() => navigate(`/teachers/${teacher._id}`)}
                          >
                            <i className="fas fa-eye"></i> View
                          </button>
                          <button
                            className="btn btn-secondary"
                            onClick={() => navigate(`/teachers/edit/${teacher._id}`)}
                          >
                            <i className="fas fa-pen"></i> Edit
                          </button>
                          <button
                            className="btn btn-danger"
                            onClick={() => handleDelete(teacher._id)}
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
                  <span className="page-info">Total: {totalTeachers} teachers</span>
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
            <div className="alert alert-info">No teachers found. Add a new teacher to get started!</div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Teachers;
