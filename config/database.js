const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, 'catalog.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) console.error('Database connection error:', err.message);
    else console.log('Connected to the SQLite database.');
});

// Seed data
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, price REAL, description TEXT
    )`);
    db.get("SELECT COUNT(*) as count FROM products", (err, row) => {
        if (row.count === 0) {
            db.run(`INSERT INTO products (name, price, description) VALUES 
            ('Wireless Headphones', 99.99, 'Noise-cancelling over-ear headphones.'),
            ('Mechanical Keyboard', 129.50, 'RGB mechanical keyboard with blue switches.')`);
        }
    });
});

module.exports = db;