const Joi = require("joi");
const { getById } = require("../models/contacts");

checkContactId = async (req, res, next) => {
    try {
        const { id } = req.params;
        const contact = await getById(id);

        if (contact) return next();

        const error = new Error("Not found");
        error.status = 404;

        next(error);
    } catch (error) {
        next(error);
    }
};

checkClientData = async (req, res, next) => {
    try {
        if (Object.keys(req.body).length === 0)
            return res.status(400).json({ message: "missing fields" });

        const { name, email, phone } = req.body;
        let fieldName = "name";

        if (!email) fieldName = "email";
        else if (!phone) fieldName = "phone";

        if (!name || !email || !phone)
            return res
                .status(400)
                .json({ message: `missing required ${fieldName} field` });

        next();
    } catch (error) {
        next(error);
    }
};

requestValidation = async (req, res, next) => {
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


module.exports = {
    checkContactId,
    checkClientData,
    requestValidation,
};