// lawyerDetails = {
//     image: string,
//     name: string,
//     expertise: string,
//     about: string,
//     cost: number,
//     rating: number,
//     experience: number,
//     availableTimeSlots: string_array,
//     practiceAreas: string_array,
//     awards: string_array,
//     clients: string_array,
//     address: string_array,
// }
const { del } = require("express/lib/application");
const createError = require("http-errors");
const Joi = require("joi");
const LawyerObject = {
  auth: Joi.string().required(),
  image: Joi.string().required(),
  name: Joi.string().min(5).max(50).required(),
  expertise: Joi.array().items(
    Joi.object({
      fieldName: Joi.string().required().min(10),
      yearsOfExpertise: Joi.number().required(),
    })
  ),
  about: Joi.string().required().min(100),
  cost: Joi.number().required(),
  rating: Joi.number().max(5).min(0),
  experience: Joi.array().items(
    Joi.object({
      NameOfField: Joi.string().required(),
      yearsOfExperience: Joi.number().required(),
    })
  ),
  availableTimeSlots: Joi.array().items(Joi.string()),
  practiceAreas: Joi.array().items(Joi.string()),
  awards: Joi.array().items(Joi.string()),
  clients: Joi.array().items(Joi.string()),
  address: Joi.array().items(Joi.string()),
};
const newLawyerProfileSchema = Joi.object(LawyerObject);
newLawyerProfileSchema.keys(image);
function createProfileSchema(req, res, next) {
  const data = {
    ...req.body,
    auth: req.headers.authorization,
  };
  const result = newLawyerProfileSchema.validate(data);
  if (!result.error) {
    next();
  } else {
    next(createError(400, "bad request"));
  }
}
function updateProfileSchema(req, res, next) {
  const ParamsToBeUpdated = req.body;
  let check = 0;
  for (let keys in ParamsToBeUpdated) {
    if (LawyerObject[keys] === undefined) {
      check = 1;
      break;
    }
  }

  if (check) {
    next(createError(400, "bad request"));
  }
  try {
    for (let keys in ParamsToBeUpdated) {
      Joi.assert(ParamsToBeUpdated.keys, LawyerObject.keys);
    }
    next();
  } catch (error) {
    next(createError(400, "bad request"));
  }
}
function deleteProfileSchema(req, res, next) {
  const DeleteParams = req.body;
  const ValidateDeleter = Joi.object({
    id: Joi.string().alphanum().required(),
  });
  const result = ValidateDeleter.validate(DeleteParams);
  if (!result.error) {
    next();
  } else {
    next(createError(400, "bad request"));
  }
}
module.exports = {
  createProfileSchema: createProfileSchema,
  updateProfileSchema: updateProfileSchema,
  deleteProfileSchema: deleteProfileSchema,
};
