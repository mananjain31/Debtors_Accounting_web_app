const express = require('express');
const router = express.Router();
const {getAll, update} = require('../controllers/items');

router.route('/')
    .get(getAll)
    .put(update)

module.exports = router;