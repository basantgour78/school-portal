-- Seed Data for School Management System

-- Insert Admin
INSERT INTO `admins` (`name`, `email`, `password`) VALUES 
('School Admin', 'admin@school.com', '$2y$10$HRLwA5Ij0qQigT8GA8eVYORQzcsMqdArskCDn9cd/ntW4bOBnrDh.');

-- Insert Teachers
INSERT INTO `teachers` (`name`, `subject`, `email`, `mobileNumber`) VALUES 
('John Smith', 'Mathematics', 'john.smith@school.com', '9876543210'),
('Sarah Johnson', 'English', 'sarah.johnson@school.com', '9876543211'),
('Michael Brown', 'Science', 'michael.brown@school.com', '9876543212'),
('Emily Davis', 'History', 'emily.davis@school.com', '9876543213'),
('David Wilson', 'Physical Education', 'david.wilson@school.com', '9876543214');

-- Insert Students
INSERT INTO `students` (`name`, `fatherName`, `motherName`, `class`, `dob`, `doa`, `caste`, `category`, `address`, `mobileNumber`, `aadharNumber`, `samagra_id`, `familyId`, `fatherAadharNo`, `motherAadharNo`, `accountNumber`, `ifscCode`, `bankName`) VALUES 
('Raj Kumar Singh', 'Arun Kumar Singh', 'Priya Singh', '10', '2008-05-15', '2019-04-01', 'Hindu', 'General', '123 Green Lane, Delhi', '9123456789', '123456789012', 'SAM001001', 'FAM001001', '123456789000', '123456789001', '1234567890123456', 'HDFC0000123', 'HDFC Bank'),
('Isha Patel', 'Vikram Patel', 'Anjali Patel', '9', '2009-08-20', '2020-04-01', 'Hindu', 'OBC', '456 Innovation Road, Mumbai', '9123456790', '123456789013', 'SAM001002', 'FAM001002', '123456789002', '123456789003', '1234567890123457', 'ICIC0000456', 'ICICI Bank'),
('Arjun Desai', 'Rajesh Desai', 'Neha Desai', '8', '2010-03-10', '2021-04-01', 'Hindu', 'SC', '789 Scholar Street, Bangalore', '9123456791', '123456789014', 'SAM001003', 'FAM001003', '123456789004', '123456789005', '1234567890123458', 'AXIS0000789', 'Axis Bank'),
('Priya Sharma', 'Amit Sharma', 'Anu Sharma', '7', '2011-06-25', '2022-04-01', 'Hindu', 'ST', '321 Education Circle, Pune', '9123456792', '123456789015', 'SAM001004', 'FAM001004', '123456789006', '123456789007', '1234567890123459', 'BKID0001234', 'Bank of India'),
('Rohan Verma', 'Suresh Verma', 'Sheela Verma', '10', '2008-11-30', '2019-04-01', 'Hindu', 'General', '654 Pioneer Road, Chennai', '9123456793', '123456789016', 'SAM001005', 'FAM001005', '123456789008', '123456789009', '1234567890123460', 'SBIN0001567', 'State Bank of India'),
('Neha Gupta', 'Ramesh Gupta', 'Mira Gupta', '9', '2009-01-12', '2020-04-01', 'Hindu', 'OBC', '987 Knowledge Lane, Hyderabad', '9123456794', '123456789017', 'SAM001006', 'FAM001006', '123456789010', '123456789011', '1234567890123461', 'CANB0001890', 'Canara Bank');
