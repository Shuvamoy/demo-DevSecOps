const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// VULNERABILITY: Hardcoded JWT Secret
const JWT_SECRET = "my-super-secret-key-12345";

// VULNERABILITY: Weak password hashing
function hashPassword(password) {
    return crypto.createHash('sha1').update(password).digest('hex');
}

// VULNERABILITY: No algorithm verification in JWT
function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (err) {
        return null;
    }
}

// VULNERABILITY: JWT with 'none' algorithm not blocked
function createToken(user) {
    return jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET,
        { expiresIn: '365d' }  // Vulnerability: Too long expiration
    );
}

// VULNERABILITY: Timing attack susceptible comparison
function comparePasswords(provided, stored) {
    return provided === stored;
}

// VULNERABILITY: Predictable random for password reset
function generateResetToken() {
    return Math.random().toString(36).substring(2, 15);
}

// VULNERABILITY: No rate limiting concept
const loginAttempts = {};
function checkLogin(username, password) {
    // No rate limiting implemented
    return true;
}

module.exports = {
    hashPassword,
    verifyToken,
    createToken,
    comparePasswords,
    generateResetToken,
    checkLogin
};
