const supertest = require('supertest');
const app = require('../index');


describe("Testing the backend..", () => {
    it("tests the /getAllusers endpoint which should return status 200", async () => {
        const response = await supertest(app).get('/getAllusers');

        expect(response.status).toBe(200);
    });
    it("tests the /getUser endpoint", async () => {
        const response1 = await supertest(app).get('/getUser?email=mara@gmail.com');
        expect(response1.status).toBe(200);

        const response2 = await supertest(app).get('/getUser?email=lan@g.com');
        expect(response2.status).toBe(404);
    });
});