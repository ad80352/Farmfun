const Joi = require('joi');

module.exports.farmSchema = Joi.object({
    farm: Joi.object({
        title: Joi.string().required(),
        address: Joi.string().required(),
        website: Joi.string(),
        tel: Joi.string(),
        openHours: Joi.string(),
        description: Joi.string().required(),
        image: Joi.string().required(),
        creditCard: Joi.boolean(),
        travelCard: Joi.boolean()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
    }).required()
})