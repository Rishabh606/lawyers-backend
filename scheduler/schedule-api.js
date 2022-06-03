const scheduleRouter = require('express').Router();
const logger = require('../utils/winston-logger');
const createError = require('http-errors');

//testing basic http API
scheduleRouter.get('/', (req, res, next) => {
    res.status(200).send('Route1 GET request \n');
});

// handle incoming http request
scheduleRouter.post('/', (req, res, next) => {
    try {
        let requestData = req.body; //extract http request body
        logger.log('info', 'raw message %o', requestData);

        res.status(200).send('Route1 POST Request \n'); //send response
    } catch (e) {
        logger.error(e);
        next(createError(400, 'Bad Request')); //throw bad request error
    }
});
scheduleRouter.put('/:ID', async (req, res, next) => {
    try {
        // const verified = await verifyCredenitals(req.params.ID, req.headers.authorization);

        // if (!verified) {
        //     return next(createError(401, "Unauthorised Access"));
        // }

        let requestData = req.body; //extract http request body
        logger.log('info', 'raw message %o', requestData);

        let lawyerProfileData = await updateLawyerProfile(
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
});

scheduleRouter.delete('/:ID', async (req, res, next) => {
    try {
        // const verified = await verifyCredenitals(req.params.ID, req.headers.authorization);

        // if (!verified) {
        //     return next(createError(401, "Unauthorised Access"));
        // }

        let lawyerProfileData = await disableLawyerProfile(req.params.ID);

        if (!lawyerProfileData) {
            next(createError(500, "Sorry profile couldn't be disabled"));
        }

        res.status(204).send('Disable Successful'); //send response
    } catch (e) {
        logger.error(e);
        next(createError(400, e.message)); //throw bad request error
    }
});
module.exports = scheduleRouter;
