const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const Booking = require('../models/Booking');
const User = require('../models/User');

// Proteger todas las rutas de reservas
// Mover esta línea después de las rutas públicas
// router.use(requireAuth);

// Ruta para obtener fechas no disponibles (debe estar ANTES del middleware requireAuth)
router.get('/disabled-dates', async (req, res) => {
    try {
        // Obtener todas las reservas existentes
        const bookings = await Booking.find({
            checkOut: { $gte: new Date() } // Solo reservas futuras o actuales
        });

        // Crear array de fechas no disponibles
        const disabledDates = [];
        bookings.forEach(booking => {
            let currentDate = new Date(booking.checkIn);
            const endDate = new Date(booking.checkOut);
            
            while (currentDate <= endDate) {
                disabledDates.push(currentDate.toISOString().split('T')[0]);
                currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
            }
        });

        // Eliminar duplicados si los hay
        const uniqueDisabledDates = [...new Set(disabledDates)];
        
        console.log('Fechas deshabilitadas:', uniqueDisabledDates); // Para depuración
        
        res.json({ disabledDates: uniqueDisabledDates });
    } catch (error) {
        console.error('Error al obtener fechas no disponibles:', error);
        res.status(500).json({ error: 'Error al obtener fechas no disponibles' });
    }
});

// Mover el middleware requireAuth aquí, después de las rutas públicas
router.use(requireAuth);

router.get('/', (req, res) => {
    res.render('bookings/index');
});

router.get('/summary', (req, res) => {
    res.render('bookings/summary');
});

router.get('/check-availability', async (req, res) => {
    try {
        const checkIn = new Date(req.query.checkIn);
        const checkOut = new Date(req.query.checkOut);
        
        const isAvailable = await Booking.checkAvailability(checkIn, checkOut);
        res.json({ available: isAvailable });
    } catch (error) {
        res.status(500).json({ error: 'Error al verificar disponibilidad' });
    }
});

router.get('/check-auth', (req, res) => {
    res.json({ isAuthenticated: !!req.session.userId });
});

// Create new booking
router.post('/', async (req, res) => {
    console.log('Datos recibidos:', req.body);
    try {
        if (!req.session.userId) {
            return res.status(401).json({ 
                success: false, 
                error: 'Debe iniciar sesión para realizar una reserva' 
            });
        }

        const booking = new Booking({
            user: req.session.userId,
            checkIn: new Date(req.body.checkIn),
            checkOut: new Date(req.body.checkOut),
            guests: {
                adults: parseInt(req.body.adults),
                children: parseInt(req.body.children) || 0
            },
            totalPrice: parseFloat(req.body.totalPrice)
        });

        await booking.save();
        
        res.status(201).json({ 
            success: true,
            message: 'Reserva creada exitosamente',
            booking: booking
        });
        console.log('Reserva guardada:', booking);
    } catch (error) {
        console.error('Error detallado:', error);
        res.status(500).json({ 
            success: false,
            error: 'Error al procesar la reserva'
        });
    }
});

router.get('/pago-exitoso', (req, res) => {
    res.render('bookings/pago-exitoso');
});

router.get('/pago-fallido', (req, res) => {
    res.render('bookings/pago-fallido');
});

// Ruta para ver las reservas del usuario
router.get('/mis-reservas', requireAuth, async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.session.userId })
            .sort({ checkIn: 1 });
        res.render('bookings/mis-reservas', { bookings });
    } catch (error) {
        console.error('Error al obtener las reservas:', error);
        res.status(500).send('Error al cargar las reservas');
    }
});

// Ruta para obtener fechas no disponibles (modificar la ruta)
// Update the route path to match the client request
router.get('/api/disabled-dates', async (req, res) => {
    try {
        // Obtener todas las reservas existentes
        const bookings = await Booking.find({
            checkOut: { $gte: new Date() } // Solo reservas futuras o actuales
        });

        // Crear array de fechas no disponibles
        const disabledDates = [];
        bookings.forEach(booking => {
            let currentDate = new Date(booking.checkIn);
            while (currentDate <= booking.checkOut) {
                // Formatear la fecha como YYYY-MM-DD
                const formattedDate = currentDate.toISOString().split('T')[0];
                disabledDates.push(formattedDate);
                currentDate.setDate(currentDate.getDate() + 1);
            }
        });

        // Eliminar duplicados si los hay
        const uniqueDisabledDates = [...new Set(disabledDates)];

        res.json({ disabledDates: uniqueDisabledDates });
    } catch (error) {
        console.error('Error al obtener fechas no disponibles:', error);
        res.status(500).json({ error: 'Error al obtener fechas no disponibles' });
    }
});

module.exports = router;

// Función para enviar email de confirmación
async function sendBookingConfirmation(booking, email) {
    // Implementa aquí la lógica de envío de email
    console.log('Email de confirmación enviado a:', email);
}