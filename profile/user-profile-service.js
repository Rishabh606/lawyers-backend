const db = require('../dba/firestore-facade');

async function getUserProfile(id) {
    return db.getDocFromDB('userProfiles', id);
}

async function createUserProfile(data) {
    return db.addDataToDB('userProfiles', data);
}
async function updateUserProfile(id, profileData) {
    return db.updateDocsInDB('userProfiles', id, profileData);
}
async function disableUserProfile(id) {
    const modifiedData = { isDeleted: true };
    return db.updateDocsInDB('userProfiles', id, modifiedData);
}
module.exports = {
    getUserProfile,
    createUserProfile,
    updateUserProfile,
    disableUserProfile,
};
