const rateLimit = require('express-rate-limit');

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // límite de 100 solicitudes por ventana
    message: 'Demasiadas solicitudes desde esta IP, por favor intente de nuevo más tarde',
    standardHeaders: true,
    legacyHeaders: false
});

const bookingLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 5, // límite de 5 reservas por hora
    message: 'Has alcanzado el límite de intentos de reserva, por favor intenta más tarde'
});

module.exports = {
    apiLimiter,
    bookingLimiter
};