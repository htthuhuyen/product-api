const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');

const MONGO_URI =
    process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/productdb_test';

beforeAll(async () => {
    await mongoose.connect(MONGO_URI);
});

afterAll(async () => {
    await mongoose.connection.close();
});

beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();
});

describe('Product API CRUD Test', () => {

    test('CREATE - should create a new product', async () => {
        const response = await request(app)
            .post('/api/products')
            .send({
                pid: 'P001',
                pname: 'Laptop',
                price: 15000000,
                quantity: 10
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.pid).toBe('P001');
        expect(response.body.pname).toBe('Laptop');
    });

    test('READ - should get all products', async () => {
        await request(app)
            .post('/api/products')
            .send({
                pid: 'P002',
                pname: 'Mouse',
                price: 300000,
                quantity: 20
            });

        const response = await request(app)
            .get('/api/products');

        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].pid).toBe('P002');
    });

    test('UPDATE - should update a product', async () => {
        await request(app)
            .post('/api/products')
            .send({
                pid: 'P003',
                pname: 'Keyboard',
                price: 500000,
                quantity: 15
            });

        const response = await request(app)
            .put('/api/products/P003')
            .send({
                pname: 'Mechanical Keyboard',
                price: 700000,
                quantity: 12
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.pname).toBe('Mechanical Keyboard');
        expect(response.body.price).toBe(700000);
        expect(response.body.quantity).toBe(12);
    });

    test('DELETE - should delete a product', async () => {
        await request(app)
            .post('/api/products')
            .send({
                pid: 'P004',
                pname: 'Monitor',
                price: 4000000,
                quantity: 5
            });

        const response = await request(app)
            .delete('/api/products/P004');

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe(
            'Product deleted successfully'
        );
    });

});