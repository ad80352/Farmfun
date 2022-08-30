const express = require('express');
const router = express.Router();
const Farm = require('../models/farm');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateFarm } = require('../middleware');

router.get('/', catchAsync(async (req, res) => {
    const farms = await Farm.find({});
    res.render('farms/index', { farms })
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('farms/new')
})

router.post('/', isLoggedIn, isAuthor, validateFarm, catchAsync(async (req, res, next) => {
    // if (!req.body.farm) throw new ExpressError('無效的頁面資訊', 400);
    const farm = new Farm(req.body.farm);
    farm.author = req.user._id;
    await farm.save();
    req.flash('success', '新增景點成功！');
    res.redirect(`/farms/${farm._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const farm = await Farm.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    console.log(farm);
    if (!farm) {
        req.flash('error', '無法找到該景點');
        return res.redirect('/farms');
    }
    res.render('farms/show', { farm })
}))

router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    if (!farm) {
        req.flash('error', '無法找到該景點');
        return res.redirect('/farms');
    }
    res.render('farms/edit', { farm });
}))

router.put('/:id', isLoggedIn, isAuthor, validateFarm, catchAsync(async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findByIdAndUpdate(id, { ...req.body.farm })
    req.flash('success', '已更新景點資訊');
    res.redirect(`/farms/${farm._id}`);
}))

router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    if(!farm.author.equals(req.user._id)) {
        req.flash('error', '抱歉，您沒有此權限。');
        return res.redirect(`/farms/${id}`);
    }
    await Farm.findByIdAndDelete(id);
    req.flash('success', '成功刪除景點');
    res.redirect('/farms');
}))

module.exports = router;