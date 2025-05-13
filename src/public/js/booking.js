document.addEventListener('DOMContentLoaded', function() {
    // Configuración del calendario
    flatpickr("#dateRange", {
        mode: "range",
        minDate: "today",
        locale: "es",
        dateFormat: "d/m/Y",
        disable: [], // Aquí se añadirán las fechas deshabilitadas
        onDayCreate: function(dObj, dStr, fp, dayElem) {
            // Esta función se ejecuta al crear cada día en el calendario
            if (dayElem.classList.contains('disabled')) {
                dayElem.style.backgroundColor = '#ffebee';
                dayElem.style.color = '#ff5252';
                dayElem.style.textDecoration = 'line-through';
            }
        },
        onChange: function(selectedDates) {
            if (selectedDates.length === 2) {
                updateBookingSummary(selectedDates[0], selectedDates[1]);
            }
        }
    });

    // Función para obtener y actualizar las fechas no disponibles
    async function updateDisabledDates() {
        try {
            const response = await fetch('/reservas/api/disabled-dates');
            const data = await response.json();
            const fp = document.querySelector("#dateRange")._flatpickr;
            fp.set('disable', data.disabledDates);
        } catch (error) {
            console.error('Error al obtener fechas no disponibles:', error);
        }
    }

    // Actualizar fechas no disponibles al cargar la página
    updateDisabledDates();
});