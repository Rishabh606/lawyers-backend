function createProfileSchema(req, res, next) {
    const newLawyerProfileSchema = {
        'auth': auth
    };
    const data = {
        ...req.body,
        auth: req.headers.authorization
    }
    const result = Joi.validate(data, newLawyerProfileSchema);
    if (result) {
        next();
    }
    else {
        next(createError(400, "bad request"));
    }
}