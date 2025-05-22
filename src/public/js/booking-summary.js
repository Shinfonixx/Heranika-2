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
    
    // Asegurarse de que los datos de huéspedes estén definidos
    const adults = parseInt(bookingData.adults) || 1; // Valor por defecto: 1 adulto
    const children = parseInt(bookingData.children) || 0; // Valor por defecto: 0 niños
    const nights = parseInt(bookingData.nights) || 1; // Valor por defecto: 1 noche
    
    // Actualizar los datos en el objeto bookingData
    bookingData.adults = adults;
    bookingData.children = children;
    bookingData.nights = nights;
    
    // Si no existe el campo guests, crearlo
    if (!bookingData.guests) {
        bookingData.guests = `${adults} ${adults === 1 ? 'adulto' : 'adultos'}`;
        if (children > 0) {
            bookingData.guests += `, ${children} ${children === 1 ? 'niño' : 'niños'}`;
        }
    }
    
    // Guardar los datos actualizados en sessionStorage
    sessionStorage.setItem('bookingData', JSON.stringify(bookingData));
    
    console.log('Datos de reserva procesados:', bookingData); // Para depuración
    
    // Mostrar los datos en el resumen de manera segura
    setTextContentSafely('summaryCheckIn', bookingData.checkIn || 'No especificado');
    setTextContentSafely('summaryCheckOut', bookingData.checkOut || 'No especificado');
    setTextContentSafely('summaryNights', `${nights} ${nights === 1 ? 'noche' : 'noches'}`);
    
    // Mostrar la información de huéspedes
    setTextContentSafely('summaryAdults', `${adults} ${adults === 1 ? 'adulto' : 'adultos'}`);
    setTextContentSafely('summaryChildren', `${children} ${children === 1 ? 'niño' : 'niños'}`);
    
    // También actualizar el contador general de huéspedes si existe el elemento
    if (document.getElementById('guestsCount')) {
        const guestsText = `${adults} ${adults === 1 ? 'adulto' : 'adultos'}` + 
                         (children > 0 ? `, ${children} ${children === 1 ? 'niño' : 'niños'}` : '');
        setTextContentSafely('guestsCount', guestsText);
    }
    
    // Mostrar el total
    if (bookingData.totalPrice) {
        const totalPrice = parseFloat(bookingData.totalPrice).toFixed(2);
        setTextContentSafely('summaryTotalPrice', `${totalPrice} €`);
    } else {
        setTextContentSafely('summaryTotalPrice', 'Precio no disponible');
    }

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
            onApprove: async function(data, actions) {
                mostrarCargando();
                try {
                    const details = await actions.order.capture();
                    console.log('Pago completado:', details);

                    // Convertir las fechas al formato ISO
                    const [day, month, year] = bookingData.checkIn.split('/');
                    const checkInDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
                    
                    const [dayOut, monthOut, yearOut] = bookingData.checkOut.split('/');
                    const checkOutDate = `${yearOut}-${monthOut.padStart(2, '0')}-${dayOut.padStart(2, '0')}`;
                    
                    // Asegurarse de que los datos numéricos sean correctos
                    const adults = bookingData.adults ? parseInt(bookingData.adults) : 1; // Valor por defecto 1 si no está definido
                    const children = bookingData.children ? parseInt(bookingData.children) : 0;
                    const nights = parseInt(bookingData.nights);
                    
                    // Validar que los números sean válidos
                    if (isNaN(adults) || adults < 1) {
                        throw new Error('Número de adultos no válido');
                    }
                    if (isNaN(children) || children < 0) {
                        throw new Error('Número de niños no válido');
                    }
                    if (isNaN(nights) || nights < 1) {
                        throw new Error('Número de noches no válido');
                    }

                    // Preparar los datos para enviar al servidor
                    const serverData = {
                        checkIn: checkInDate,
                        checkOut: checkOutDate,
                        nights: nights,
                        adults: adults,
                        children: children,
                        totalPrice: parseFloat(bookingData.totalPrice.toString().replace(',', '.')), // Asegurar formato decimal correcto
                        paymentDetails: details
                    };
                    
                    console.log('Datos de la reserva:', {
                        ...serverData,
                        paymentDetails: { id: serverData.paymentDetails.id } // Mostrar solo el ID del pago para simplificar
                    });

                    console.log('Enviando datos al servidor:', JSON.stringify(serverData, null, 2));

                    // Verificar que el usuario esté autenticado
                    const authCheck = await fetch('/reservas/check-auth');
                    const authData = await authCheck.json();
                    
                    if (!authData.isAuthenticated) {
                        throw new Error('Debes iniciar sesión para completar la reserva');
                    }

                    // Enviar los datos al servidor
                    const response = await fetch('/reservas', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        credentials: 'same-origin',
                        body: JSON.stringify(serverData)
                    });
                    
                    if (!response.ok) {
                        const errorData = await response.json().catch(() => ({}));
                        console.error('Error en la respuesta del servidor:', errorData);
                        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
                    }
                    
                    const responseData = await response.json();
                    console.log('Respuesta del servidor:', responseData);
                    
                    if (responseData.success) {
                        // Guardar también los detalles del pago
                        const currentBookingData = JSON.parse(sessionStorage.getItem('bookingData'));
                        currentBookingData.paymentDetails = details;
                        sessionStorage.setItem('bookingData', JSON.stringify(currentBookingData));
                        window.location.href = '/reservas/pago-exitoso';
                    } else {
                        throw new Error(responseData.error || 'Error al guardar la reserva');
                    }
                } catch (error) {
                    console.error('Error al procesar la reserva:', error);
                    mostrarError('Error al procesar la reserva: ' + (error.message || 'Error desconocido'));
                    // No es necesario relanzar el error ya que ya lo estamos manejando
                }
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