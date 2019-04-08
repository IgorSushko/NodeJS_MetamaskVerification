const express = require('express');

const firstController = require('../controllers/withapi');

const router = express.Router();

// GET /feed/posts
router.get('/getadress', firstController.provideAddress);


module.exports = router;
