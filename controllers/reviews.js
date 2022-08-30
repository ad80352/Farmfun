const Farm = require('../models/farm');
const Review = require('../models/review');

module.exports.createReview = async (req, res) => {
    const farm = await Farm.findById(req.params.id);
    const review = new Review(req.body.review);
    review.author = req.user._id;
    farm.reviews.push(review);
    await review.save();
    await farm.save();
    req.flash('success', '成功新增評論');
    res.redirect(`/farms/${farm._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params;
    // 先找farm，再用reviewId拉出指定review
    await Farm.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', '已刪除評論');
    res.redirect(`/farms/${id}`)
}

