const express = require('express');
const router = express.Router();
const { requireAuth } = require('../middleware/auth');
const Review = require('../models/Review');

// Your routes here...

// Ruta para editar una reseña
router.put('/:id', requireAuth, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        
        // Verificar si la reseña existe y pertenece al usuario
        if (!review || review.user.toString() !== req.session.userId) {
            return res.status(403).json({ 
                error: 'No tienes permiso para editar esta reseña' 
            });
        }

        // Actualizar la reseña
        const { title, content, rating } = req.body;
        review.title = title;
        review.content = content;
        review.rating = parseInt(rating);
        
        await review.save();
        res.json({ message: 'Reseña actualizada correctamente' });
    } catch (error) {
        console.error('Error al editar la reseña:', error);
        res.status(500).json({ error: 'Error al editar la reseña' });
    }
});

// Ruta para eliminar una reseña
router.delete('/:id', requireAuth, async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);
        
        // Verificar si la reseña existe y pertenece al usuario
        if (!review || review.user.toString() !== req.session.userId) {
            return res.status(403).json({ 
                error: 'No tienes permiso para eliminar esta reseña' 
            });
        }

        await review.deleteOne();
        res.json({ message: 'Reseña eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar la reseña:', error);
        res.status(500).json({ error: 'Error al eliminar la reseña' });
    }
});

// Ruta para crear una nueva reseña
router.post('/', requireAuth, async (req, res) => {
    try {
        const { title, content, rating } = req.body;
        
        // Crear la nueva reseña
        const review = new Review({
            user: req.session.userId,
            title,
            content,
            rating: parseInt(rating)
        });

        await review.save();
        res.redirect('/opiniones');
    } catch (error) {
        console.error('Error al crear la reseña:', error);
        res.status(500).json({ error: 'Error al crear la reseña' });
    }
});

router.get('/', async (req, res) => {
    try {
        const reviews = await Review.find()
            .populate('user', 'name id') // Asegúrate de incluir el id
            .sort({ createdAt: -1 });
        res.render('reviews/index', { 
            reviews,
            user: req.session.user // Asegúrate de pasar el usuario a la vista
        });
    } catch (error) {
        console.error('Error al obtener las opiniones:', error);
        res.status(500).send('Error al cargar las opiniones');
    }
});

module.exports = router;  // Make sure this is present