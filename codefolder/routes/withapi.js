const express = require('express');

const firstController = require('../controllers/withapi');

const router = express.Router();

// GET /feed/posts
router.get('/getadress', firstController.provideAddress);

router.get('/getlink', firstController.provideurl);

//http://localhost:62001/restapi/getlink

module.exports = router;
