/**
 * Rutas Principales
 * 
 * Este archivo define las rutas principales de la aplicación.
 * 
 * Rutas definidas:
 * - GET /: Muestra la página de inicio (home/index.ejs)
 * 
 * Otras rutas están organizadas en archivos separados:
 * - /auth: Autenticación de usuarios
 * - /bookings: Gestión de reservas
 * - /contact: Formulario de contacto
 * - /payment: Procesamiento de pagos
 * 
 * Cada ruta puede incluir sus propios middlewares de validación
 * y autenticación según sea necesario.
 */

const express = require('express');
const router = express.Router();

// Ruta principal
router.get('/', (req, res) => {
    res.render('home/index'); // Cambiado de 'index' a 'home/index'
});

module.exports = router;