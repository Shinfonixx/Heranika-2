/**
 * Modelo de Reseña (Review)
 * 
 * Define la estructura de datos para las reseñas de los usuarios.
 * 
 * Campos principales:
 * - user: Referencia al usuario que hizo la reseña (obligatorio)
 * - title: Título de la reseña (obligatorio)
 * - content: Contenido de la reseña (obligatorio)
 * - rating: Calificación del 1 al 5 (obligatorio)
 * - createdAt / updatedAt: Fechas de creación y actualización
 * 
 * Relaciones:
 * - Pertenece a un Usuario (User)
 */

const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);