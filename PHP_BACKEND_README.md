# 🎓 School Management Portal - PHP + MySQL Setup

## ✅ What's Complete

- ✅ **React Frontend** - Fully working with all features
- ✅ **PHP Backend** - RESTful API with JWT authentication  
- ✅ **MySQL Database** - Complete schema with all tables including fee payments
- ✅ **PhpMyAdmin Integration** - Easy database management
- ✅ **Dummy Data** - Pre-populated with teachers, students, and sample fee payments
- ✅ **Fee Payment System** - Complete admin-tracked payment recording and reporting

---

## 🚀 Quick Start (5 Minutes)

### 1️⃣ Create Database in PhpMyAdmin

1. Open **http://localhost/phpmyadmin**
2. Click **SQL** tab
3. Paste the contents of `backend-php/database/schema.sql`
4. Click **Go**

### 2️⃣ Insert Dummy Data

1. Still in PhpMyAdmin, go to **SQL** tab again
2. Paste the contents of `backend-php/database/seed.sql`
3. Click **Go**

### 3️⃣ Copy Backend Files

Copy the `backend-php` folder to your web server:

**For XAMPP:**
```
C:\xampp\htdocs\backend-php
```

**For WAMP:**
```
C:\wamp64\www\backend-php
```

### 4️⃣ Update Frontend Configuration

Edit `frontend/.env`:
```env
REACT_APP_API_URL=http://localhost/backend-php/api
```

(Already done if backend-php is at web root)

### 5️⃣ Start Frontend

```bash
cd frontend
npm install  # First time only
npm start
```

### 6️⃣ Login

- **Email**: admin@school.com
- **Password**: admin123

---

## 📁 Project Structure

```
school-project/
├── backend-php/                    # PHP Backend
│   ├── api/
│   │   ├── index.php              # Main API handler
│   │   └── .htaccess              # URL rewriting
│   ├── config/
│   │   └── Database.php           # Database config
│   ├── includes/
│   │   ├── Auth.php               # JWT & Auth
│   │   └── Validation.php         # Form validation
│   └── database/
│       ├── schema.sql             # Database schema
│       └── seed.sql               # Dummy data
│
├── frontend/                        # React Frontend (unchanged)
│   └── ...
│
├── PHP_SETUP.md                    # Detailed PHP setup
└── QUICKSTART.md                   # Quick start guide
```

---

## 🔧 Database Configuration

If your PhpMyAdmin uses different credentials:

Edit `backend-php/config/Database.php`:

```php
define('DB_HOST', 'localhost');      // MySQL host
define('DB_USER', 'root');           // MySQL username
define('DB_PASS', '');               // MySQL password (usually empty for local)
define('DB_NAME', 'school_management');
```

---

## 📋 Database Schema

### admins
- id, name, email, password (hashed), role, timestamps

### teachers
- id, name, subject, email, mobileNumber, profileImage, timestamps

### students
- id, name, fatherName, motherName, gender, class, dob, doa, caste, category, address, mobileNumber
- aadharNumber (unique), samagra_id (unique), familyId
- fatherAadharNo, motherAadharNo
- accountNumber, ifscCode, bankName (optional)
- timestamps

### student_documents
- id, student_id, fileName, fileUrl, uploadedAt

### fee_payments
- id, student_id, admin_id, amount, remark, payment_date, created_at, updated_at
- Foreign keys: student_id (from students), admin_id (from admins)

---

## 🔐 Login Credentials

```
Email:    admin@school.com
Password: admin123
```

(Pre-seeded in database)

---

## 📚 API Endpoints

### Authentication
```
POST   /api/index.php?request=auth/login
POST   /api/index.php?request=auth/register
GET    /api/index.php?request=auth/me
```

### Teachers
```
GET    /api/index.php?request=teachers
GET    /api/index.php?request=teachers/1
POST   /api/index.php?request=teachers
PUT    /api/index.php?request=teachers/1
DELETE /api/index.php?request=teachers/1
```

### Students
```
GET    /api/index.php?request=students
GET    /api/index.php?request=students/1
POST   /api/index.php?request=students
PUT    /api/index.php?request=students/1
DELETE /api/index.php?request=students/1
GET    /api/index.php?request=students/statistics/summary
```

