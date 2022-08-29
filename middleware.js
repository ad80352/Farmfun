module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        req.flash('error', '您必須先登入，才能使用該功能');
        return res.redirect('/login');
    }
    next();
}