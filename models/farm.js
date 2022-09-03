const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');
const Review = require('./review');
const Schema = mongoose.Schema;

const opts = { toJSON: { virtuals : true } };

const FarmSchema = new Schema({
    title: String,
    address: String,
    location: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    website: String,
    description: String,
    tel: String,
    openHours: String,
    image: String,
    creditCard: Boolean,
    travelCard: Boolean,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    reviews :[
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts)

FarmSchema.virtual('properties.popUpMarkup').get(function () {
    return `<a href="/farms/${this._id}" class="text-decoration-none text-dark fw-bold fs-5" title="點擊前往" target="_blank">${this.title}</a>`
})

FarmSchema.post('findOneAndDelete', async function (doc) {
    if(doc) {
        await Review.deleteMany({
            _id: {
                $in : doc.reviews
            }
        })
    }
})

FarmSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('Farm', FarmSchema);