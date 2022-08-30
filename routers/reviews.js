const express = require('express');
const router = express.Router({ mergeParams: true });
const { isLoggedIn, validateReview, isReviewAuthor } = require('../middleware')
const Farm = require('../models/farm');
const Review = require('../models/review');

const catchAsync = require('../utils/catchAsync');



router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
    const farm = await Farm.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    farm.reviews.push(review);
    await review.save();
    await farm.save();
    req.flash('success', '成功新增評論');
    res.redirect(`/farms/${farm._id}`);
}))

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    // 先找farm，再用reviewId拉出指定review
    await Farm.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', '已刪除評論');
    res.redirect(`/farms/${id}`)
}))

module.exports = router;