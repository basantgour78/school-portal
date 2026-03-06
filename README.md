# School Management Web Portal

A comprehensive web application for managing school operations including teacher and student management with secure admin authentication.

## 🚀 Features

### Authentication
- Secure Admin Login with JWT authentication
- Password hashing with bcryptjs
- Session management with tokens

### Teacher Management
- **Add/Update Teachers**: Manage teacher records with name, subject, email, and mobile number
- **Search & Filter**: Searchable table with pagination
- **Detailed Profiles**: View complete teacher information with printable profiles

### Student Management
- **Comprehensive Student Registration**: 
  - Personal info: Name, Parents' names, Class, DOB, DOA, Caste, Category, Address
  - IDs: Aadhar, Samagra ID, Family ID
  - Parental info: Father's and Mother's Aadhar numbers
  - Banking: Account number, IFSC code, Bank name
  - Documents: File uploads
- **Advanced Search & Filters**: Filter by class, search by name or Samagra ID
- **Detailed Student Profiles**: Comprehensive, printable student profiles

### Dashboard
- Real-time statistics
- Students by class distribution
- Students by category breakdown
- Total counts for students and teachers

### UI/UX
- Modern, clean dashboard with sidebar navigation
- Responsive design for tablet and desktop
- Form validation (Aadhar: 12 digits, Mobile: 10 digits, IFSC validation, etc.)
- Professional styling with smooth transitions
- Printable profiles

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern UI library
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **CSS3**: Responsive styling

### Backend
- **Node.js & Express**: Server and API
- **MongoDB & Mongoose**: Database and ODM
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **CORS**: Cross-Origin Resource Sharing

## 📦 Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB (local or Atlas)

## 🔧 Installation & Setup

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file with the following variables:
```env
MONGODB_URI=mongodb://localhost:27017/school_management
JWT_SECRET=your_jwt_secret_key_change_this_in_production
PORT=5000
NODE_ENV=development
ADMIN_EMAIL=admin@school.com
ADMIN_PASSWORD=admin123
```

4. Seed dummy data:
```bash
node seeders/seed.js
```

5. Start the server:
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm start
```

The frontend will open at `http://localhost:3000`

## 📋 Demo Credentials

- **Email**: admin@school.com
- **Password**: admin123

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register admin (one-time setup)
- `POST /api/auth/login` - Login admin
- `GET /api/auth/me` - Get current admin (Protected)

### Teachers
- `GET /api/teachers` - Get all teachers (with pagination & search)
- `POST /api/teachers` - Create new teacher
- `GET /api/teachers/:id` - Get teacher by ID
- `PUT /api/teachers/:id` - Update teacher
- `DELETE /api/teachers/:id` - Delete teacher

### Students
- `GET /api/students` - Get all students (with filters & search)
- `POST /api/students` - Create new student
- `GET /api/students/:id` - Get student by ID
- `PUT /api/students/:id` - Update student
- `DELETE /api/students/:id` - Delete student
- `GET /api/students/statistics/summary` - Get statistics

## 🔐 Validation Rules

- **Mobile Number**: Must be exactly 10 digits
- **Aadhar Number**: Must be exactly 12 digits
- **IFSC Code**: Must follow format (e.g., HDFC0000123)
- **Email**: Must be valid email format
- **Account Number**: 9-18 digits
- **DOB**: Student must be at least 3 years old

## 📄 Database Schema

### Admin
- Name, Email, Password (hashed), Role, Timestamps

### Teacher
- Name, Subject, Email, Mobile Number, ProfileImage, Timestamps

### Student
- Personal: Name, Parents' names, Class, DOB, DOA, Caste, Category, Address, Mobile
- IDs: Aadhar, Samagra ID, Family ID
- Parental: Aadhar numbers
- Banking: Account, IFSC, Bank name
- Documents: Array of uploaded files
- Timestamps

## 🖨️ Printable Profiles

Both teacher and student profiles can be printed with the print button. The styles automatically hide navigation elements during printing.

## 🚀 Deployment

### Backend (Heroku/Railway/Render)
1. Set environment variables on the platform
2. Deploy using git push or platform CLI
3. Ensure MongoDB is accessible from deployment platform

### Frontend (Vercel/Netlify)
1. Set `REACT_APP_API_URL` environment variable
2. Deploy using git push or platform CLI
3. Ensure CORS is properly configured on backend

## 📝 File Structure

```
school-portal/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── Admin.js
│   │   ├── Teacher.js
│   │   └── Student.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── teachers.js
│   │   └── students.js
│   ├── middleware/
│   │   └── auth.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── teacherController.js
│   │   └── studentController.js
│   ├── seeders/
│   │   └── seed.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Layout.js
    │   │   └── ProtectedRoute.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Dashboard.js
    │   │   ├── Teachers.js
    │   │   ├── TeacherForm.js
    │   │   ├── TeacherDetail.js
    │   │   ├── Students.js
    │   │   ├── StudentForm.js
    │   │   └── StudentDetail.js
    │   ├── utils/
    │   │   ├── api.js
    │   │   └── validation.js
    │   ├── styles/
    │   │   ├── global.css
    │   │   ├── layout.css
    │   │   ├── auth.css
    │   │   ├── dashboard.css
    │   │   ├── list.css
    │   │   ├── form.css
    │   │   └── profile.css
    │   ├── App.js
    │   └── index.js
    ├── .env
    └── package.json
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running on your system
- Verify MONGODB_URI in .env file
- For MongoDB Atlas, ensure IP is whitelisted

### CORS Error
- Check that backend URL in frontend .env is correct
- Verify CORS is enabled in Express backend
- Check for network/firewall issues

### Form Validation Errors
- Ensure inputs match the validation rules
- Check browser console for detailed error messages
- Verify all required fields are filled

## 📬 Future Enhancements

- File upload for student documents
- Email notifications
- Bulk import/export of student data
- Advanced analytics and reporting
- Mobile app version
- Multi-language support
- Teacher performance tracking

## 📄 License

This project is open source and available under the MIT License.

## 👨‍💻 Author

Created as a comprehensive school management system for educational institutions.

---

**Happy Managing! 🎓**
