const express = require('express');
const router = express.Router();
const apiController = require('../controllers/apiController');
const authController = require('../controllers/authController')

router.get('/constituents/:constituentId', authController.checkSession, apiController.getConstituent, (req, res) => {
    console.log('/api/offerings/apiController.getOfferings complete');
    return res.status(200);
});

router.get('/offerings', authController.checkSession, apiController.getOfferings, (req, res) => {
    console.log('/api/offerings/apiController.getOfferings complete');
    return res.status(200).json({ offerings: res.locals.offerings });
});

router.get('/requests', authController.checkSession, apiController.getRequests, (req, res) => {
    console.log('/api/offerings/apiController.getRequests complete');
    return res.status(200).json({ requests: res.locals.requests });
});

module.exports = router;