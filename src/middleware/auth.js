const User = require('../models/User'); // Añadir esta línea al principio

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