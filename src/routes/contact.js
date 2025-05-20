const express = require('express');
const router = express.Router();

// GET /contact - Mostrar página de contacto
router.get('/', (req, res) => {
    res.render('contact/index', {
        title: 'Contacto - Heranika'
    });
});

// POST /contact - Procesar formulario de contacto
router.post('/', async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;
        
        // Aquí puedes añadir la lógica para procesar el formulario
        // Por ejemplo, enviar un email, guardar en base de datos, etc.
        
        // Por ahora solo redirigimos con un mensaje de éxito
        req.flash('success', 'Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.');
        res.redirect('/contact');
    } catch (error) {
        console.error('Error al procesar el formulario de contacto:', error);
        req.flash('error', 'Hubo un error al enviar el mensaje. Por favor, inténtalo de nuevo.');
        res.redirect('/contact');
    }
});

module.exports = router;
