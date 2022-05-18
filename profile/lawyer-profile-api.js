const lawyerProfileRouter = require('express').Router();
const logger = require('../utils/winston-logger');
const createError = require('http-errors');

//testing basic http API
lawyerProfileRouter.get('/:ID', async (req, res, next) => {
    try {
        let lawyerProfile = await getLawyerProfile(req.params.ID);

        if (!lawyerProfile) {
            next(createError(404, "No Such Lawyer Exisits on our portal."));
        }

        res.status(200).json(lawyerProfile);
    } catch (e) {
        logger.error(e);
        next(createError(400, e.message));                       //throw bad request error        
    }

})

//add verification
// handle incoming http request
lawyerProfileRouter.post('/', async (req, res, next) => {
    try {
        const verified = await verifyCredenitals(req.headers.authorization);

        if (!verified) {
            return next(createError(401, "Unauthorised Access"));
        }

        let requestData = req.body;                             //extract http request body
        logger.log('info', 'raw message %o', requestData);

        let lawyerProfileData = await createLawyerProfile(requestData);

        if (!lawyerProfileData) {
            next(createError(500, "Sorry profile couldn't be created"));
        }

        res.status(201).json(lawyerProfileData);     //send response

    } catch (e) {
        logger.error(e);
        next(createError(400, e.message));                       //throw bad request error
    }
})

lawyerProfileRouter.put('/:ID', async (req, res, next) => {
    try {

        const verified = await verifyCredenitals(req.params.ID, req.headers.authorization);

        if (!verified) {
            return next(createError(401, "Unauthorised Access"));
        }

        let requestData = req.body;                             //extract http request body
        logger.log('info', 'raw message %o', requestData);

        let lawyerProfileData = await updateLawyerProfile(req.params.ID, requestData);

        if (!lawyerProfileData) {
            next(createError(500, "Sorry profile couldn't be modified"));
        }

        res.status(201).json(lawyerProfileData);     //send response

    } catch (e) {
        logger.error(e);
        next(createError(400, e.message));                       //throw bad request error
    }
});

lawyerProfileRouter.delete('/:ID', async (req, res, next) => {
    try {
        const verified = await verifyCredenitals(req.params.ID, req.headers.authorization);

        if (!verified) {
            return next(createError(401, "Unauthorised Access"));
        }

        let lawyerProfileData = await disableLawyerProfile(req.params.ID);

        if (!lawyerProfileData) {
            next(createError(500, "Sorry profile couldn't be disabled"));
        }

        res.status(204).send("Disable Successful");     //send response

    } catch (e) {
        logger.error(e);
        next(createError(400, e.message));                       //throw bad request error
    }
})
module.exports = lawyerProfileRouter; 