import React, { useState, useMemo } from 'react';
import './StudentSearch.css';

const StudentSearch = ({ 
  students = [], 
  value = '', 
  onChange = () => {}, 
  onSelect = () => {},
  placeholder = 'Search student by name...',
  label = 'Select Student',
  required = false
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  // Filter students for autocomplete
  const filteredStudents = useMemo(() => {
    if (!value.trim()) return [];
    return students.filter((student) =>
      student.name.toLowerCase().includes(value.toLowerCase())
    ).slice(0, 8);
  }, [value, students]);

  const handleSelect = (student) => {
    onChange(student.name);
    onSelect(student);
    setShowDropdown(false);
  };

  return (
    <div className="student-search-group">
      <label>
        {label} {required && <span className="required">*</span>}
      </label>
      <div className="student-search-wrapper">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setShowDropdown(true);
          }}
          onFocus={() => setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          className="student-search-input"
          autoComplete="off"
        />
        
        {showDropdown && filteredStudents.length > 0 && (
          <div className="student-search-dropdown">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="student-search-item"
                onClick={() => handleSelect(student)}
              >
                <div className="student-name">{student.name}</div>
                <div className="student-meta">
                  <span className="class-badge">Class {student.class}</span>
                  <span className="aadhar-badge">{student.aadharNumber}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {showDropdown && value.trim() && filteredStudents.length === 0 && (
          <div className="student-search-empty">
            No students found
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSearch;
