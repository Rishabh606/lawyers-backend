const logger = require('./winston-logger');
const { verifyToken } = require('../dba/firestore-facade');
exports.verifyCredentials = async (req, res, next) => {
    try {
        let idToken;
        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            idToken = req.headers.authorization.split(" ")[1];
        } else {
            next(createError(401, "Token not found, you are not logged in!"));
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
        next(createError(500, "Internal Server Error"));
    }
};