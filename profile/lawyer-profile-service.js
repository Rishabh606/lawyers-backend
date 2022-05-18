const db = require('../dba/firestore-facade');

async function getLawyerProfile(id) {
    return db.getDocFromDB('lawyerProfiles', id);
}

async function createLawyerProfile(data) {
    return db.addDataToDB('lawyerProfiles', data)
}