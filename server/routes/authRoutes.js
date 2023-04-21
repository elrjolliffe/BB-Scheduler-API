const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.getLogin, (req, res) => {
    console.log('/auth/login/authController.getLogin complete');
    return res.status(200);
});

router.get('/authenticated', authController.getAuthenticated, (req, res) => {
    console.log('/auth/login/authController.getAuthenticated complete');
    return res.status(200);
});

router.get('/callback', authController.getCallback, (req, res) => {
    console.log('/auth/login/authController.getCallback complete');
    return res.status(200);
});

router.get('/logout', authController.getLogout, (req, res) => {
    console.log('/auth/login/authController.getLogout complete');
    return res.status(200);
});

module.exports = router;