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
    console.log('Datos recibidos en el servidor:', JSON.stringify(req.body, null, 2));
    
    try {
        // Verificar autenticación
        if (!req.session.userId) {
            console.error('Intento de reserva sin autenticación');
            return res.status(401).json({ 
                success: false, 
                error: 'Debe iniciar sesión para realizar una reserva' 
            });
        }

        // Validar datos requeridos
        const requiredFields = ['checkIn', 'checkOut', 'adults', 'totalPrice'];
        const missingFields = [];
        
        for (const field of requiredFields) {
            if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
                missingFields.push(field);
            }
        }
        
        if (missingFields.length > 0) {
            console.error('Campos requeridos faltantes:', missingFields);
            return res.status(400).json({
                success: false,
                error: `Los siguientes campos son requeridos: ${missingFields.join(', ')}`,
                missingFields: missingFields
            });
        }

        // Validar fechas
        const checkIn = new Date(req.body.checkIn);
        const checkOut = new Date(req.body.checkOut);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
            console.error('Fechas inválidas:', { 
                checkIn: req.body.checkIn, 
                checkOut: req.body.checkOut,
                parsedCheckIn: checkIn,
                parsedCheckOut: checkOut
            });
            return res.status(400).json({
                success: false,
                error: 'Las fechas proporcionadas no son válidas',
                details: {
                    checkIn: req.body.checkIn,
                    checkOut: req.body.checkOut
                }
            });
        }

        // Validar que la fecha de check-in no sea en el pasado
        if (checkIn < today) {
            return res.status(400).json({
                success: false,
                error: 'La fecha de entrada no puede ser en el pasado'
            });
        }

        // Validar que la fecha de salida sea posterior a la de entrada
        if (checkOut <= checkIn) {
            return res.status(400).json({
                success: false,
                error: 'La fecha de salida debe ser posterior a la de entrada'
            });
        }

        // Validar número de huéspedes
        const adults = parseInt(req.body.adults);
        const children = parseInt(req.body.children) || 0;
        const totalGuests = adults + children;
        
        if (isNaN(adults) || adults < 1) {
            return res.status(400).json({
                success: false,
                error: 'Debe haber al menos un adulto en la reserva'
            });
        }
        
        if (totalGuests > 10) { // Ajusta este límite según sea necesario
            return res.status(400).json({
                success: false,
                error: 'El número máximo de huéspedes por reserva es 10'
            });
        }

        // Verificar disponibilidad
        const existingBookings = await Booking.find({
            $or: [
                { 
                    checkIn: { $lt: checkOut },
                    checkOut: { $gt: checkIn }
                }
            ]
        });

        if (existingBookings.length > 0) {
            return res.status(400).json({
                success: false,
                error: 'Las fechas seleccionadas no están disponibles',
                details: {
                    checkIn: checkIn,
                    checkOut: checkOut,
                    conflictingBookings: existingBookings
                }
            });
        }

        // Crear la reserva
        const booking = new Booking({
            user: req.session.userId,
            checkIn: checkIn,
            checkOut: checkOut,
            guests: {
                adults: adults,
                children: children
            },
            totalPrice: parseFloat(req.body.totalPrice)
        });

        console.log('Intentando guardar reserva:', booking);

        // Guardar la reserva
        await booking.save();
        
        console.log('Reserva guardada exitosamente:', booking);
        
        // Enviar email de confirmación (opcional)
        try {
            const user = await User.findById(req.session.userId);
            if (user && user.email) {
                await sendBookingConfirmation(booking, user.email);
            }
        } catch (emailError) {
            console.error('Error al enviar el correo de confirmación:', emailError);
            // No fallar la reserva si hay error en el envío de correo
        }
        
        res.status(201).json({ 
            success: true,
            message: 'Reserva creada exitosamente',
            booking: booking
        });
    } catch (error) {
        console.error('Error al crear la reserva:', error);
        
        // Manejar errores de validación de Mongoose
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                error: 'Error de validación',
                details: errors
            });
        }
        
        // Manejar errores de duplicados
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'Ya existe una reserva con los mismos datos'
            });
        }
        
        res.status(500).json({ 
            success: false,
            error: 'Error al procesar la reserva',
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
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