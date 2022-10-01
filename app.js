if (process.env.NODE_ENV !== "product") {
    require('dotenv').config();
}


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
// const helmet = require('helmet');

const mongoSanitize = require('express-mongo-sanitize');

// Routes
const userRoutes = require('./routers/user');
const farmRoutes = require('./routers/farms');
const reviewRoutes = require('./routers/reviews');

// mongoDB connect
const MongoStore = require('connect-mongo');
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/FarmFun';

mongoose.connect(dbUrl, {
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

//關於mongo query的安全性防護
app.use(mongoSanitize());


const secret = process.env.SECRET || 'thisshouldbeabetterscrect';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

store.on('error', function (e) {
    console.log('SESSION STORE ERROR', e)
})

const sessionConfig = {
    name: 'session',
    store,
    secret,
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
// 這個安全性功能會讓我的圖片不能加載（因為圖片網址不在白名單內，所以就先不管了）
// app.use(helmet.crossOriginEmbedderPolicy({ policy: "credentialless" }));

// 登入功能
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

// 將user儲存到session
passport.serializeUser(User.serializeUser());
// 從session移除user...登出? 511. 03:57
passport.deserializeUser(User.deserializeUser());

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

//Route - Prefix
app.use('/', userRoutes);  //為什麼你的"/"後面什麼都不用加？ register呢？ 更：他們沒有公因網址，當然不用加
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

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`)
})