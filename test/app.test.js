const app = require('../app');
const request = require('supertest');

test('test healthcheck', async () => {
    await request(app)
        .get('/health')
        .expect(200);
})
test('test get /:ID', async () => {
    await request(app)
        .get('/v1/profile/123')
        .expect(401)
});