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
const Joi = require("joi");
function createProfileSchema(req, res, next) {
  const newLawyerProfileSchema = Joi.object({
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
  });
  const data = {
    ...req.body,
    auth: req.headers.authorization,
  };
  const result = Joi.validate(data, newLawyerProfileSchema);
  if (result) {
    next();
  } else {
    next(createError(400, "bad request"));
  }
}
module.exports = {
  createProfileSchema: createProfileSchema,
};
