// Animación de fade para la sección hero
const heroSection = document.querySelector('.hero-section');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    // Si se está haciendo scroll hacia abajo
    if (currentScroll > lastScroll) {
        heroSection.style.opacity = '0';
        heroSection.style.transition = 'opacity 0.5s ease-out';
    }
    // Si se está haciendo scroll hacia arriba
    else {
        heroSection.style.opacity = '1';
        heroSection.style.transition = 'opacity 0.5s ease-in';
    }
    
    lastScroll = currentScroll;
});
