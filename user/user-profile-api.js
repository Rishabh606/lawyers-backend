const userProfileRouter = require('express').Router();
const logger = require('../utils/winston-logger');
const createError = require('http-errors');
const userProfileService = require('./user-profile-service');
// const schemaValidation = require('./user-schema-validation');
const { verifyCredentials } = require('../utils/authentication.js');

//testing basic http API
userProfileRouter.get('/:ID', async (req, res, next) => {
    try {
        let userProfile = await userProfileService.getUserProfile(
            req.params.ID
        );

        if (!userProfile) {
            next(createError(404, 'No Such User Exists on our portal.'));
        }

        res.status(200).json(userProfile);
    } catch (e) {
        logger.error(e);
        next(createError(400, e.message)); //throw bad request error
    }
});

//add verification
// handle incoming http request
userProfileRouter.post(
    '/',
    // schemaValidation.createProfileSchema,
    async (req, res, next) => {
        try {
            // const verified = await verifyCredentials(req.headers.authorization);

            // if (!verified) {
            //   return next(createError(401, "Unauthorised Access"));
            // }

            let requestData = req.body; //extract http request body
            logger.log('info', 'raw message %o', requestData);

            let userProfileData = await userProfileService.createUserProfile(
                requestData
            );

            if (!userProfileData) {
                next(createError(500, "Sorry profile couldn't be created"));
            }

            res.status(201).json(userProfileData); //send response
        } catch (e) {
            logger.error(e);
            next(createError(400, e.message)); //throw bad request error
        }
    }
);

userProfileRouter.put(
    '/:ID',
    // schemaValidation.updateProfileSchema,
    async (req, res, next) => {
        try {
            // const verified = await verifyCredentials(
            //   req.params.ID,
            //   req.headers.authorization
            // );

            // if (!verified) {
            //   return next(createError(401, "Unauthorised Access"));
            // }

            let requestData = req.body; //extract http request body
            logger.log('info', 'raw message %o', requestData);

            let userProfileData = await userProfileService.updateUserProfile(
                req.params.ID,
                requestData
            );

            if (!userProfileData) {
                next(createError(500, "Sorry profile couldn't be modified"));
            }

            res.status(201).json(userProfileData); //send response
        } catch (e) {
            logger.error(e);
            next(createError(400, e.message)); //throw bad request error
        }
    }
);

userProfileRouter.delete(
    '/:ID',
    // schemaValidation.deleteProfileSchema,
    async (req, res, next) => {
        try {
            // const verified = await verifyCredentials(
            //   req.params.ID,
            //   req.headers.authorization
            // );

            // if (!verified) {
            //   return next(createError(401, "Unauthorised Access"));
            // }

            let userProfileData = await userProfileService.disableUserProfile(
                req.params.ID
            );

            if (!userProfileData) {
                next(createError(500, "Sorry profile couldn't be disabled"));
            }

            res.status(204).send('Disable Successful'); //send response
        } catch (e) {
            logger.error(e);
            next(createError(400, e.message)); //throw bad request error
        }
    }
);
module.exports = userProfileRouter;
