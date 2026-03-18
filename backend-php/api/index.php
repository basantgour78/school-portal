<?php
require_once __DIR__ . '/../config/Database.php';
require_once __DIR__ . '/../includes/Auth.php';

$method = $_SERVER['REQUEST_METHOD'];
$request = $_GET['request'] ?? '';

// Route the requests
switch ($request) {
    case 'auth/register':
        if ($method === 'POST') authRegister($conn);
        break;
    
    case 'auth/login':
        if ($method === 'POST') authLogin($conn);
        break;
    
    case 'auth/me':
        if ($method === 'GET') getMe($conn);
        break;
    
    // Teachers routes
    case 'teachers':
        if ($method === 'GET') getTeachers($conn);
        elseif ($method === 'POST') createTeacher($conn);
        break;
    
    case preg_match('/^teachers\/(\d+)$/', $request, $matches) ? $matches[0] : null:
        $teacherId = $matches[1];
        if ($method === 'GET') getTeacher($conn, $teacherId);
        elseif ($method === 'PUT') updateTeacher($conn, $teacherId);
        elseif ($method === 'DELETE') deleteTeacher($conn, $teacherId);
        break;
    
    // Students routes
    case 'students':
        if ($method === 'GET') getStudents($conn);
        elseif ($method === 'POST') createStudent($conn);
        break;
    
    case preg_match('/^students\/(\d+)$/', $request, $matches) ? $matches[0] : null:
        $studentId = $matches[1];
        if ($method === 'GET') getStudent($conn, $studentId);
        elseif ($method === 'PUT') updateStudent($conn, $studentId);
        elseif ($method === 'DELETE') deleteStudent($conn, $studentId);
        break;
    
    case 'students/statistics/summary':
        if ($method === 'GET') getStatistics($conn);
        break;
    
    // Fee Payments routes
    case 'fee-payments':
        if ($method === 'GET') getFeePayments($conn);
        elseif ($method === 'POST') createFeePayment($conn);
        break;
    
    case preg_match('/^fee-payments\/(\d+)$/', $request, $matches) ? $matches[0] : null:
        $paymentId = $matches[1];
        if ($method === 'GET') getFeePayment($conn, $paymentId);
        elseif ($method === 'PUT') updateFeePayment($conn, $paymentId);
        elseif ($method === 'DELETE') deleteFeePayment($conn, $paymentId);
        break;
    
    case 'health':
        sendResponse(true, 'Server is running', ['status' => 'ok']);
        break;
    
    default:
        sendResponse(false, 'Route not found', null, 404);
}

// ==================== AUTH FUNCTIONS ====================

function authRegister($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['name']) || !isset($data['email']) || !isset($data['password'])) {
        sendResponse(false, 'Missing required fields', null, 400);
    }
    
    $name = $conn->real_escape_string($data['name']);
    $email = $conn->real_escape_string($data['email']);
    $password = Auth::hashPassword($data['password']);
    
    // Check if admin exists
    $check = $conn->query("SELECT id FROM admins WHERE email = '$email'");
    if ($check->num_rows > 0) {
        sendResponse(false, 'Admin already exists', null, 400);
    }
    
    $query = "INSERT INTO admins (name, email, password) VALUES ('$name', '$email', '$password')";
    
    if ($conn->query($query)) {
        $adminId = $conn->insert_id;
        $token = Auth::generateToken($adminId);
        
        sendResponse(true, 'Admin registered successfully', [
            'token' => $token,
            'admin' => [
                'id' => $adminId,
                'name' => $name,
                'email' => $email
            ]
        ], 201);
    } else {
        sendResponse(false, $conn->error, null, 500);
    }
}

function authLogin($conn) {
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['email']) || !isset($data['password'])) {
        sendResponse(false, 'Please provide email and password', null, 400);
    }
    
    $email = $conn->real_escape_string($data['email']);
    $password = $data['password'];
    
    $query = "SELECT id, name, email, password FROM admins WHERE email = '$email'";
    $result = $conn->query($query);
    
    if ($result->num_rows === 0) {
        sendResponse(false, 'Invalid credentials', null, 401);
    }
    
    $admin = $result->fetch_assoc();
    
    if (!Auth::verifyPassword($password, $admin['password'])) {
        sendResponse(false, 'Invalid credentials', null, 401);
    }
    
    $token = Auth::generateToken($admin['id']);
    
    sendResponse(true, 'Login successful', [
        'token' => $token,
        'admin' => [
            'id' => $admin['id'],
            'name' => $admin['name'],
            'email' => $admin['email']
        ]
    ]);
}

