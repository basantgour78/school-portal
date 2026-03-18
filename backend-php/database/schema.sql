<?php
-- School Management Database Schema

CREATE DATABASE IF NOT EXISTS `school_management` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `school_management`;

-- Admin Table
CREATE TABLE `admins` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `role` VARCHAR(50) DEFAULT 'admin',
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `email_idx` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Teacher Table
CREATE TABLE `teachers` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `subject` VARCHAR(100) NOT NULL,
  `email` VARCHAR(100) NOT NULL UNIQUE,
  `mobileNumber` VARCHAR(10) NOT NULL,
  `profileImage` VARCHAR(255),
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `name_idx` (`name`),
  INDEX `email_idx` (`email`),
  INDEX `subject_idx` (`subject`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Student Table
CREATE TABLE `students` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(100) NOT NULL,
  `fatherName` VARCHAR(100) NOT NULL,
  `motherName` VARCHAR(100) NOT NULL,
  `gender` ENUM('Male', 'Female') NOT NULL,
  `class` VARCHAR(10) NOT NULL,
  `dob` DATE NOT NULL,
  `doa` DATE NOT NULL,
  `caste` VARCHAR(100),
  `category` ENUM('General', 'OBC', 'SC', 'ST') NOT NULL,
  `address` TEXT NOT NULL,
  `mobileNumber` VARCHAR(10) NOT NULL,
  
  -- IDs
  `aadharNumber` VARCHAR(12) NOT NULL UNIQUE,
  `samagra_id` VARCHAR(50) NOT NULL UNIQUE,
  `familyId` VARCHAR(50) NOT NULL,
  
  -- Parental IDs
  `fatherAadharNo` VARCHAR(12) NOT NULL,
  `motherAadharNo` VARCHAR(12) NOT NULL,
  
  -- Banking (Optional)
  `accountNumber` VARCHAR(18),
  `ifscCode` VARCHAR(11),
  `bankName` VARCHAR(100),
  
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  INDEX `name_idx` (`name`),
  INDEX `class_idx` (`class`),
  INDEX `samagra_id_idx` (`samagra_id`),
  INDEX `aadhar_idx` (`aadharNumber`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Student Documents Table
CREATE TABLE `student_documents` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `student_id` INT NOT NULL,
  `fileName` VARCHAR(255) NOT NULL,
  `fileUrl` VARCHAR(255) NOT NULL,
  `uploadedAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  INDEX `student_id_idx` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Fee Payments Table
CREATE TABLE `fee_payments` (
  `id` INT PRIMARY KEY AUTO_INCREMENT,
  `student_id` INT NOT NULL,
  `admin_id` INT NOT NULL,
  `amount` DECIMAL(10, 2) NOT NULL,
  `remark` TEXT,
  `payment_date` DATE NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE,
  FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE RESTRICT,
  INDEX `student_id_idx` (`student_id`),
  INDEX `admin_id_idx` (`admin_id`),
  INDEX `payment_date_idx` (`payment_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
?>
