const { farmSchema, reviewSchema } = require('./schema.js');
const Farm = require('./models/farm');
const Review = require('./models/review');
const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.flash('error', '您必須先登入，才能使用此功能');
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async(req, res, next) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    console.log(req.user._id)
    if(!farm.author.equals(req.user._id)) {
        req.flash('error', '抱歉，您沒有此權限。');
        return res.redirect(`/farms/${id}`);
    }
    next();
}

module.exports.isReviewAuthor = async(req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if(!review.author.equals(req.user._id)) {
        req.flash('error', '抱歉，您沒有此權限。');
        return res.redirect(`/farms/${id}`);
    }
    next();
}

module.exports.validateFarm = (req, res, next) => {
    const { error } = farmSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

module.exports.validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    console.log(error)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}