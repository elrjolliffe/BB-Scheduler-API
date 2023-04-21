const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const authController = require('../controllers/authController')

router.get('/constituents/:constituentId', authController.checkSession, apiController.getConstituent, (req, res) => {
    console.log('/api/offerings/apiController.getOfferings complete');
    return res.status(200);
});

router.get('/offerings', apiController.getOfferings, (req, res) => {
    console.log('/api/offerings/apiController.getOfferings complete');
    return res.status(200);
});

router.get('/requests', apiController.getRequests, (req, res) => {
    console.log('/api/offerings/apiController.getRequests complete');
    return res.status(200);
});

module.exports = router;