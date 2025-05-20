const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/database');
const path = require('path');
const expressLayouts = require('express-ejs-layouts');
require('dotenv').config();

const app = express();

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(expressLayouts);
app.set('layout', 'layout');

// Static files and other middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
const { setUserLocals } = require('./middleware/auth');

// Add session middleware before other middleware
// Connect to MongoDB
const mongoose = require('mongoose');
const mongoUrl = process.env.MONGODB_URI || 'mongodb://localhost:27017/heranika';

mongoose.connect(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Conexión exitosa a MongoDB');
    console.log('Base de datos:', mongoUrl.split('/').pop());
}).catch(err => {
    console.error('Error de conexión a MongoDB:', err);
    console.error('URL intentada:', mongoUrl);
});

// Update session middleware to use MongoDB
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: mongoUrl,
        collectionName: 'sessions',
        ttl: 24 * 60 * 60 // 1 día en segundos
    }),
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 horas
    }
}));

// Middleware
app.use(setUserLocals);

// Import routes
const paymentRoutes = require('./routes/payment'); // Ruta corregida
const authRoutes = require('./routes/auth');
const reviewRoutes = require('./routes/reviews');
const contactRoutes = require('./routes/contact');
const indexRoutes = require('./routes/index');

// Rutas específicas primero
app.use('/reservas', require('./routes/bookings')); // También corregir esta
app.use('/pagos', paymentRoutes);
app.use('/opiniones', reviewRoutes);
app.use('/contact', contactRoutes);
app.use('/', authRoutes);  // Rutas de autenticación
app.use('/', indexRoutes); // Rutas principales al final

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Servidor iniciado en el puerto ${PORT}`);
});