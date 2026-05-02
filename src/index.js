const express = require('express');
const app = express();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const ejs = require('ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const pool = new Pool({
    connectionString: process.env.DATABASE_URL
});

// VULNERABILITY 1: SQL Injection
// CodeQL will flag: Database query built from user-controlled sources
app.get('/user', async (req, res) => {
    const userId = req.query.id;
    const query = "SELECT * FROM users WHERE id = '" + userId + "'";
    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// VULNERABILITY 2: SQL Injection (another pattern)
app.get('/search', async (req, res) => {
    const searchTerm = req.query.q;
    const query = `SELECT * FROM products WHERE name LIKE '%${searchTerm}%'`;
    try {
        const result = await pool.query(query);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// VULNERABILITY 3: Cross-Site Scripting (XSS) - Reflected
// CodeQL will flag: Cross-site scripting vulnerability
app.get('/greet', (req, res) => {
    const name = req.query.name;
    res.send(`<html><body><h1>Hello, ${name}!</h1></body></html>`);
});

// VULNERABILITY 4: Cross-Site Scripting (XSS) - Stored concept
app.get('/profile', async (req, res) => {
    const userId = req.query.id;
    const result = await pool.query('SELECT bio FROM users WHERE id = $1', [userId]);
    const userBio = result.rows[0]?.bio || '';
    res.send(`<html><body><div class="bio">${userBio}</div></body></html>`);
});

// VULNERABILITY 5: Command Injection
// CodeQL will flag: Command built from user-controlled sources
app.get('/ping', (req, res) => {
    const host = req.query.host;
    exec('ping -c 4 ' + host, (error, stdout, stderr) => {
        if (error) {
            res.status(500).send(stderr);
            return;
        }
        res.send(`<pre>${stdout}</pre>`);
    });
});

// VULNERABILITY 6: Command Injection (another pattern)
app.post('/convert', (req, res) => {
    const filename = req.body.filename;
    exec(`convert ${filename} output.png`, (error, stdout) => {
        res.send(error ? 'Error' : 'Converted');
    });
});

// VULNERABILITY 7: Path Traversal
// CodeQL will flag: Uncontrolled file access
app.get('/file', (req, res) => {
    const filename = req.query.name;
    const filePath = path.join(__dirname, 'uploads', filename);
    res.sendFile(filePath);
});

// VULNERABILITY 8: Path Traversal (read file)
app.get('/download', (req, res) => {
    const file = req.query.file;
    const content = fs.readFileSync('/var/www/files/' + file);
    res.send(content);
});

// VULNERABILITY 9: Server-Side Template Injection (SSTI)
// CodeQL will flag: Template injection
app.get('/template', (req, res) => {
    const userTemplate = req.query.template;
    const rendered = ejs.render(userTemplate, { user: 'Guest' });
    res.send(rendered);
});

// VULNERABILITY 10: Insecure Deserialization
app.post('/data', (req, res) => {
    const serialized = req.body.data;
    try {
        const obj = JSON.parse(serialized);
        res.json(obj);
    } catch (err) {
        res.status(400).json({ error: 'Invalid JSON input' });
    }
});

// VULNERABILITY 11: Open Redirect
// CodeQL will flag: URL redirection from user-controlled source
app.get('/redirect', (req, res) => {
    const url = req.query.url;
    res.redirect(url);
});

// VULNERABILITY 12: Hardcoded Credentials (Secret Detection)
const DB_PASSWORD = "SuperSecret123!";
const API_KEY = "sk-1234567890abcdef1234567890abcdef";
const AWS_SECRET = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY";

// VULNERABILITY 13: Insecure Cookie
app.get('/login', (req, res) => {
    res.cookie('session', 'abc123', { 
        httpOnly: false,  // Vulnerable: should be true
        secure: false     // Vulnerable: should be true
    });
    res.send('Logged in');
});

// VULNERABILITY 14: Missing Authentication
app.delete('/admin/user/:id', async (req, res) => {
    const userId = req.params.id;
    await pool.query('DELETE FROM users WHERE id = $1', [userId]);
    res.json({ message: 'User deleted' });
});

// VULNERABILITY 15: CORS Misconfiguration
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
});

// VULNERABILITY 16: Information Exposure in Error Messages
app.get('/debug', async (req, res) => {
    try {
        const result = await pool.query(req.query.sql);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ 
            error: err.message,
            stack: err.stack,
            query: req.query.sql
        });
    }
});

// VULNERABILITY 17: XML External Entity (XXE) concept
const xml2js = require('xml2js');
app.post('/parse-xml', (req, res) => {
    const parser = new xml2js.Parser({
        explicitArray: false
    });
    parser.parseString(req.body, (err, result) => {
        res.json(result);
    });
});

// VULNERABILITY 18: Weak Cryptography
const crypto = require('crypto');
app.get('/hash', (req, res) => {
    const data = req.query.data;
    const hash = crypto.createHash('md5').update(data).digest('hex');
    res.json({ hash });
});

// VULNERABILITY 19: Prototype Pollution susceptibility
app.post('/config', (req, res) => {
    const config = {};
    const userConfig = req.body;
    for (let key in userConfig) {
        config[key] = userConfig[key];
    }
    res.json(config);
});

// VULNERABILITY 20: Regex DoS (ReDoS)
app.get('/validate-email', (req, res) => {
    const email = req.query.email;
    const regex = /^([a-zA-Z0-9]+)+@([a-zA-Z0-9]+\.)+[a-zA-Z]{2,}$/;
    const isValid = regex.test(email);
    res.json({ valid: isValid });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;
