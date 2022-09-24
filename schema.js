const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} 不能包含HTML標籤!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if(clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);

module.exports.farmSchema = Joi.object({
    farm: Joi.object({
        title: Joi.string().required().escapeHTML(),
        address: Joi.string().required().escapeHTML(),
        website: Joi.string().empty('').escapeHTML(),
        tel: Joi.string().empty('').escapeHTML(),
        openHours: Joi.string().empty('').escapeHTML(),
        description: Joi.string().required().escapeHTML(),
        image: Joi.string().required().escapeHTML(),
        creditCard: Joi.boolean(),
        travelCard: Joi.boolean()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
})