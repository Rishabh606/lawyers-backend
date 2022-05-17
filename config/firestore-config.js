const admin = require('firebase-admin');

// make connection with firestore
// since database is in same project no service account key is required if deploying service 
// is authorised to access firestore
admin.initializeApp({
  credential: admin.credential.applicationDefault()
});

const firestore = admin.firestore();    //initialise firestore app

module.exports = {
    firestore,
    admin
};