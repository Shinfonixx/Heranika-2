const express = require('express');
const router = express.Router();

// Ruta principal
router.get('/', (req, res) => {
    res.render('home/index'); // Cambiado de 'index' a 'home/index'
});

module.exports = router;