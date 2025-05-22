/**
 * Middleware de Autenticación
 * 
 * Este módulo maneja la autenticación de usuarios en la aplicación:
 * 
 * Funcionalidades principales:
 * - setUserLocals: Añade los datos del usuario a res.locals para acceso en las vistas
 * - requireAuth: Middleware que protege rutas, redirigiendo a login si no hay sesión
 * 
 * Características de seguridad:
 * - Verificación de sesión en cada petición
 * - Almacenamiento seguro de la sesión en MongoDB
 * - Manejo de usuarios autenticados en las vistas
 * 
 * Uso típico:
 * router.get('/ruta-protegida', requireAuth, (req, res) => { ... })
 */

const User = require('../models/User');

const setUserLocals = async (req, res, next) => {
    try {
        if (req.session.userId) {
            const user = await User.findById(req.session.userId);
            res.locals.user = user ? {
                id: user._id,
                name: user.name,
                email: user.email
            } : null;
        } else {
            res.locals.user = null;
        }
        next();
    } catch (error) {
        console.error('Error al establecer datos del usuario:', error);
        res.locals.user = null;
        next();
    }
};

const requireAuth = (req, res, next) => {
    if (!req.session.userId) {
        return res.redirect('/login?redirect=' + encodeURIComponent(req.originalUrl));
    }
    next();
};

module.exports = { setUserLocals, requireAuth };