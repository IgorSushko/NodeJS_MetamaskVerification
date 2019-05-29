const express = require('express');

const downloadController = require('../controllers/downloadlink');

const router = express.Router();


router.get('/book1', downloadController.providedownloadlink);
//http://localhost:62001/downloadbook/book1

module.exports = router;
