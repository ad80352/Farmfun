const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const { farmSchema, reviewSchema } = require('./schema.js');
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const Farm = require('./models/farm');
const Review = require('./models/review');


mongoose.connect('mongodb://localhost:27017/FarmFun', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
})

const app = express();

app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const validateFarm = (req, res, next) => {
    const { error } = farmSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    console.log(error)
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/farms', catchAsync(async (req, res) => {
    const farms = await Farm.find({});
    res.render('farms/index', { farms })
}))

app.get('/farms/new', (req, res) => {
    res.render('farms/new')
})

app.post('/farms', validateFarm, catchAsync(async (req, res, next) => {
    // if (!req.body.farm) throw new ExpressError('無效的頁面資訊', 400);
    const farm = new Farm(req.body.farm);
    await farm.save();
    res.redirect(`/farms/${farm._id}`)
}))

app.get('/farms/:id', catchAsync(async (req, res) => {
    const farm = await Farm.findById(req.params.id).populate('reviews')
    console.log(farm)
    res.render('farms/show', { farm })
}))

app.get('/farms/:id/edit', catchAsync(async (req, res) => {
    const farm = await Farm.findById(req.params.id)
    res.render('farms/edit', { farm });
}))

app.put('/farms/:id', validateFarm, catchAsync(async (req, res) => {
    const { id } = req.params;
    //{ ...req.body.farm }，這串不懂
    const farm = await Farm.findByIdAndUpdate(id, { ...req.body.farm });
    res.redirect(`/farms/${farm._id}`);
}))

app.delete('/farms/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    await Farm.findByIdAndDelete(id);
    res.redirect('/farms');
}))

app.post('/farms/:id/reviews', validateReview, catchAsync(async (req, res) => {
    const farm = await Farm.findById(req.params.id);
    const review = new Review(req.body.review);
    farm.reviews.push(review);
    await review.save();
    await farm.save();
    res.redirect(`/farms/${farm._id}`);
}))

app.delete('/farms/:id/reviews/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    // 先找farm，再用reviewId拉出指定review
    await Farm.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/farms/${id}`)
}))

app.all('*', (req, res, next) => {
    next(new ExpressError('找不到頁面', 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = '發生不明的錯誤'
    res.status(statusCode).render('error', { err })
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})