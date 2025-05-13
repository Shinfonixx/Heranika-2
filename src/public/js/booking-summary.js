document.addEventListener('DOMContentLoaded', function() {
    // Recuperar datos de la reserva
    const bookingData = JSON.parse(sessionStorage.getItem('bookingData'));
    
    if (!bookingData) {
        console.error('No se encontraron datos de reserva');
        return;
    }

    // Función auxiliar para actualizar el texto de manera segura
    function setTextContentSafely(id, text) {
        const element = document.getElementById(id);
        if (element) {
            element.textContent = text;
        }
    }
    
    // Mostrar los datos en el resumen de manera segura
    setTextContentSafely('summaryCheckIn', bookingData.checkIn);
    setTextContentSafely('summaryCheckOut', bookingData.checkOut);
    setTextContentSafely('summaryNights', `${bookingData.nights} noches`);
    setTextContentSafely('summaryAdults', bookingData.adults);
    setTextContentSafely('summaryChildren', bookingData.children);
    setTextContentSafely('nightsCount', bookingData.nights);
    setTextContentSafely('summaryTotalPrice', `${bookingData.totalPrice}`);

    // Configurar PayPal
    paypal.Buttons({
        style: {
            layout: 'vertical',
            color: 'gold',
            shape: 'rect',
            label: 'paypal'
        },
        createOrder: function(data, actions) {
            try {
                const price = parseFloat(bookingData.totalPrice);
                
                if (isNaN(price) || price <= 0) {
                    mostrarError('El precio no es válido. Por favor, vuelve a intentarlo.');
                    return null;
                }

                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: price.toFixed(2),
                            currency_code: 'EUR'
                        },
                        description: `Reserva Heranika - ${bookingData.nights} noches, ${bookingData.adults} adultos, ${bookingData.children} niños`
                    }]
                });
            } catch (error) {
                console.error('Error al crear la orden:', error);
                mostrarError('No se pudo procesar el pago. Por favor, inténtalo de nuevo.');
                return null;
            }
        },
        onApprove: function(data, actions) {
            mostrarCargando();
            return actions.order.capture()
                .then(function(details) {
                    console.log('Pago completado:', details);
                    sessionStorage.setItem('paymentDetails', JSON.stringify(details));
                    window.location.href = '/reservas/pago-exitoso';
                })
                .catch(function(error) {
                    console.error('Error al capturar el pago:', error);
                    window.location.href = '/reservas/pago-fallido';
                });
        },
        onError: function(err) {
            console.error('Error en el pago:', err);
            mostrarError('Ha ocurrido un error durante el proceso de pago. Por favor, inténtalo de nuevo.');
            window.location.href = '/reservas/pago-fallido';
        }
    }).render('#paypal-button-container')
    .catch(function(error) {
        console.error('Error al renderizar el botón de PayPal:', error);
        mostrarError('No se pudo cargar el botón de pago. Por favor, recarga la página.');
    });

    function mostrarError(mensaje) {
        const errorContainer = document.getElementById('error-container') || crearErrorContainer();
        errorContainer.textContent = mensaje;
        errorContainer.style.display = 'block';
        setTimeout(() => {
            errorContainer.style.display = 'none';
        }, 5000);
    }

    function crearErrorContainer() {
        const container = document.createElement('div');
        container.id = 'error-container';
        container.className = 'error-message';
        document.querySelector('.payment-section').prepend(container);
        return container;
    }

    function mostrarCargando() {
        const loadingContainer = document.createElement('div');
        loadingContainer.className = 'loading-container';
        loadingContainer.innerHTML = `
            <div class="loading-spinner"></div>
            <p>Procesando tu pago...</p>
        `;
        document.querySelector('.payment-section').appendChild(loadingContainer);
    }
});