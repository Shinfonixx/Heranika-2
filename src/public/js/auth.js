function validarContraseña(password) {
    // Mínimo 8 caracteres, al menos una letra mayúscula, una minúscula, un número y un carácter especial
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
}

function mostrarErrorContraseña(mensaje) {
    const errorDiv = document.getElementById('password-error');
    if (!errorDiv) {
        const div = document.createElement('div');
        div.id = 'password-error';
        div.className = 'alert alert-danger mt-2';
        div.textContent = mensaje;
        document.querySelector('input[type="password"]').parentNode.appendChild(div);
    } else {
        errorDiv.textContent = mensaje;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const passwordInput = document.querySelector('input[type="password"]');

    passwordInput.addEventListener('input', function() {
        const password = this.value;
        if (!validarContraseña(password)) {
            mostrarErrorContraseña('La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial');
            this.classList.add('is-invalid');
        } else {
            const errorDiv = document.getElementById('password-error');
            if (errorDiv) errorDiv.remove();
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
        }
    });

    form.addEventListener('submit', function(e) {
        const password = passwordInput.value;
        if (!validarContraseña(password)) {
            e.preventDefault();
            mostrarErrorContraseña('La contraseña no cumple con los requisitos de seguridad');
        }
    });
});