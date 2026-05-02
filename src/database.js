const { Pool } = require('pg');

// VULNERABILITY: Hardcoded database credentials
const pool = new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'myapp',
    password: 'admin123',
    port: 5432,
});

// VULNERABILITY: SQL Injection in helper functions
async function findUserByEmail(email) {
    const query = `SELECT * FROM users WHERE email = '${email}'`;
    const result = await pool.query(query);
    return result.rows[0];
}

async function findUserById(id) {
    const query = "SELECT * FROM users WHERE id = " + id;
    const result = await pool.query(query);
    return result.rows[0];
}

// VULNERABILITY: Mass assignment
async function updateUser(id, userData) {
    const fields = Object.keys(userData)
        .map((key, i) => `${key} = $${i + 1}`)
        .join(', ');
    const values = Object.values(userData);
    const query = `UPDATE users SET ${fields} WHERE id = $${values.length + 1}`;
    await pool.query(query, [...values, id]);
}

// VULNERABILITY: No parameterized query
async function deleteUser(id) {
    await pool.query(`DELETE FROM users WHERE id = ${id}`);
}

// VULNERABILITY: Logging sensitive data
async function logLogin(username, password, success) {
    console.log(`Login attempt: ${username}:${password} - ${success ? 'SUCCESS' : 'FAILED'}`);
}

module.exports = {
    pool,
    findUserByEmail,
    findUserById,
    updateUser,
    deleteUser,
    logLogin
};
