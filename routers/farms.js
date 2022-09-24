const express = require('express');
const router = express.Router();
const farms = require('../controllers/farms')
const Farm = require('../models/farm');
const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, isAuthor, validateFarm } = require('../middleware');

router.route('/')
    .get(catchAsync(farms.index))
    .post(
        isLoggedIn,
        validateFarm,
        catchAsync(farms.createFarm));

router.get('/new', isLoggedIn, farms.renderNewForm);

router.get('/clusterMap', catchAsync(farms.clusterMap))

router.route('/:id')
    .get(catchAsync(farms.showFarm))
    .put(
        isLoggedIn,
        isAuthor,
        validateFarm,
        catchAsync(farms.updateFarm))
    .delete(
        isLoggedIn,
        isAuthor,
        catchAsync(farms.deleteFarm));

router.get('/:id/edit',
    isLoggedIn,
    isAuthor,
    catchAsync(farms.editFarm))

module.exports = router;