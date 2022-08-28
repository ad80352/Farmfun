const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override')
const Farm = require('./models/farm');

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

app.use(express.urlencoded ({ extended: true}));
app.use(methodOverride('_method'));

app.get('/', (req, res) => {
    res.render('home')
})

app.get('/farms', async (req, res) => {
    const farms = await Farm.find({});
    res.render('farms/index', { farms })
})

app.get('/farms/new', (req, res) => {
    res.render('farms/new')
})

app.post('/farms', async (req, res) => {
    const farm = new Farm(req.body.farm);
    await farm.save();
    res.redirect(`/farms/${farm._id}`)
})

app.get('/farms/:id', async (req, res) => {
    const farm = await Farm.findById(req.params.id)
    res.render('farms/show', { farm })
})

app.get('/farms/:id/edit', async (req, res) => {
    const farm = await Farm.findById(req.params.id)
    res.render('farms/edit', { farm });
})

app.put('/farms/:id', async (req, res) => {
    const { id } = req.params;
    //{ ...req.body.farm }，這串不懂
    const farm = await Farm.findByIdAndUpdate(id, { ...req.body.farm });
    res.redirect(`/farms/${farm._id}`);
})

app.delete('/farms/:id', async (req, res) => {
    const { id } = req.params;
    await Farm.findByIdAndDelete(id);
    res.redirect('/farms');
})

app.listen(3000, () => {
    console.log('Serving on port 3000')
})