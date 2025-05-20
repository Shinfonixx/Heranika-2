document.addEventListener('DOMContentLoaded', function() {
    // Verificar si el botón de PayPal ya está inicializado
    const buttonContainer = document.getElementById('paypal-button-container');
    if (buttonContainer && buttonContainer.hasChildNodes()) {
        console.log('Botón de PayPal ya inicializado');
        return;
    }
    // Recuperar datos de la reserva
    const bookingData = JSON.parse(sessionStorage.getItem('bookingData'));
    
    if (!bookingData) {
        console.error('No se encontraron datos de reserva');
        return;
    }

    console.log('Datos de reserva recuperados:', bookingData);

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

    // Verificar si el SDK de PayPal está cargado correctamente
    if (typeof window.paypal === 'undefined') {
        console.error('El SDK de PayPal no está cargado');
        mostrarError('No se pudo cargar el servicio de pago. Por favor, recarga la página.');
        return;
    }

    console.log('SDK de PayPal disponible:', typeof window.paypal);

    // Configurar PayPal
    try {
        console.log('Iniciando configuración de PayPal');
        
        // Primero limpiar cualquier contenido anterior en el contenedor
        const buttonContainer = document.getElementById('paypal-button-container');
        if (buttonContainer) {
            buttonContainer.innerHTML = '';
        }

        // Crear el botón de PayPal
        paypal.Buttons({
            style: {
                layout: 'horizontal',
                color: 'gold',
                shape: 'pill',
                label: 'paypal',
                tagline: false
            },
            createOrder: function(data, actions) {
                try {
                    const bookingData = JSON.parse(sessionStorage.getItem('bookingData'));
                    if (!bookingData) {
                        throw new Error('No se encontraron datos de reserva');
                    }

                    const price = parseFloat(bookingData.totalPrice);
                    if (isNaN(price) || price <= 0) {
                        throw new Error('El precio no es válido');
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
                return actions.order.capture().then(function(details) {
                    console.log('Pago completado:', details);

                    // Convertir las fechas al formato ISO
                    const [day, month, year] = bookingData.checkIn.split('/');
                    const checkInDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                    
                    const [dayOut, monthOut, yearOut] = bookingData.checkOut.split('/');
                    const checkOutDate = `${yearOut}-${monthOut.padStart(2, '0')}-${dayOut.padStart(2, '0')}`;
                    
                    // Preparar los datos para enviar al servidor
                    const serverData = {
                        checkIn: checkInDate,
                        checkOut: checkOutDate,
                        nights: parseInt(bookingData.nights),
                        adults: parseInt(bookingData.adults),
                        children: parseInt(bookingData.children) || 0,
                        totalPrice: parseFloat(bookingData.totalPrice),
                        paymentDetails: details
                    };

                    console.log('Enviando datos al servidor:', serverData);

                    // Enviar los datos al servidor
                    return fetch('/reservas', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(serverData)
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Respuesta del servidor:', data);
                        if (data.success) {
                            // Guardar también los detalles del pago
                            const currentBookingData = JSON.parse(sessionStorage.getItem('bookingData'));
                            currentBookingData.paymentDetails = details;
                            sessionStorage.setItem('bookingData', JSON.stringify(currentBookingData));
                            window.location.href = '/reservas/pago-exitoso';
                        } else {
                            throw new Error(data.error || 'Error al guardar la reserva');
                        }
                    })
                    .catch(error => {
                        console.error('Error al guardar la reserva:', error);
                        mostrarError('Error al procesar la reserva: ' + error.message);
                    });
                })
                .catch(function(error) {
                    console.error('Error al capturar el pago:', error);
                    mostrarError('Error al procesar el pago: ' + error.message);
                });
            },
            onError: function(err) {
                console.error('Error en el pago:', err);
                mostrarError('Ha ocurrido un error durante el proceso de pago. Por favor, inténtalo de nuevo.');
                window.location.href = '/reservas/pago-fallido';
            }
        }).render('#paypal-button-container');
    } catch (error) {
        console.error('Error al configurar el botón de PayPal:', error);
        mostrarError('Hubo un error al configurar el pago. Por favor, inténtalo de nuevo.');
    }

    function mostrarError(mensaje) {
        console.error('Error mostrado:', mensaje);
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
        loadingContainer.innerHTML = '<div class="spinner"></div><p>Procesando pago...</p>';
        document.querySelector('.payment-section').prepend(loadingContainer);
    }
});