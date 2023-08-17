const express = require('express');
const aitController = require('./../controllers/aitController');

const router = express.Router();

router.route('/contact').post(aitController.contact);

module.exports = router;
