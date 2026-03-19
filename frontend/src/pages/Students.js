import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { studentAPI } from '../utils/api';
import '../styles/list.css';

const Students = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStudents();
  }, [search, classFilter, currentPage]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const response = await studentAPI.getAll({
        search,
        class: classFilter,
        page: currentPage,
        limit: 10,
      });
      setStudents(response.data.data.students);
      setTotalPages(response.data.data.pages);
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
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
              placeholder="Search by name or Samagra ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
            />            <i className="fas fa-magnifying-glass"></i>            <select
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
                    <th>Class</th>
                    <th>Samagra ID</th>
                    <th>Mobile</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student._id}>
                      <td>{student.name}</td>
                      <td>{student.class}</td>
                      <td>{student.samagra_id}</td>
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

              <div className="pagination">
                {currentPage > 1 && (
                  <button onClick={() => setCurrentPage(currentPage - 1)}>← Previous</button>
                )}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    className={currentPage === page ? 'active' : ''}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </button>
                ))}
                {currentPage < totalPages && (
                  <button onClick={() => setCurrentPage(currentPage + 1)}>Next →</button>
                )}
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
