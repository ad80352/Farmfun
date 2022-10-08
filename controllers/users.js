const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
    res.render('users/register');
}

module.exports.register = async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        // req.login()，註冊成功後無須再登入
        req.login(registeredUser, err => {
            if (err) return next(err);
            req.flash('success', `${username}，歡迎加入！`);
            res.redirect('/farms');
        })
    } catch (e) {
        // if(e.message === "Password or username is incorrect") {
        //    req.flash('error', "帳號或密碼錯誤");
        //    res.redirect('/register')
        // } else {}               
        // 這不管用，真麻煩
        req.flash('error', e.message) // 但e.message印出來的是英文......唉
        res.redirect('/register')
    }
}

module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}

module.exports.login = (req, res) => {
    const { username } = req.body;
    req.flash('success', `${username}，歡迎回來！`);
    console.log(req.body.username)
    const redirectUrl = req.session.returnTo || '/farms';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        console.log(req.body)
        req.flash('success', "期待您的再臨");
        res.redirect('/farms');
    });
}