const { del } = require('express/lib/application');
const logger = require('../utils/winston-logger');
const createError = require('http-errors');
const Joi = require('joi');

const LawyerProfileSchema = Joi.object({
    auth: Joi.string().required().strip(),

    name: Joi.string().min(5).max(50),
    email: Joi.string(),
    mobileNumber: Joi.string().length(10),

    officeAddress: Joi.array().items(Joi.string()),
    cityOfPractice: Joi.string(),
    country: Joi.string(),
    description: Joi.string(),
    practiceStartDate: Joi.string(),
    price: Joi.string(),
    practiceArea: Joi.string(),
    otherPracticeAreas: Joi.array().items(Joi.string()),
    image: Joi.string(),
    rating: Joi.string(),
    awards: Joi.string(),
    clientHistory: Joi.object({
        transactionObject: Joi.object(),
        clientID: Joi.string(),
        lawyerID: Joi.string(),
        scheduleObject: Joi.object({
            datetime: Joi.string(),
            subject: Joi.string(),
        }),
    }),
});

const validate = (value, schema, req, next, customOptions = {}) => {
    const validateOptions = {
        abortEarly: false,
        allowUnknown: true,
        stripUnknown: true,
        ...customOptions,
    };

    const result = schema.validate(value, validateOptions);

    if (!result.error) {
        req.body = result.value;
        next();
    } else {
        logger.error(result.error);
        next(createError(400, 'bad request'));
    }
};

function createProfileSchema(req, res, next) {
    const data = {
        ...req.body,
        auth: req.headers.authorization,
    };

    validate(data, LawyerProfileSchema, req, next, { presence: true });
}

function updateProfileSchema(req, res, next) {
    const data = {
        ...req.body,
        auth: req.headers.authorization,
        id: req.params.ID,
    };
    const newLawyerProfileSchema = LawyerProfileSchema.keys({
        id: Joi.string().alphanum().required().strip(),
    });
    validate(data, newLawyerProfileSchema, req, next);
}

function deleteProfileSchema(req, res, next) {
    const DeleteParams = { auth: req.headers.authorization, id: req.params.ID };
    const ValidateDeleter = Joi.object({
        auth: Joi.string().required().strip(),
        id: Joi.string().alphanum().required().strip(),
    });

    validate(DeleteParams, ValidateDeleter, req, next);
}

module.exports = {
    createProfileSchema,
    updateProfileSchema,
    deleteProfileSchema,
};
