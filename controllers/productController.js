const db = require('../config/database');

exports.getProducts = (req, res) => {
    db.all("SELECT * FROM products", [], (err, rows) => {
        if (err) return res.render('error', { error: err.message });
        res.render('index', { products: rows });
    });
};