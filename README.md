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
  - Personal info: Name, Parents' names, Gender, Class, DOB, DOA, Caste, Category, Address
  - IDs: Aadhar, Samagra ID, Family ID
  - Parental info: Father's and Mother's Aadhar numbers
  - Banking: Account number, IFSC code, Bank name
  - Documents: File uploads
- **Advanced Search & Filters**: Filter by class, search by name or Samagra ID
- **Detailed Student Profiles**: Comprehensive student profiles with gender information
- **Gender Field**: Track student gender (Male/Female) in all forms and profiles

### Fee Management
- **Fee Payment Recording**: Admin-only feature to record student fee payments
  - Search students by name with autocomplete
  - Enter payment amount
  - Add payment remarks/notes
  - Auto-capture current date and admin information
- **Fee Statement**: Advanced payment tracking page
  - Search payments by student name (autocomplete)
  - Filter by student class
  - Filter by date range (From/To)
  - Pagination with configurable rows per page
  - Real-time filtering (no apply button needed)
- **Payment Details Modal**: View detailed payment information
  - Student and payment details
  - Admin who received the payment
  - Payment date and remarks
  - **Custom Receipt Printing**: Generate and print professional fee receipts (A4 or thermal paper size)
- **Admin Tracking**: Each payment records which admin processed it for accountability

### Dashboard
- Real-time statistics
- Students by class distribution
- Students by category breakdown
- Total counts for students and teachers

### UI/UX
- Modern, clean dashboard with sidebar navigation
- Responsive design for tablet and desktop
- Form validation (Aadhar: 12 digits, Mobile: 10 digits, IFSC validation, etc.)
- Professional styling with smooth transitions and gradients
- Font Awesome icons for consistent, professional appearance
- Intuitive button labels with icon indicators
- Real-time filters without reload

## 🛠️ Tech Stack

### Frontend
- **React 18**: Modern UI library
- **React Router**: Client-side routing
- **Axios**: HTTP client
- **CSS3**: Responsive styling
- **Font Awesome 6.4**: Professional icon library

### Backend
- **PHP 7.4+**: Server-side scripting language
- **MySQL 5.7+**: Relational database
- **JWT (JSON Web Tokens)**: Authentication
- **PHP MySQLi**: Database connection
- **CORS**: Cross-Origin Resource Sharing

## 📦 Prerequisites

- PHP 7.4 or higher (with MySQLi extension)
- MySQL 5.7 or higher
- XAMPP, WAMP, or MAMP (local server)
- Node.js v14+ (for frontend development)
- npm or yarn

## 🔧 Installation & Setup

### Backend Setup (PHP + MySQL)

1. Copy backend files to web server root:
   - **XAMPP**: Copy `backend-php` folder to `C:\xampp\htdocs\school-project\backend-php`
   - **WAMP**: Copy `backend-php` folder to `C:\wamp64\www\school-project\backend-php`
   - **MAMP**: Copy `backend-php` folder to `/Applications/MAMP/htdocs/school-project/backend-php`

2. Create the database via PhpMyAdmin:
   - Open `http://localhost/phpmyadmin`
   - Go to **SQL** tab
   - Copy and paste contents of `backend-php/database/schema.sql`
   - Click **Go**

3. Seed dummy data via PhpMyAdmin:
   - In the same SQL tab
   - Copy and paste contents of `backend-php/database/seed.sql`
   - Click **Go**

4. (Optional) Configure database connection:
   - Edit `backend-php/config/Database.php` if needed:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'root');
   define('DB_PASS', '');
   define('DB_NAME', 'school_management');
   define('JWT_SECRET', 'your_unique_secret_key');
   ```

5. Test the backend:
   - Open `http://localhost/school-project/backend-php/api/index.php?request=health`
   - Should return: `{"success":true,"message":"Server is running"}`

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
REACT_APP_API_URL=http://localhost/school-project/backend-php/api
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

### Fee Payments
- `GET /api/fee-payments` - Get all fee payments (with search, class filter, date range, pagination)
- `POST /api/fee-payments` - Record new fee payment (auto-captures admin ID)
- `GET /api/fee-payments/:id` - Get payment details
- `PUT /api/fee-payments/:id` - Update fee payment
- `DELETE /api/fee-payments/:id` - Delete fee payment

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
- Personal: Name, Parents' names, Gender, Class, DOB, DOA, Caste, Category, Address, Mobile
- IDs: Aadhar, Samagra ID, Family ID
- Parental: Aadhar numbers
- Banking: Account, IFSC, Bank name
- Documents: Array of uploaded files
- Timestamps

### Fee Payments
- Payment ID, Student ID, Admin ID, Amount, Remarks, Payment Date
- Tracks which admin recorded the payment
- Timestamps (Created at, Updated at)

## 💳 Fee Management Features
- **Payment Recording**: Admins can record student fee payments with details
- **Payment Tracking**: Each payment is associated with the admin who recorded it
- **Advanced Reporting**: Search, filter by class/date, and paginate through payments
- **Receipt Generation**: Print professional receipts for payments
- **Real-time Filters**: Filters work instantly as you type (student name) or select (class, dates)

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
school-project/
├── backend-php/
│   ├── api/
│   │   ├── index.php                # Main API handler
│   │   └── .htaccess                # URL rewriting
│   ├── config/
│   │   └── Database.php             # Database configuration
│   ├── includes/
│   │   ├── Auth.php                 # JWT authentication
│   │   └── Validation.php           # Input validation
│   └── database/
│       ├── schema.sql               # Database schema
│       └── seed.sql                 # Dummy data
│
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Layout.js
    │   │   ├── ProtectedRoute.js
    │   │   └── StudentSearch.js
    │   ├── pages/
    │   │   ├── Login.js
    │   │   ├── Dashboard.js
    │   │   ├── Teachers.js
    │   │   ├── TeacherForm.js
    │   │   ├── TeacherDetail.js
    │   │   ├── Students.js
    │   │   ├── StudentForm.js
    │   │   ├── StudentDetail.js
    │   │   ├── FeePayment.js
    │   │   └── FeeStatement.js
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

### Cannot connect to database
- Ensure MySQL is running on your system
- Check that credentials in `backend-php/config/Database.php` are correct
- Verify database exists in PhpMyAdmin
- If database doesn't exist, run schema.sql from PhpMyAdmin

### API returns 404
- Verify that backend-php folder is in your web server root directory
- Ensure PHP is running (XAMPP/WAMP/MAMP started)
- Check that the API URL in frontend .env matches your server configuration

### CORS Error
- Ensure backend API URL in frontend .env is correct
- CORS headers are enabled in the PHP backend
- Check for any typos in the API URL

### Form Validation Errors
- Ensure inputs match the validation rules (Aadhar: 12 digits, Mobile: 10 digits, etc.)
- Check browser console (F12) for detailed error messages
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
