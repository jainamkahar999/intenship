const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('.')); // Serve static files (frontend.html)

// Signup Endpoint
app.post('/signup', (req, res) => {
    const { full_name, email, password } = req.body;
    const sql = 'INSERT INTO users (full_name, email, password) VALUES (?, ?, ?)';

    db.query(sql, [full_name, email, password], (err, result) => {
        if (err) {
            console.error(err);
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ success: false, message: 'Email already exists' });
            }
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        res.json({ success: true, message: 'User registered successfully!' });
    });
});

// Login Endpoint
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const sql = 'SELECT * FROM users WHERE email = ? AND password = ?';

    db.query(sql, [email, password], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        if (results.length > 0) {
            res.json({ success: true, message: 'Login successful!', user: results[0] });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
