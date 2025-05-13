const request = require('supertest');
const app = require('../src/app');
const { expect } = require('chai');

describe('Pruebas de Reservas', () => {
    describe('POST /api/bookings', () => {
        it('debería crear una nueva reserva con datos válidos', async () => {
            const bookingData = {
                checkIn: '2024-02-01',
                checkOut: '2024-02-03',
                adults: 2,
                children: 1,
                totalPrice: 150
            };

            const response = await request(app)
                .post('/api/bookings')
                .send(bookingData);

            expect(response.status).to.equal(201);
            expect(response.body).to.have.property('id');
        });

        it('debería rechazar una reserva con datos inválidos', async () => {
            const invalidData = {
                checkIn: 'fecha-invalida',
                adults: -1
            };

            const response = await request(app)
                .post('/api/bookings')
                .send(invalidData);

            expect(response.status).to.equal(400);
        });
    });
});