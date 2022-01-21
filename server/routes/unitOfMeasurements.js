const express = require('express');
const router = express.Router();
const {getAll} = require('../controllers/unitOfMeasurements.js');

router.route('/')
    .get(getAll);

module.exports = router;