const mongoose = require('mongoose');
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
})

module.exports = mongoose.model('Farm', FarmSchema);