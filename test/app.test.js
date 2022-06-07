const app = require('../app');
const request = require('supertest');
const db = require('../dba/firestore-facade');

jest.mock('../dba/firestore-facade');

db.verifyToken.mockResolvedValue(true);

test('test healthcheck', async () => {
    await request(app)
        .get('/health')
        .expect(200);
});
test('test get /:ID', async () => {
    const lawyerData =
    {
        "name": "TestingUserCreate",
        "email": "example@huehue.com",
        "mobileNumber": "1234567890",
    }
    db.getDocFromDB.mockResolvedValue(lawyerData);
    await request(app)
        .get('/v1/profile/123')
        .set('authorization', 'Bearer bcd')
        .expect(200)
        .then(response => {
            expect(response.body).toStrictEqual(lawyerData);
        });
});
test('test post', async () => {
    const lawyerData = {
        "name": "TestingUserCreate",
        "email": "example@huehue.com",
        "mobileNumber": "1234567890",
        "officeAddress": [
            "Some",
            "address"
        ],
        "cityOfPractice": "bhubaneswar",
        "country": "india",
        "description": "someDescription",
        "practiceStartDate": "someDate",
        "price": "420",
        "practiceArea": "practiceArea",
        "otherPracticeAreas": [
            "other",
            "practice",
            "areas"
        ],
        "image": "image string",
        "rating": "69",
        "awards": "awards awards awards",
        "clientHistory": {
            "transactionObject": {},
            "clientID": "client ID",
            "lawyerID": "lawyer ID",
            "scheduleObject": {
                "datetime": "date and time",
                "subject": "subject"
            }
        },
        "unnecessaryKey": "unnecessaryData",
    }
    db.addDataToDB.mockResolvedValue(lawyerData);
    await request(app)
        .post('/v1/profile')
        .set('authorization', 'Bearer bcd')
        .send(lawyerData)
        .expect(201);
});
test('test delete', async () => {
    db.updateDocsInDB.mockResolvedValue(1);
    await request(app)
        .delete('/v1/profile/123')
        .set('authorization', 'Bearer bcd')
        .expect(204);
});