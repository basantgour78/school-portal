<?php
require_once __DIR__ . '/../config/Database.php';

class Validation {
    
    public static function validateEmail($email) {
        return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
    }
    
    public static function validatePhone($phone) {
        return strlen($phone) == 10 && ctype_digit($phone);
    }
    
    public static function validateAadhar($aadhar) {
        return strlen($aadhar) == 12 && ctype_digit($aadhar);
    }
    
    public static function validateIFSC($ifsc) {
        return preg_match('/^[A-Z]{4}0[A-Z0-9]{6}$/', $ifsc) === 1;
    }
    
    public static function validateAccountNumber($account) {
        $len = strlen($account);
        return $len >= 9 && $len <= 18 && ctype_digit($account);
    }
    
    public static function validateDOB($dob, $minAge = 3) {
        $dateOfBirth = new DateTime($dob);
        $today = new DateTime();
        $age = $today->diff($dateOfBirth)->y;
        return $age >= $minAge;
    }
}
?>
