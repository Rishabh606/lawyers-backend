const { del } = require("express/lib/application");
const createError = require("http-errors");
const Joi = require("joi");

const LawyerProfileSchema = Joi.object({
  auth: Joi.string().required(),

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
  rating: Joi.number(),
  awards: Joi.string(),
  clientHistory: Joi.object({
    transactionObject: Joi.object(),
    clientID: Joi.string(),
    lawyerID: Joi.string(),
    scheduleObject: Joi.object({
      datetime: Joi.string(),
      subject: Joi.string()
    })
  })
});

const validate = (value, schema, next, customOptions = {}){
  const validateOptions = {
    abortEarly: false,
    allowUnknown: true,
    stripUnknown: true,
    ...customOptions,
  };
  
  const result = schema.validate(value, options);

  if(!result.error) {
    next()
  } else {
    next(createError(400, "bad request"));
  }
}

function createProfileSchema(req, res, next) {
  const data = {
    ...req.body,
    auth: req.headers.authorization,
  };

  validate(data, LawyerProfileSchema, next, {presence: true});
}

function updateProfileSchema(req, res, next) {
  const newLawyerProfileSchema = LawyerProfileSchema.keys({ id: Joi.string().alphanum().required() });
  validate(req.body, newLawyerProfileSchema, next);
}

function deleteProfileSchema(req, res, next) {
  const DeleteParams = req.body;
  const ValidateDeleter = Joi.object({
    id: Joi.string().alphanum().required(),
  });
  
  validate(DeleteParams, ValidateDeleter, next);
}

module.exports = {
  createProfileSchema,
  updateProfileSchema,
  deleteProfileSchema,
};