### Fee Payments
```
GET    /api/index.php?request=fee-payments
GET    /api/index.php?request=fee-payments/1
POST   /api/index.php?request=fee-payments
PUT    /api/index.php?request=fee-payments/1
DELETE /api/index.php?request=fee-payments/1
```

**GET /fee-payments supports parameters:**
- `search` - Search by student name
- `class` - Filter by class
- `fromDate` - Filter payments from date
- `toDate` - Filter payments to date
- `page` - Pagination page number
- `limit` - Results per page

---

## 🧪 Test the Backend

Visit in your browser:
```
http://localhost/backend-php/api/index.php?request=health
```

Expected response:
```json
{
    "success": true,
    "message": "Server is running",
    "data": {
        "status": "ok"
    }
}
```

---

## 📝 Features

### ✅ Admin Authentication
- Secure JWT tokens
- Password hashing with bcrypt
- Session management

### ✅ Teacher Management
- Full CRUD operations
- Search by name, subject, or email
- Pagination support
- Details and edit views

### ✅ Student Management
- Comprehensive form (15+ fields)
- Personal info including gender, IDs, parental info, banking
- Validation for all fields
- Search by name or Samagra ID
- Filter by class
- Detailed profiles

### ✅ Fee Payment Management
- Record fee payments with admin tracking
- Search payments by student name (autocomplete)
- Filter by class and date range
- Pagination support
- Auto-capture admin ID for payment accountability
- Update and delete payment records
- Professional receipt generation for printing

### ✅ Dashboard
- Real-time statistics
- Students by class breakdown
- Students by category breakdown
- Total counts

---

## 🐛 Common Issues & Solutions

### "Cannot connect to database"
**Solution**: 
1. Ensure MySQL is running
2. Check DB_HOST, DB_USER, DB_PASS in `config/Database.php`
3. Verify database exists: http://localhost/phpmyadmin

### "API returns 404"
**Solution**:
1. Ensure `backend-php` folder is in web root
2. Check API_URL in frontend `.env`
3. Verify `.htaccess` is in `backend-php/api/`

### "CORS errors"
**Solution**: 
1. CORS is enabled in PHP backend
2. Check that API_URL has no typos
3. Restart your web server

### "Login fails"
**Solution**:
1. Verify database is seeded
2. Check admin table in PhpMyAdmin
3. Use correct credentials: admin@school.com / admin123

### "mod_rewrite not working"
**Alternative**: Use this URL format:
```
http://localhost/backend-php/api/index.php?request=teachers
```

---

## 🚀 Production Deployment

Before deploying to production:

1. **Change JWT Secret**:
   ```php
   define('JWT_SECRET', 'your-unique-production-secret-key');
   ```

2. **Update Database Credentials**:
   ```php
   define('DB_HOST', 'your-db-host');
   define('DB_USER', 'your-db-user');
   define('DB_PASS', 'your-db-password');
   ```

3. **Update Frontend API URL**:
   ```env
   REACT_APP_API_URL=https://yourdomain.com/backend-php/api
   ```

4. **Build Frontend**:
   ```bash
   npm run build
   ```

5. **Upload to hosting** (both backend-php and frontend build folder)

---

## 📞 Need Help?

1. Check **PHP_SETUP.md** for detailed instructions
2. Verify database connection in PhpMyAdmin
3. Check browser console for errors (F12)
4. Check server error logs

---

## ✨ You're All Set!

Your School Management Portal is ready with:
- ✅ PHP Backend with MySQL
- ✅ React Frontend
- ✅ JWT Authentication
- ✅ Complete CRUD operations for Students & Teachers
- ✅ Professional Fee Payment System with admin tracking
- ✅ Advanced filtering and search capabilities
- ✅ Professional receipt printing
- ✅ Professional UI/UX with responsive design
- ✅ Form validation
- ✅ Gender field for student tracking
- ✅ Dummy data pre-loaded

**Start the frontend and login to begin!** 🎓

```bash
cd frontend
npm start
```

---

**Happy Managing!** 📚
