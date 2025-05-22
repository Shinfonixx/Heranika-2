document.addEventListener('DOMContentLoaded', function() {
    // Obtener los datos de la reserva del sessionStorage
    const bookingData = JSON.parse(sessionStorage.getItem('bookingData'));
    
    if (bookingData) {
        // Formatear fechas
        const formatDate = (dateString) => {
            if (!dateString) return '';
            const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
            return new Date(dateString).toLocaleDateString('es-ES', options);
        };

        // Actualizar la información en la página
        if (bookingData.checkIn) {
            document.getElementById('checkInDate').textContent = formatDate(bookingData.checkIn);
        }
        
        if (bookingData.checkOut) {
            document.getElementById('checkOutDate').textContent = formatDate(bookingData.checkOut);
        }

        // Mostrar información de huéspedes
        const adults = bookingData.adults || 1;
        const children = bookingData.children || 0;
        document.getElementById('guestsInfo').textContent = 
            `${adults} ${adults === 1 ? 'adulto' : 'adultos'}` + 
            (children > 0 ? `, ${children} ${children === 1 ? 'niño' : 'niños'}` : '');

        // Mostrar el total pagado
        if (bookingData.totalPrice) {
            document.getElementById('totalPaid').textContent = 
                `${parseFloat(bookingData.totalPrice).toFixed(2)} €`;
        }
    } else {
        console.warn('No se encontraron datos de reserva en el almacenamiento de sesión');
    }
});