function getMe($conn) {
    $auth = Auth::getAuthorization();
    
    if (!$auth) {
        sendResponse(false, 'Not authorized to access this route', null, 401);
    }
    
    $adminId = $conn->real_escape_string($auth['id']);
    $query = "SELECT id, name, email FROM admins WHERE id = '$adminId'";
    $result = $conn->query($query);
    
    if ($result->num_rows === 0) {
        sendResponse(false, 'Admin not found', null, 404);
    }
    
    $admin = $result->fetch_assoc();
    sendResponse(true, 'Success', ['admin' => $admin]);
}

// ==================== TEACHER FUNCTIONS ====================

function getTeachers($conn) {
    $auth = Auth::getAuthorization();
    if (!$auth) {
        sendResponse(false, 'Not authorized', null, 401);
    }
    
    $search = isset($_GET['search']) ? $conn->real_escape_string($_GET['search']) : '';
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $offset = ($page - 1) * $limit;
    
    $whereClause = '';
    if ($search) {
        $whereClause = "WHERE name LIKE '%$search%' OR subject LIKE '%$search%' OR email LIKE '%$search%'";
    }
    
    $totalResult = $conn->query("SELECT COUNT(*) as count FROM teachers $whereClause");
    $total = $totalResult->fetch_assoc()['count'];
    
    $query = "SELECT * FROM teachers $whereClause ORDER BY created_at DESC LIMIT $offset, $limit";
    $result = $conn->query($query);
    
    $teachers = [];
    while ($row = $result->fetch_assoc()) {
        $row['_id'] = $row['id'];
        $teachers[] = $row;
    }
    
    sendResponse(true, 'Success', [
        'count' => count($teachers),
        'total' => $total,
        'page' => $page,
        'pages' => ceil($total / $limit),
        'teachers' => $teachers
    ]);
}

function getTeacher($conn, $id) {
    $auth = Auth::getAuthorization();
    if (!$auth) {
        sendResponse(false, 'Not authorized', null, 401);
    }
    
    $id = (int)$id;
    $query = "SELECT * FROM teachers WHERE id = $id";
    $result = $conn->query($query);
    
    if ($result->num_rows === 0) {
        sendResponse(false, 'Teacher not found', null, 404);
    }
    
    $teacher = $result->fetch_assoc();
    $teacher['_id'] = $teacher['id'];
    
    sendResponse(true, 'Success', ['teacher' => $teacher]);
}

