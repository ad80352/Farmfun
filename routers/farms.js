const express = require('express');
const router = express.Router();
const Farm = require('../models/farm');
const { farmSchema } = require('../schema.js');
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { isLoggedIn } = require('../middleware');

const validateFarm = (req, res, next) => {
    const { error } = farmSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new ExpressError(msg, 400)
    } else {
        next()
    }
}

router.get('/', catchAsync(async (req, res) => {
    const farms = await Farm.find({});
    res.render('farms/index', { farms })
}))

router.get('/new', isLoggedIn, (req, res) => {
    res.render('farms/new')
})

router.post('/', isLoggedIn, validateFarm, catchAsync(async (req, res, next) => {
    // if (!req.body.farm) throw new ExpressError('無效的頁面資訊', 400);
    const farm = new Farm(req.body.farm);
    await farm.save();
    req.flash('success', '新增景點成功！');
    res.redirect(`/farms/${farm._id}`)
}))

router.get('/:id', catchAsync(async (req, res) => {
    const farm = await Farm.findById(req.params.id).populate('reviews');
    if (!farm) {
        req.flash('error', '無法找到該景點');
        return res.redirect('/farms');
    }
    res.render('farms/show', { farm })
}))

router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const farm = await Farm.findById(req.params.id);
    if (!farm) {
        req.flash('error', '無法找到該景點');
        return res.redirect('/farms');
    }
    res.render('farms/edit', { farm });
}))

router.put('/:id', isLoggedIn, validateFarm, catchAsync(async (req, res) => {
    const { id } = req.params;
    //{ ...req.body.farm }，這串不懂
    const farm = await Farm.findByIdAndUpdate(id, { ...req.body.farm });
    req.flash('success', '已更新景點資訊');
    res.redirect(`/farms/${farm._id}`);
}))

router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    await Farm.findByIdAndDelete(id);
    req.flash('success', '成功刪除景點');
    res.redirect('/farms');
}))

module.exports = router;