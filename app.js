const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

// Routes
const userRoutes = require('./routers/user')
const farmRoutes = require('./routers/farms');
const reviewRoutes = require('./routers/reviews')

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
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
//加了，才能在外部讀取資料夾內的檔案
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'image')));

const sessionConfig = {
    secret: '這應該要是一個更好的秘密',
    resave: false,
    saveUninitialized: true,
    cookie: {
        //安全性用途
        httpOnly: true,
        //保密防諜，不加下面這兩行，使用者的快取會一直存在，加了才能在7天內未使用即移除
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

// 登入功能
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// 將user儲存到session
passport.serializeUser(User.serializeUser());
// 從session移除user...登出? 511. 03:57
passport.deserializeUser(User.deserializeUser());

app.get('/fakeUser', async (req, res) => {
    const user = new User({ email: 'colttt@gmail.com', username: 'colttt' });
    const newUser = await User.register(user, 'chicken');
    res.send(newUser);
})

// 快取的middleware，不用個別綁定get、post等，只要加入關鍵字（success、error）就能呼叫flash，
app.use((req, res, next) => {
    if (!['/login', '/'].includes(req.originalUrl)) {
        req.session.returnTo = req.originalUrl;
    }
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/', userRoutes);  //為什麼你的"/"後面什麼都不用加？ register呢？
app.use('/farms', farmRoutes);
app.use('/farms/:id/reviews', reviewRoutes);


app.get('/', (req, res) => {
    res.render('home')
})

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