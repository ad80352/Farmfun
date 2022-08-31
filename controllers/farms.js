const Farm = require('../models/farm');
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });

module.exports.index = async (req, res) => {
    const farms = await Farm.find({});
    res.render('farms/index', { farms })
}

module.exports.renderNewForm = (req, res) => {
    res.render('farms/new')
}

module.exports.createFarm = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.farm.address,
        limit: 1
    }).send()
    const farm = new Farm(req.body.farm);
    farm.geometry = geoData.body.features[0].geometry;
    farm.author = req.user._id;
    await farm.save();
    console.log(farm)
    req.flash('success', '新增景點成功！');
    res.redirect(`/farms/${farm._id}`)
}

module.exports.showFarm = async (req, res) => {
    const farm = await Farm.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }
    }).populate('author');
    if (!farm) {
        req.flash('error', '無法找到該景點');
        return res.redirect('/farms');
    }
    res.render('farms/show', { farm })
}

module.exports.editFarm = async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    if (!farm) {
        req.flash('error', '無法找到該景點');
        return res.redirect('/farms');
    }
    res.render('farms/edit', { farm });
}

module.exports.updateFarm = async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findByIdAndUpdate(id, { ...req.body.farm })
    req.flash('success', '已更新景點資訊');
    res.redirect(`/farms/${farm._id}`);
}

module.exports.deleteFarm = async (req, res) => {
    const { id } = req.params;
    const farm = await Farm.findById(id);
    if(!farm.author.equals(req.user._id)) {
        req.flash('error', '抱歉，您沒有此權限。');
        return res.redirect(`/farms/${id}`);
    }
    await Farm.findByIdAndDelete(id);
    req.flash('success', '成功刪除景點');
    res.redirect('/farms');
}
