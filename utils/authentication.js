const logger = require('./winston-logger');
const createError = require('http-errors');
const { verifyToken } = require('../dba/firestore-facade');

async function verifyCredentials(req, res, next) {
    try {
        let idToken;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith('Bearer')
        ) {
            idToken = req.headers.authorization.split(' ')[1];
        } else {
            next(createError(401, "Token not found, you are not logged in!"));
            return;
        }
        logger.debug(idToken);

        let isTokenIdCorrect = await verifyToken(idToken);

        if (isTokenIdCorrect !== true) {
            next(createError(401, isTokenIdCorrect));
            return;
        }
        next();
    } catch (e) {
        logger.error(e);
        next(createError(500, 'Internal Server Error'));
    }
};

module.exports = verifyCredentials;
