const express = require('express');

const secondController = require('../controllers/index2');

const router = express.Router();


router.get('/', secondController.provideGetPageIndex);

router.post('/', secondController.providePostPageIndex);

module.exports = router;
