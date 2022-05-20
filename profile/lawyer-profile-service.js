const db = require('../dba/firestore-facade');

async function getLawyerProfile(id) {
    return db.getDocFromDB('lawyerProfiles', id);
}

async function createLawyerProfile(data) {
    return db.addDataToDB('lawyerProfiles', data)
}
async function updateLawyerProfile(id, profileData) {
    return db.updateDocsInDB('lawyerProfiles', id, profileData);
}
async function disableLawyerProfile(id) {
    const modifiedData = { isDeleted: true };
    return db.updateDocsInDB('lawyerProfiles', id, modifiedData);
}
module.exports = {
    getLawyerProfile,
    createLawyerProfile,
    updateLawyerProfile,
    disableLawyerProfile
}