function createTeacher($conn) {
    $auth = Auth::getAuthorization();
    if (!$auth) {
        sendResponse(false, 'Not authorized', null, 401);
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    $name = $conn->real_escape_string($data['name'] ?? '');
    $subject = $conn->real_escape_string($data['subject'] ?? '');
    $email = $conn->real_escape_string($data['email'] ?? '');
    $mobile = $conn->real_escape_string($data['mobileNumber'] ?? '');
    
    if (!$name || !$subject || !$email || !$mobile) {
        sendResponse(false, 'Missing required fields', null, 400);
    }
    
    $query = "INSERT INTO teachers (name, subject, email, mobileNumber) VALUES ('$name', '$subject', '$email', '$mobile')";
    
    if ($conn->query($query)) {
        $teacherId = $conn->insert_id;
        sendResponse(true, 'Teacher created successfully', [
            'teacher' => [
                'id' => $teacherId,
                '_id' => $teacherId,
                'name' => $name,
                'subject' => $subject,
                'email' => $email,
                'mobileNumber' => $mobile
            ]
        ], 201);
    } else {
        sendResponse(false, $conn->error, null, 400);
    }
}

function updateTeacher($conn, $id) {
    $auth = Auth::getAuthorization();
    if (!$auth) {
        sendResponse(false, 'Not authorized', null, 401);
    }
    
    $id = (int)$id;
    $data = json_decode(file_get_contents('php://input'), true);
    
    $updates = [];
    if (isset($data['name'])) {
        $updates[] = "name = '" . $conn->real_escape_string($data['name']) . "'";
    }
    if (isset($data['subject'])) {
        $updates[] = "subject = '" . $conn->real_escape_string($data['subject']) . "'";
    }
    if (isset($data['email'])) {
        $updates[] = "email = '" . $conn->real_escape_string($data['email']) . "'";
    }
    if (isset($data['mobileNumber'])) {
        $updates[] = "mobileNumber = '" . $conn->real_escape_string($data['mobileNumber']) . "'";
    }
    
    if (empty($updates)) {
        sendResponse(false, 'No fields to update', null, 400);
    }
    
    $query = "UPDATE teachers SET " . implode(', ', $updates) . " WHERE id = $id";
    
    if ($conn->query($query)) {
        sendResponse(true, 'Teacher updated successfully');
    } else {
        sendResponse(false, $conn->error, null, 400);
    }
}

function deleteTeacher($conn, $id) {
    $auth = Auth::getAuthorization();
    if (!$auth) {
        sendResponse(false, 'Not authorized', null, 401);
    }
    
    $id = (int)$id;
    $query = "DELETE FROM teachers WHERE id = $id";
    
    if ($conn->query($query)) {
        sendResponse(true, 'Teacher deleted successfully');
    } else {
        sendResponse(false, $conn->error, null, 400);
    }
}

// ==================== STUDENT FUNCTIONS ====================

function getStudents($conn) {
    $auth = Auth::getAuthorization();
    if (!$auth) {
        sendResponse(false, 'Not authorized', null, 401);
    }
    
    $search = isset($_GET['search']) ? $conn->real_escape_string($_GET['search']) : '';
    $class = isset($_GET['class']) ? $conn->real_escape_string($_GET['class']) : '';
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $offset = ($page - 1) * $limit;
    
    $whereClause = 'WHERE 1=1';
    if ($search) {
        $whereClause .= " AND (name LIKE '%$search%' OR samagra_id LIKE '%$search%')";
    }
    if ($class) {
        $whereClause .= " AND class = '$class'";
    }
    
    $totalResult = $conn->query("SELECT COUNT(*) as count FROM students $whereClause");
    $total = $totalResult->fetch_assoc()['count'];
    
    $query = "SELECT * FROM students $whereClause ORDER BY created_at DESC LIMIT $offset, $limit";
    $result = $conn->query($query);
    
    $students = [];
    while ($row = $result->fetch_assoc()) {
        $row['_id'] = $row['id'];
        $students[] = $row;
    }
    
    sendResponse(true, 'Success', [
        'count' => count($students),
        'total' => $total,
        'page' => $page,
        'pages' => ceil($total / $limit),
        'students' => $students
    ]);
}

function getStudent($conn, $id) {
    $auth = Auth::getAuthorization();
    if (!$auth) {
        sendResponse(false, 'Not authorized', null, 401);
    }
    
    $id = (int)$id;
    $query = "SELECT * FROM students WHERE id = $id";
    $result = $conn->query($query);
    
    if ($result->num_rows === 0) {
        sendResponse(false, 'Student not found', null, 404);
    }
    
    $student = $result->fetch_assoc();
    $student['_id'] = $student['id'];
    
    // Get documents
    $docQuery = "SELECT * FROM student_documents WHERE student_id = $id";
    $docResult = $conn->query($docQuery);
    $student['documents'] = [];
    while ($doc = $docResult->fetch_assoc()) {
        $student['documents'][] = $doc;
    }
    
    sendResponse(true, 'Success', ['student' => $student]);
}

function createStudent($conn) {
    $auth = Auth::getAuthorization();
    if (!$auth) {
        sendResponse(false, 'Not authorized', null, 401);
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Required fields
    $required = ['name', 'fatherName', 'motherName', 'gender', 'class', 'dob', 'doa', 'caste', 'category', 'address', 'mobileNumber', 'aadharNumber', 'samagra_id', 'familyId', 'fatherAadharNo', 'motherAadharNo'];
    foreach ($required as $field) {
        if (!isset($data[$field]) || $data[$field] === '') {
            sendResponse(false, "Field '$field' is required", null, 400);
        }
    }
    
    // Escape and prepare
    $name = $conn->real_escape_string($data['name']);
    $fatherName = $conn->real_escape_string($data['fatherName']);
    $motherName = $conn->real_escape_string($data['motherName']);
    $gender = $conn->real_escape_string($data['gender']);
    $class = $conn->real_escape_string($data['class']);
    $dob = $conn->real_escape_string($data['dob']);
    $doa = $conn->real_escape_string($data['doa']);
    $caste = $conn->real_escape_string($data['caste']);
    $category = $conn->real_escape_string($data['category']);
    $address = $conn->real_escape_string($data['address']);
    $mobile = $conn->real_escape_string($data['mobileNumber']);
    $aadhar = $conn->real_escape_string($data['aadharNumber']);
    $samagra = $conn->real_escape_string($data['samagra_id']);
    $familyId = $conn->real_escape_string($data['familyId']);
    $fatherAadhar = $conn->real_escape_string($data['fatherAadharNo']);
    $motherAadhar = $conn->real_escape_string($data['motherAadharNo']);
    
    // Optional fields
    $accountNo = isset($data['accountNumber']) ? $conn->real_escape_string($data['accountNumber']) : NULL;
    $ifsc = isset($data['ifscCode']) ? $conn->real_escape_string($data['ifscCode']) : NULL;
    $bankName = isset($data['bankName']) ? $conn->real_escape_string($data['bankName']) : NULL;
    
    $query = "INSERT INTO students (name, fatherName, motherName, gender, class, dob, doa, caste, category, address, mobileNumber, aadharNumber, samagra_id, familyId, fatherAadharNo, motherAadharNo, accountNumber, ifscCode, bankName) 
              VALUES ('$name', '$fatherName', '$motherName', '$gender', '$class', '$dob', '$doa', '$caste', '$category', '$address', '$mobile', '$aadhar', '$samagra', '$familyId', '$fatherAadhar', '$motherAadhar', " . ($accountNo ? "'$accountNo'" : "NULL") . ", " . ($ifsc ? "'$ifsc'" : "NULL") . ", " . ($bankName ? "'$bankName'" : "NULL") . ")";
    
    if ($conn->query($query)) {
        $studentId = $conn->insert_id;
        sendResponse(true, 'Student created successfully', ['id' => $studentId], 201);
    } else {
        sendResponse(false, $conn->error, null, 400);
    }
}

function updateStudent($conn, $id) {
    $auth = Auth::getAuthorization();
    if (!$auth) {
        sendResponse(false, 'Not authorized', null, 401);
    }
    
    $id = (int)$id;
    $data = json_decode(file_get_contents('php://input'), true);
    
    $updates = [];
    $fields = ['name', 'fatherName', 'motherName', 'gender', 'class', 'dob', 'doa', 'caste', 'category', 'address', 'mobileNumber', 'aadharNumber', 'samagra_id', 'familyId', 'fatherAadharNo', 'motherAadharNo', 'accountNumber', 'ifscCode', 'bankName'];
    
    foreach ($fields as $field) {
        if (isset($data[$field])) {
            $value = $conn->real_escape_string($data[$field]);
            $updates[] = "$field = '$value'";
        }
    }
    
    if (empty($updates)) {
        sendResponse(false, 'No fields to update', null, 400);
    }
    
    $query = "UPDATE students SET " . implode(', ', $updates) . " WHERE id = $id";
    
    if ($conn->query($query)) {
        sendResponse(true, 'Student updated successfully');
    } else {
        sendResponse(false, $conn->error, null, 400);
    }
}

function deleteStudent($conn, $id) {
    $auth = Auth::getAuthorization();
    if (!$auth) {
        sendResponse(false, 'Not authorized', null, 401);
    }
    
    $id = (int)$id;
    
    // Delete documents first
    $conn->query("DELETE FROM student_documents WHERE student_id = $id");
    
    // Delete student
    $query = "DELETE FROM students WHERE id = $id";
    
    if ($conn->query($query)) {
        sendResponse(true, 'Student deleted successfully');
    } else {
        sendResponse(false, $conn->error, null, 400);
    }
}

function getStatistics($conn) {
    $auth = Auth::getAuthorization();
    if (!$auth) {
        sendResponse(false, 'Not authorized', null, 401);
    }
    
    // Total students
    $totalResult = $conn->query("SELECT COUNT(*) as count FROM students");
    $totalStudents = $totalResult->fetch_assoc()['count'];
    
    // Students by class
    $classByResult = $conn->query("SELECT class as _id, COUNT(*) as count FROM students GROUP BY class ORDER BY class");
    $studentsByClass = [];
    while ($row = $classByResult->fetch_assoc()) {
        $studentsByClass[] = $row;
    }
    
    // Students by category
    $categoryResult = $conn->query("SELECT category as _id, COUNT(*) as count FROM students GROUP BY category");
    $studentsByCategory = [];
    while ($row = $categoryResult->fetch_assoc()) {
        $studentsByCategory[] = $row;
    }
    
    sendResponse(true, 'Success', [
        'totalStudents' => $totalStudents,
        'studentsByClass' => $studentsByClass,
        'studentsByCategory' => $studentsByCategory
    ]);
}

// ==================== FEE PAYMENTS FUNCTIONS ====================

function getFeePayments($conn) {
    $auth = Auth::getAuthorization();
    if (!$auth) {
        sendResponse(false, 'Not authorized', null, 401);
    }
    
    // Pagination
    $page = isset($_GET['page']) ? (int)$_GET['page'] : 1;
    $limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 10;
    $offset = ($page - 1) * $limit;
    
    // Search
    $search = isset($_GET['search']) ? $conn->real_escape_string($_GET['search']) : '';
    
    // Filter
    $class = isset($_GET['class']) ? $conn->real_escape_string($_GET['class']) : '';
    $fromDate = isset($_GET['fromDate']) ? $conn->real_escape_string($_GET['fromDate']) : '';
    $toDate = isset($_GET['toDate']) ? $conn->real_escape_string($_GET['toDate']) : '';
    
    // Build where clause
    $whereConditions = [];
    if ($search) {
        $whereConditions[] = "(s.name LIKE '%$search%')";
    }
    if ($class) {
        $whereConditions[] = "s.class = '$class'";
    }
    if ($fromDate) {
        $whereConditions[] = "fp.payment_date >= '$fromDate'";
    }
    if ($toDate) {
        $whereConditions[] = "fp.payment_date <= '$toDate'";
    }
    
    $whereClause = !empty($whereConditions) ? 'WHERE ' . implode(' AND ', $whereConditions) : '';
    
    // Get total count
    $countQuery = "SELECT COUNT(*) as total FROM fee_payments fp 
                   JOIN students s ON fp.student_id = s.id 
                   $whereClause";
    $countResult = $conn->query($countQuery);
    $total = $countResult->fetch_assoc()['total'];
    
    // Get payments with student info
    $query = "SELECT fp.id, fp.student_id, fp.admin_id, fp.amount, fp.remark, fp.payment_date, fp.created_at, 
                     s.name as student_name, s.class, s.aadharNumber,
                     a.name as admin_name
              FROM fee_payments fp
              JOIN students s ON fp.student_id = s.id
              JOIN admins a ON fp.admin_id = a.id
              $whereClause
              ORDER BY fp.payment_date DESC, fp.created_at DESC
              LIMIT $limit OFFSET $offset";
    
    $result = $conn->query($query);
    $payments = [];
    while ($row = $result->fetch_assoc()) {
        $payments[] = $row;
    }
    
    sendResponse(true, 'Success', [
        'payments' => $payments,
        'pagination' => [
            'current_page' => $page,
            'per_page' => $limit,
            'total' => $total,
            'total_pages' => ceil($total / $limit)
        ]
    ]);
}

function getFeePayment($conn, $id) {
    $auth = Auth::getAuthorization();
    if (!$auth) {
        sendResponse(false, 'Not authorized', null, 401);
    }
    
    $id = (int)$id;
    $query = "SELECT fp.id, fp.student_id, fp.admin_id, fp.amount, fp.remark, fp.payment_date, fp.created_at, fp.updated_at,
                     s.name as student_name, s.class, s.aadharNumber, s.fatherName,
                     a.name as admin_name, a.email as admin_email
              FROM fee_payments fp
              JOIN students s ON fp.student_id = s.id
              JOIN admins a ON fp.admin_id = a.id
              WHERE fp.id = $id";
    
    $result = $conn->query($query);
    if ($result->num_rows === 0) {
        sendResponse(false, 'Payment not found', null, 404);
    }
    
    $payment = $result->fetch_assoc();
    sendResponse(true, 'Success', ['payment' => $payment]);
}

function createFeePayment($conn) {
    $auth = Auth::getAuthorization();
    if (!$auth) {
        sendResponse(false, 'Not authorized', null, 401);
    }
    
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Required fields
    $required = ['student_id', 'amount', 'payment_date'];
    foreach ($required as $field) {
        if (!isset($data[$field]) || $data[$field] === '') {
            sendResponse(false, "Field '$field' is required", null, 400);
        }
    }
    
    $studentId = (int)$data['student_id'];
    $amount = (float)$data['amount'];
    $remark = isset($data['remark']) ? $conn->real_escape_string($data['remark']) : NULL;
    $paymentDate = $conn->real_escape_string($data['payment_date']);
    $adminId = (int)$auth['id']; // Get admin ID from the authenticated user
    
    // Check if student exists
    $checkStudent = $conn->query("SELECT id FROM students WHERE id = $studentId");
    if ($checkStudent->num_rows === 0) {
        sendResponse(false, 'Student not found', null, 404);
    }
    
    $query = "INSERT INTO fee_payments (student_id, admin_id, amount, remark, payment_date) 
              VALUES ($studentId, $adminId, $amount, " . ($remark ? "'$remark'" : "NULL") . ", '$paymentDate')";
    
    if ($conn->query($query)) {
        $paymentId = $conn->insert_id;
        sendResponse(true, 'Payment created successfully', ['id' => $paymentId], 201);
    } else {
        sendResponse(false, $conn->error, null, 400);
    }
}

function updateFeePayment($conn, $id) {
    $auth = Auth::getAuthorization();
    if (!$auth) {
        sendResponse(false, 'Not authorized', null, 401);
    }
    
    $id = (int)$id;
    $data = json_decode(file_get_contents('php://input'), true);
    
    // Check if payment exists
    $checkPayment = $conn->query("SELECT id FROM fee_payments WHERE id = $id");
    if ($checkPayment->num_rows === 0) {
        sendResponse(false, 'Payment not found', null, 404);
    }
    
    $updates = [];
    $fields = ['student_id', 'amount', 'remark', 'payment_date'];
    
    foreach ($fields as $field) {
        if (isset($data[$field])) {
            if ($field === 'student_id' || $field === 'amount') {
                $value = ($field === 'student_id') ? (int)$data[$field] : (float)$data[$field];
                $updates[] = "$field = $value";
            } else {
                $value = $conn->real_escape_string($data[$field]);
                $updates[] = "$field = '$value'";
            }
        }
    }
    
    if (empty($updates)) {
        sendResponse(false, 'No fields to update', null, 400);
    }
    
    $query = "UPDATE fee_payments SET " . implode(', ', $updates) . " WHERE id = $id";
    
    if ($conn->query($query)) {
        sendResponse(true, 'Payment updated successfully');
    } else {
        sendResponse(false, $conn->error, null, 400);
    }
}

function deleteFeePayment($conn, $id) {
    $auth = Auth::getAuthorization();
    if (!$auth) {
        sendResponse(false, 'Not authorized', null, 401);
    }
    
    $id = (int)$id;
    
    // Check if payment exists
    $checkPayment = $conn->query("SELECT id FROM fee_payments WHERE id = $id");
    if ($checkPayment->num_rows === 0) {
        sendResponse(false, 'Payment not found', null, 404);
    }
    
    if ($conn->query("DELETE FROM fee_payments WHERE id = $id")) {
        sendResponse(true, 'Payment deleted successfully');
    } else {
        sendResponse(false, $conn->error, null, 400);
    }
}
?>
