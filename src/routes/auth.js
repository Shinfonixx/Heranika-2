const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.get('/login', (req, res) => {
    res.render('auth/login', { error: null });
});

router.get('/register', (req, res) => {
    res.render('auth/register', { error: null });
});

router.post('/register', async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // Verificar que las contraseñas coincidan
        if (password !== confirmPassword) {
            return res.render('auth/register', {
                error: 'Las contraseñas no coinciden',
                email: email,
                name: name
            });
        }

        const user = new User({ name, email, password });
        await user.save();

        // Iniciar sesión automáticamente después del registro
        req.session.userId = user._id;
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email
        };
        
        res.redirect('/');
    } catch (error) {
        console.error('Error en el registro:', error);
        let errorMessage = 'Error al crear la cuenta';
        
        if (error.code === 11000) {
            errorMessage = 'Este correo electrónico ya está registrado';
        }
        
        res.render('auth/register', {
            error: errorMessage,
            email: req.body.email,
            name: req.body.name
        });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await user.validatePassword(password))) {
            return res.render('auth/login', { error: 'Correo o contraseña incorrectos' });
        }

        // Store user information in session
        req.session.userId = user._id;
        req.session.user = {
            id: user._id,
            name: user.name,
            email: user.email
        };
        
        // Redirigir a la URL original si existe
        const redirectUrl = req.query.redirect || '/';
        res.redirect(redirectUrl);
    } catch (error) {
        console.error('Error en el login:', error);
        res.render('auth/login', { error: 'Error al iniciar sesión' });
    }
});

// Ruta para cerrar sesión
router.post('/logout', (req, res) => {
    // Destruir la sesión
    req.session.destroy((err) => {
        if(err) {
            console.error('Error al cerrar sesión:', err);
            return res.redirect('/');
        }
        // Redirigir al inicio después de cerrar sesión
        res.redirect('/');
    });
});

// Remove the /check endpoint as it's no longer needed
// router.get('/check', (req, res) => {
//     res.json({
//         isAuthenticated: !!req.session.userId
//     });
// });

// Make sure this is at the end of the file
module.exports = router;