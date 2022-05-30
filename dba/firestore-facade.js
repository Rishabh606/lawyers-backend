
const { firestore, admin } = require('../config/firestore-config');
const logger = require('../utils/winston-logger');

async function getDocFromDB(collectionPath, docID) {
    logger.info("getDocFromDB");
    const docRef = firestore.collection(collectionPath).doc(docID);
    const doc = await docRef.get();
    if (!doc.exists) {
        throw new Error("No such doc exists");
    }
    return doc.data();
}
async function addDataToDB(colletionPath, data) {
    return firestore.collection(colletionPath).add(data);
}
async function getAllDocsFromDB(collectionPath) {
    logger.info("geAllDocsFromDB: ", collectionPath);
    const collectionRef = firestore.collection(collectionPath).get();
    return collectionRef.docs.map(doc => doc.data());
}
async function updateDocsInDB(collectionPath, docID, data) {
    logger.info(`updateDocsInDB: ${collectionPath}/${docID}`);
    return firestore.collection(collectionPath).doc(docID).update(data);
}
function getAllDataFromDBWithRealtimeSync(database, documentID, path, classRef) {
    //get all objects in the give database path and reference
    //places watch on the given collection of firestore
    //firestore automatically transmits any updates to database like adding, editing, or deleting the actions in firestore database
    //both policy and action syncing use this function; the classRef is used for that purpose

    //returns promise to use async await by the caller function 
    return new Promise((resolve, reject) => {
        try {
            let collectionPath = database + '/' + documentID + '/' + path;                                //build firestore collection path
            let collectionRef = firestore.collection(collectionPath);                           //get collection reference 

            collectionRef.onSnapshot((querySnapShot) => {                              //iterate over each query that was made on firestore collection underwatch

                logger.debug("Inside query snap shots")
                let changes = querySnapShot.docChanges();                            //get all document changes for that query change           

                for (let change of changes) {

                    if (change.type === 'added') {                               //if document was added this is called. Also fetches all documents in first call
                        logger.debug('data added');

                        //the classRef, a controller, will call its own json to class instance converter method to create new instance of the relevant class using json

                        classRef.addToMap(documentID, change.doc.id, change.doc.data());
                    }
                    if (change.type === 'modified') {                                       //if any document is modified
                        logger.debug('data modified');
                        classRef.addToMap(documentID, change.doc.id, change.doc.data());    //replace or add use same function utlising replacement property of map
                    }
                    if (change.type === 'removed') {                                        //if any document is deleted
                        logger.debug('data deleted');
                        classRef.deleteFromMap(documentID, change.doc.id);                   //delete class instance
                    }
                }
                resolve(1);
            });
        } catch (e) {
            reject(e)
        }
    });
}
async function verifyToken(idToken) {
    let checkRevoked = true;
    return admin
        .auth()
        .verifyIdToken(idToken, checkRevoked)
        .then(() => {
            return true;
        })
        .catch((error) => {
            logger.info(error);
            if (error.code == "auth/id-token-revoked") {
                return "Token Id is expired. Please login again";
            } else {
                return "Incorrect Token Id";
            }
        });
}

module.exports = {
    getAllDataFromDBWithRealtimeSync,
    getAllDocsFromDB,
    getDocFromDB,
    addDataToDB,
    updateDocsInDB,
    verifyToken
}
