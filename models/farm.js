const mongoose = require('mongoose');
const Review = require('./review')
const Schema = mongoose.Schema;

const FarmSchema = new Schema({
    title: String,
    address: String,
    location: String,
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

module.exports = mongoose.model('Farm', FarmSchema);