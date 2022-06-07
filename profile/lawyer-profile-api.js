const lawyerProfileRouter = require('express').Router();
const logger = require('../utils/winston-logger');
const createError = require('http-errors');
const lawyerProfileService = require('./lawyer-profile-service');
const schemaValidation = require('./lawyer-schema-validation');

//testing basic http API
lawyerProfileRouter.get('/:ID', async (req, res, next) => {
    try {
        let lawyerProfile = await lawyerProfileService.getLawyerProfile(
            req.params.ID
        );

        if (!lawyerProfile) {
            next(createError(404, 'No Such Lawyer Exists on our portal.'));
        }

        res.status(200).json(lawyerProfile);
    } catch (e) {
        logger.error(e);
        next(createError(400, e.message)); //throw bad request error
    }
});

//add verification
// handle incoming http request
lawyerProfileRouter.post(
    '/',
    schemaValidation.createProfileSchema,
    async (req, res, next) => {
        try {
            let requestData = req.body; //extract http request body
            logger.log('info', 'raw message %o', requestData);

            let lawyerProfileData =
                await lawyerProfileService.createLawyerProfile(requestData);

            if (!lawyerProfileData) {
                next(createError(500, "Sorry profile couldn't be created"));
            }

            res.status(201).json(lawyerProfileData); //send response
        } catch (e) {
            logger.error(e);
            next(createError(400, e.message)); //throw bad request error
        }
    }
);

lawyerProfileRouter.put(
    '/:ID',
    schemaValidation.updateProfileSchema,
    async (req, res, next) => {
        try {
            let requestData = req.body; //extract http request body
            logger.log('info', 'raw message %o', requestData);

            let lawyerProfileData =
                await lawyerProfileService.updateLawyerProfile(
                    req.params.ID,
                    requestData
                );

            if (!lawyerProfileData) {
                next(createError(500, "Sorry profile couldn't be modified"));
            }

            res.status(201).json(lawyerProfileData); //send response
        } catch (e) {
            logger.error(e);
            next(createError(400, e.message)); //throw bad request error
        }
    }
);

lawyerProfileRouter.delete(
    '/:ID',
    schemaValidation.deleteProfileSchema,
    async (req, res, next) => {
        try {
            let lawyerProfileData =
                await lawyerProfileService.disableLawyerProfile(req.params.ID);

            if (!lawyerProfileData) {
                next(createError(500, "Sorry profile couldn't be disabled"));
            }

            res.status(204).send('Disable Successful'); //send response
        } catch (e) {
            logger.error(e);
            next(createError(400, e.message)); //throw bad request error
        }
    }
);
module.exports = lawyerProfileRouter;
