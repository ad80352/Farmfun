const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync')
const User = require('../models/user');
const passport = require('passport');

router.get('/register', (req, res) => {
    res.render('users/register');
})

router.post('/register', catchAsync(async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        // req.login()，註冊成功後無須再登入
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', '歡迎加入！');
            res.redirect('/farms');
        })
    } catch (e) {
        req.flash('error', e.message) // 但e.message印出來的是英文......唉
        res.redirect('/register')
    }
}))

router.get('/login', (req, res) => {
    res.render('users/login')
})

router.post('/login', passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
    keepSessionInfo: true
}), (req, res) => {
    req.flash('success', '歡迎回來！');
    const redirectUrl = req.session.returnTo || '/farms';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        req.flash('success', "再見！");
        res.redirect('/farms');
    });
});

module.exports = router;