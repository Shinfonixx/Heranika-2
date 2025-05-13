const express = require('express');
const router = express.Router();

router.post('/process', async (req, res) => {
    try {
        // Procesar el pago
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

router.get('/status/:id', async (req, res) => {
    try {
        // Verificar estado del pago
        res.json({ status: 'completed' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;