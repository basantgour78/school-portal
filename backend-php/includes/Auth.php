<?php
require_once __DIR__ . '/../config/Database.php';

// JWT Authentication Functions
class Auth {
    
    public static function generateToken($adminId) {
        $payload = [
            'iat' => time(),
            'exp' => time() + JWT_EXPIRE,
            'id' => $adminId
        ];
        
        return self::encodeJWT($payload);
    }
    
    private static function encodeJWT($payload) {
        $header = json_encode(['typ' => 'JWT', 'alg' => 'HS256']);
        $payload = json_encode($payload);
        
        $base64UrlHeader = self::base64UrlEncode($header);
        $base64UrlPayload = self::base64UrlEncode($payload);
        
        $signature = hash_hmac(
            'sha256',
            $base64UrlHeader . '.' . $base64UrlPayload,
            JWT_SECRET,
            true
        );
        
        $base64UrlSignature = self::base64UrlEncode($signature);
        
        return $base64UrlHeader . '.' . $base64UrlPayload . '.' . $base64UrlSignature;
    }
    
    public static function verifyToken($token) {
        try {
            $parts = explode('.', $token);
            if (count($parts) != 3) {
                return false;
            }
            
            $payload = json_decode(self::base64UrlDecode($parts[1]), true);
            
            if ($payload['exp'] < time()) {
                return false;
            }
            
            $signature = hash_hmac(
                'sha256',
                $parts[0] . '.' . $parts[1],
                JWT_SECRET,
                true
            );
            
            $base64UrlSignature = self::base64UrlEncode($signature);
            
            return $parts[2] === $base64UrlSignature ? $payload : false;
        } catch (Exception $e) {
            return false;
        }
    }
    
    private static function base64UrlEncode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
    
    private static function base64UrlDecode($data) {
        return base64_decode(strtr($data, '-_', '+/') . str_repeat('=', 4 - strlen($data) % 4));
    }
    
    public static function getAuthorization() {
        $headers = getallheaders();
        
        if (isset($headers['Authorization'])) {
            $matches = [];
            if (preg_match('/Bearer\s+(.*)$/i', $headers['Authorization'], $matches)) {
                return self::verifyToken($matches[1]);
            }
        }
        
        return false;
    }
    
    public static function hashPassword($password) {
        return password_hash($password, PASSWORD_BCRYPT);
    }
    
    public static function verifyPassword($password, $hash) {
        return password_verify($password, $hash);
    }
}
?>
