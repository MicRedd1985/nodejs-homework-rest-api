const Joi = require('joi')

module.exports = {
    requestValidation: (req, res, next) => {
        const schema = Joi.object({
            name: Joi.string().alphanum().trim().min(3).max(30).required(),
            email: Joi.string().trim().min(3).max(30).required(),
            phone: Joi.string().trim().min(3).max(30).required(),
        });
        const resultValidation = schema.validate(req.body);
        if (resultValidation.error) {
            return res.status(400).json({ status: resultValidation.error.details[0].message })
        }
        next()
    }
}