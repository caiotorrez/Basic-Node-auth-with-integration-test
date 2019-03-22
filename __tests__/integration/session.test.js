const factory = require('../factories');
const request = require('supertest');
const app = require('../../src/app');
const truncate = require('../utils/truncate');

describe('Authentication', () => {
    beforeEach(async () => {
        await truncate();
    })
     
    it('should receive JWT token when authenticated with valid credentials', async () => {
        const user = await factory.create('User', {
            password: '123123'
        })
        const res = await request(app).post('/session').send({
            email: user.email,
            password: '123123'
        });

        expect(res.status).toBe(200);
    });

    it('should not authentication with invalid credentials', async () => {
        const user = await factory.create('User');
        const res = await request(app).post('/session').send({
            email: user.email,
            password: '123123'
        });

        expect(res.status).toBe(401);
    });

    it('should recive jwt token when authenticated', async () => {
        const user = await factory.create('User', { password: '123123' });
        const res = await request(app).post('/session').send({
            email: user.email,
            password: '123123'
        });

        expect(res.body).toHaveProperty('token');
    });

    it('should be able to access private routes when authenticated', async () => {
        const user = await factory.create('User');
        const res = await request(app).get('/dashboard').set('authorization', `Bearer ${user.generateToken()}`);
        expect(res.status).toBe(200);
    });

    it('should not be able to access private routes when jwt token is not present', async () => {
        const user = await factory.create('User');
        const res = await request(app).get('/dashboard');
        expect(res.status).toBe(401);
    });

    it('should not be able to access private routes when token is invalid', async () => {
        const user = await factory.create('User');
        const res = await request(app).get('/dashboard').set('authorization', `Bearer 123123`);
        expect(res.status).toBe(401);
    });
});