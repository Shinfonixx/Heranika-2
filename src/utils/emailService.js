const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const sendBookingConfirmation = async (booking, userEmail) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: 'Confirmación de Reserva - Heranika',
        html: `
            <h1>¡Gracias por su reserva!</h1>
            <p>Su reserva ha sido confirmada con los siguientes detalles:</p>
            <ul>
                <li><strong>Check-in:</strong> ${booking.checkIn.toLocaleDateString()}</li>
                <li><strong>Check-out:</strong> ${booking.checkOut.toLocaleDateString()}</li>
                <li><strong>Huéspedes:</strong> ${booking.guests.adults} adultos, ${booking.guests.children} niños</li>
                <li><strong>Precio Total:</strong> €${booking.totalPrice}</li>
            </ul>
            <p>¡Esperamos darle la bienvenida pronto!</p>
        `
    };

    await transporter.sendMail(mailOptions);
};

module.exports = {
    sendBookingConfirmation
};