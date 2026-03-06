# Quick Start Guide for School Management Portal

## Prerequisites
- Install Node.js (v14+): https://nodejs.org/
- Install MongoDB Community Edition or use MongoDB Atlas: https://www.mongodb.com/
- Git (optional)

## Step-by-Step Setup

### 1. Backend Setup (Terminal/Command Prompt)

```bash
# Navigate to backend folder
cd backend

# Install dependencies
npm install

# The .env file is already configured, but you can modify it if needed
# For MongoDB Atlas, update MONGODB_URI in .env

# Seed database with dummy data
npm run seed

# Start the backend server
npm run dev
```

Backend will run on: **http://localhost:5000**

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

Once both servers are running:

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
- ✅ Print teacher profiles

### Students Management
- ✅ Add comprehensive student records with:
  - Personal info (name, parents, class, DOB, address, etc.)
  - ID documents (Aadhar, Samagra ID, Family ID)
  - Parental information (parents' Aadhar)
  - Banking details (optional)
- ✅ List students with filtering and search
- ✅ View detailed student profiles
- ✅ Edit student information
- ✅ Delete students
- ✅ Print student profiles

## 5. Sample Data

The application comes with pre-populated sample data:

**Teachers**:
- John Smith (Mathematics)
- Sarah Johnson (English)
- Michael Brown (Science)
- Emily Davis (History)
- David Wilson (Physical Education)

**Students**: 6 sample students across different classes and categories

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

## 7. Validation Rules

When filling forms, remember:
- **Mobile Number**: Exactly 10 digits
- **Aadhar Number**: Exactly 12 digits
- **IFSC Code**: Format like HDFC0000123 (4 letters + 0 + 6 alphanumeric)
- **Email**: Valid email format
- **Account Number**: 9-18 digits

## 8. Troubleshooting

### "Cannot connect to MongoDB"
- Make sure MongoDB is running on your system
- Or update MONGODB_URI to your MongoDB Atlas connection string

### "Cannot GET /"
- Make sure both frontend and backend are running
- Frontend should be on http://localhost:3000
- Backend should be on http://localhost:5000

### "Port already in use"
- Change PORT in backend/.env (default: 5000)
- Frontend uses port 3000 by default, or you can specify PORT=3001 npm start

### "Login failed"
- Verify MongoDB is running and has seeded data
- Run: npm run seed (in backend folder)
- Check .env file credentials

## 9. For Production

Before deploying:
1. Change JWT_SECRET in backend/.env
2. Update MONGODB_URI to production database
3. Set NODE_ENV=production
4. Update REACT_APP_API_URL in frontend/.env
5. Build frontend: npm run build
6. Deploy to your hosting platform

## 10. Features Overview

**Admin Login System**
- Secure authentication with JWT tokens
- Session management
- Auto-logout functionality

**Teacher Management**
- CRUD operations (Create, Read, Update, Delete)
- Search and filter
- Pagination support
- Printable profiles

**Student Management**
- Comprehensive form with 15+ fields
- Validation for all critical fields
- Advanced filtering by class
- Search by name or Samagra ID
- Detailed student profiles
- Printable student information

**Dashboard**
- Real-time statistics
- Visual breakdown of student distribution
- Quick overview of system

## 11. Need More Help?

Check the main README.md file in the project root for:
- Detailed API documentation
- Database schema information
- Deployment instructions
- Future enhancement ideas

---

Enjoy using the School Management Portal! 🎓
