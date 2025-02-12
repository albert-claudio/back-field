import Joi from 'joi';

const videoValidationSchema = Joi.object({
    title: Joi.string().min(3).max(30).required(), // title is required, min 3 characters, max 30 characters
    description: Joi.string().min(3).max(100).required(), // description is required, min 3 characters, max 100 characters
    tags: Joi.array().items(Joi.string()).optional(), // tags is optional, array of strings
    isPublic: Joi.boolean().default(true), // isPublic is optional, boolean, default is true
});

const validateVideo = (req, res, next) => {
    const { error } = videoValidationSchema.validate(req.body);

    if(error) {
        return res.status(400).json({
            error: error.details[0].message.replace(/"/g, '') // remove double quotes from error message   
        });
    }

    next(); // continue to the next middleware
}

export { validateVideo };