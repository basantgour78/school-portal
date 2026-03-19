# Quick Start Guide for School Management Portal (PHP Version)

## Prerequisites
- XAMPP, WAMP, or MAMP installed with PHP 7.4+
- MySQL/PhpMyAdmin
- Node.js v14+ (for frontend React development)
- Git (optional)

## Step-by-Step Setup

### 1. Backend Setup (PHP + MySQL)

```bash
# Copy backend-php folder to your web server root
# For XAMPP: C:\xampp\htdocs\school-project\backend-php
# For WAMP: C:\wamp64\www\school-project\backend-php
# For MAMP: /Applications/MAMP/htdocs/school-project/backend-php

# Then in PhpMyAdmin:
# 1. Open http://localhost/phpmyadmin
# 2. Go to SQL tab
# 3. Paste contents of backend-php/database/schema.sql and run
# 4. Paste contents of backend-php/database/seed.sql and run
```

### 2. Frontend Setup (New Terminal/Command Prompt)

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the frontend development server
npm start
```

Frontend will open automatically at: **http://localhost:3000**

## 3. Login to Application

Once frontend is running:

1. Frontend opens at http://localhost:3000
2. You'll see the login page
3. Use these credentials:
   - **Email**: admin@school.com
   - **Password**: admin123

## 4. What You Can Do

### Dashboard
- View statistics about students and teachers
- See students distribution by class
- See students distribution by category

### Teachers Management
- ✅ Add new teachers (name, subject, email, mobile)
- ✅ List all teachers with search functionality
- ✅ View teacher details
- ✅ Edit teacher information
- ✅ Delete teachers

### Students Management
- ✅ Add comprehensive student records with:
  - Personal info (name, parents, gender, class, DOB, address, etc.)
  - ID documents (Aadhar, Samagra ID, Family ID)
  - Parental information (parents' Aadhar)
  - Banking details (optional)
- ✅ List students with filtering and search
- ✅ Student list shows gender icon, father name, and Aadhar number
- ✅ View detailed student profiles with gender
- ✅ Edit student information
- ✅ Delete students

### Fee Management
- ✅ Record Fee Payments
  - Search and select student by name (autocomplete)
  - Enter payment amount
  - Add remarks/notes
  - Admin automatically tracked for accountability
- ✅ Fee Statement
  - Search payments by student name (real-time autocomplete)
  - Filter by class (real-time)
  - Filter by date range (real-time)
  - Paginate through large payment lists
  - Show admin name in the payment list
  - View payment details in modal
  - **Print professional fee receipts** with all payment details
- ✅ Fee Details
  - Filter by student, class, admin, and date range
  - See total collection, total payments, average payment, and unique students
  - Review admin-wise fee totals
  - Open full payment details in popup view

## 5. Sample Data

The application comes with pre-populated sample data:

**Teachers**:
- John Smith (Mathematics)
- Sarah Johnson (English)
- Michael Brown (Science)
- Emily Davis (History)
- David Wilson (Physical Education)

**Students**: 6 sample students across different classes and categories with gender information

**Fee Payments**: 9 sample payment records for various students

## 5.1 UI/UX Features

The application features a modern, professional interface with:
- **Font Awesome Icons**: Professional icon library for all buttons and navigation
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Gradient Styling**: Modern gradient backgrounds on cards and headers
- **Real-time Filters**: Fee statement filters update instantly as you type
- **Autocomplete Search**: Student selection with intelligent dropdown suggestions
- **Modal Details**: View payment and student information in modal popups
- **Professional Receipts**: Printable payment receipts styled for A4 or thermal printing

## 6. API Endpoints Quick Reference

### Authentication
- POST /api/auth/login - Admin login
- GET /api/auth/me - Get current admin

### Teachers
- GET /api/teachers - List all
- POST /api/teachers - Create new
- GET /api/teachers/:id - Get one
- PUT /api/teachers/:id - Update
- DELETE /api/teachers/:id - Delete

### Students
- GET /api/students - List all
- POST /api/students - Create new
- GET /api/students/:id - Get one
- PUT /api/students/:id - Update
- DELETE /api/students/:id - Delete

### Fee Payments
- GET /api/fee-payments - List all (with search & filters)
- GET /api/fee-payments/summary - Get fee totals and admin-wise summary
- POST /api/fee-payments - Record payment
- GET /api/fee-payments/:id - Get payment details
- PUT /api/fee-payments/:id - Update payment
- DELETE /api/fee-payments/:id - Delete payment

## 7. Validation Rules

When filling forms, remember:
- **Mobile Number**: Exactly 10 digits
- **Aadhar Number**: Exactly 12 digits
- **IFSC Code**: Format like HDFC0000123 (4 letters + 0 + 6 alphanumeric)
- **Email**: Valid email format
- **Account Number**: 9-18 digits
- **Gender**: Male or Female

## 8. Troubleshooting

### "Cannot connect to database"
- Make sure MySQL is running
- Open PhpMyAdmin: http://localhost/phpmyadmin
- Check that school_management database exists
- If not, run the schema.sql file from PhpMyAdmin

### "Cannot GET /"
- Make sure frontend is running on http://localhost:3000
- Check that backend files are in correct web root
- Verify backend API URL in frontend

### "API returns 404"
- Verify backend-php folder is in web root
- Check that PHP is running (XAMPP/WAMP/MAMP started)
- Test API: http://localhost/school-project/backend-php/api/index.php?request=health

### "Login fails"
- Verify database is seeded with dummy data
- Check admin table in PhpMyAdmin
- Use correct credentials: admin@school.com / admin123

### "Port 3000 is already in use"
- Kill the process using port 3000, or
- Specify a different port: PORT=3001 npm start

## 9. Features Overview

**Admin Login System**
- Secure authentication with JWT tokens
- Session management
- Auto-logout functionality

**Teacher Management**
- CRUD operations (Create, Read, Update, Delete)
- Search and filter
- Pagination support

**Student Management**
- Comprehensive form with 15+ fields including gender
- Validation for all critical fields
- Advanced filtering by class
- Search by name or Aadhar number
- Detailed student profiles

**Fee Payment System**
- Record and track student fee payments
- Admin accountability for each payment
- Advanced filtering and search
- Separate Fee Details report with totals and admin-wise breakdown
- Professional receipt printing
- Payment history and detailed view

**Dashboard**
- Real-time statistics
- Visual breakdown of student distribution
- Quick overview of system

## 10. Need More Help?

Check these files for detailed instructions:
- **PHP_SETUP.md** - Detailed PHP backend setup
- **PHP_BACKEND_README.md** - Backend API and features documentation
- **README.md** - Complete project documentation

---

Enjoy using the School Management Portal! 🎓
