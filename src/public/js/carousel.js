document.addEventListener('DOMContentLoaded', function() {
    // Obtener elementos
    const mainImage = document.querySelector('#carouselMain img');
    const thumbs = document.querySelectorAll('.carousel-thumb');
    const prevBtn = document.querySelector('#prevBtn');
    const nextBtn = document.querySelector('#nextBtn');
    let currentImageIndex = 0;

    // Verificar que los elementos existen
    if (!mainImage || !prevBtn || !nextBtn || !thumbs.length) {
        console.error('Elementos del carrusel no encontrados');
        return;
    }

    // Función para actualizar la imagen principal
    function updateMainImage(index) {
        const selectedThumb = thumbs[index];
        const img = selectedThumb.querySelector('img');
        const src = img.src;
        const alt = img.alt || 'Imagen de la galería';

        // Actualizar la imagen principal
        mainImage.src = src;
        mainImage.alt = alt;
        mainImage.classList.add('active');

        // Actualizar el overlay (si existe)
        const overlay = mainImage.nextElementSibling;
        if (overlay && overlay.classList.contains('carousel-overlay')) {
            overlay.innerHTML = `
                <h3>${alt}</h3>
            `;
        }

        // Actualizar el estado de las miniaturas
        thumbs.forEach((thumb, i) => {
            thumb.classList.toggle('active', i === index);
        });
    }

    // Event listener para las miniaturas
    thumbs.forEach((thumb, index) => {
        thumb.addEventListener('click', () => {
            currentImageIndex = index;
            updateMainImage(index);
        });
    });

    // Event listeners para los botones de control
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + thumbs.length) % thumbs.length;
            updateMainImage(currentImageIndex);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % thumbs.length;
            updateMainImage(currentImageIndex);
        });
    }

    // Inicializar con la primera imagen
    updateMainImage(0);
});
