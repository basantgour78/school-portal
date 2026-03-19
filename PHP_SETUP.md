# PHP Backend Setup Instructions

## Prerequisites

- PHP 7.4 or higher (with MySQLi extension enabled)
- MySQL/PhpMyAdmin
- A local server (XAMPP, WAMP, or MAMP)

## Step 1: Place Backend Files in Web Root

1. Copy the `backend-php` folder to your web server's root directory:
   - **XAMPP**: `C:\xampp\htdocs\school-project\backend-php`
   - **WAMP**: `C:\wamp64\www\school-project\backend-php`
   - **MAMP**: `/Applications/MAMP/htdocs/school-project/backend-php`

## Step 2: Create Database

1. Open PhpMyAdmin: http://localhost/phpmyadmin
2. Go to "SQL" tab
3. Copy the entire contents of `database/schema.sql`
4. Paste it in the SQL editor and click "Go"

This will create:
- Database: `school_management`
- Tables: `admins`, `teachers`, `students`, `student_documents`, `fee_payments`

## Step 3: Seed Dummy Data

1. In PhpMyAdmin, select the `school_management` database
2. Go to "SQL" tab
3. Copy the entire contents of `database/seed.sql`
4. Paste it and click "Go"

This will insert:
- 1 Admin account
- 5 Teachers
- 6 Students with full details
- 9 Sample fee payment records

## Step 4: Update Frontend Configuration

In `frontend/.env`, change the API URL:

```env
REACT_APP_API_URL=http://localhost/school-project/backend-php/api
```

## Step 5: Update PHP API Configuration (if needed)

Edit `backend-php/config/Database.php`:

```php
define('DB_HOST', 'localhost');    // Your MySQL host
define('DB_USER', 'root');         // Your MySQL user
define('DB_PASS', '');             // Your MySQL password
define('DB_NAME', 'school_management'); // Database name
```

## Step 6: Test the API

Open your browser and test:

```
http://localhost/school-project/backend-php/api/index.php?request=health
```

You should see:
```json
{
    "success": true,
    "message": "Server is running",
    "data": {
        "status": "ok"
    }
}
```

## Step 7: Start Frontend

```bash
cd frontend
npm start
```

## Step 8: Login

Use these credentials:
- **Email**: admin@school.com
- **Password**: admin123

## Step 9: Frontend Features

The React frontend includes:
- **Font Awesome Icons**: Professional icon library (v6.4) for all UI elements
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Modern UI**: Gradient styling, smooth animations, and professional appearance
- **Real-time Filtering**: Fee statement filters update instantly
- **Autocomplete Search**: Smart student search with dropdown suggestions
- **Professional Receipts**: Printable payment receipts for records

## ⚙️ Configuration Notes

### Database Connection
- Default user: `root`
- If you have a different MySQL user, update `DB_USER` and `DB_PASS` in `config/Database.php`

### JWT Secret
- Change `JWT_SECRET` in `config/Database.php` for production:
```php
define('JWT_SECRET', 'your_unique_secret_key_here');
```

### API URL
- The API base URL should be: `http://localhost/school-project/backend-php/api`
- Adjust the path if your installation is different

## 🐛 Troubleshooting

### "Cannot connect to database"
- Ensure MySQL is running
- Verify DB_HOST, DB_USER, DB_PASS, DB_NAME in `config/Database.php`
- Check if the database exists in PhpMyAdmin

### "404 Not Found"
- Make sure files are in the correct path
- Check that your web server is running
- Verify the API URL in frontend `.env`

### "CORS Error"
- The PHP backend has CORS headers enabled
- If still having issues, ensure your API URL matches exactly

### "Login fails"
- Make sure the database is seeded with dummy data
- Check that admin table has the admin record
- Verify the password hash is correct (seeded data should work)

## 📝 API Endpoints

### Authentication
- `POST /api/index.php?request=auth/login` - Login
- `POST /api/index.php?request=auth/register` - Register (one-time)
- `GET /api/index.php?request=auth/me` - Get current admin

### Teachers
- `GET /api/index.php?request=teachers` - List all teachers
- `POST /api/index.php?request=teachers` - Create teacher
- `GET /api/index.php?request=teachers/1` - Get teacher by ID
- `PUT /api/index.php?request=teachers/1` - Update teacher
- `DELETE /api/index.php?request=teachers/1` - Delete teacher

### Students
- `GET /api/index.php?request=students` - List all students
- `POST /api/index.php?request=students` - Create student
- `GET /api/index.php?request=students/1` - Get student by ID
- `PUT /api/index.php?request=students/1` - Update student
- `DELETE /api/index.php?request=students/1` - Delete student
- `GET /api/index.php?request=students/statistics/summary` - Get statistics

### Fee Payments
- `GET /api/index.php?request=fee-payments` - List all payments (supports search, class filter, admin filter, date range, pagination)
- `GET /api/index.php?request=fee-payments/summary` - Get filtered fee totals and admin-wise summaries
- `POST /api/index.php?request=fee-payments` - Record new payment (auto-captures admin ID)
- `GET /api/index.php?request=fee-payments/1` - Get payment details
- `PUT /api/index.php?request=fee-payments/1` - Update payment
- `DELETE /api/index.php?request=fee-payments/1` - Delete payment

## ✅ Everything Ready!

Now you have:
- ✅ PHP Backend with MySQL
- ✅ React Frontend
- ✅ Secure authentication with JWT
- ✅ Complete CRUD operations
- ✅ Dummy data pre-loaded

Enjoy your School Management Portal! 🎓
