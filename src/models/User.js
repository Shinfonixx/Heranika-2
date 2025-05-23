/**
 * Modelo de Usuario (User)
 * 
 * Define la estructura de datos para los usuarios de la aplicación.
 * 
 * Campos principales:
 * - name: Nombre del usuario (obligatorio)
 * - email: Correo electrónico (único, obligatorio)
 * - password: Contraseña hasheada (obligatorio)
 * - createdAt / updatedAt: Marcas de tiempo automáticas
 * 
 * Funcionalidades:
 * - Hasheo automático de contraseñas antes de guardar
 * - Método para validar contraseñas
 * 
 * Relaciones:
 * - Tiene muchas Reservas (Bookings)
 */

const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

// Middleware para hashear la contraseña antes de guardar
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para validar la contraseña
userSchema.methods.validatePassword = async function(password) {
    return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model('User', userSchema);