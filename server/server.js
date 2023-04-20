const express = require('express');
const path = require('path');
const axios = require('axios');
const { AuthorizationCode } = require('simple-oauth2');
require('dotenv').config()

const app = express();
const PORT = process.env.PORT;
const AUTH_SUBSCRIPTION_KEY = process.env.AUTH_SUBSCRIPTION_KEY;
const BB_OAuth = process.env.BB_OAuth

// authorization instructions: https://developer.blackbaud.com/skyapi/docs/authorization/auth-code-flow/confidential-application/code-samples/nodejs

config = {
    client: {
        id: process.env.AUTH_CLIENT_ID,
        secret: process.env.AUTH_CLIENT_SECRET
    },
    auth: {
        tokenHost: 'https://oauth2.sky.blackbaud.com',
        authorizePath: '/authorization',
        tokenPath: '/token'
    }
};

authCodeClient = new AuthorizationCode(config);

// Course Selection Offerings = 147977
// Course Requests = 147973
const options = {
    method: "GET",
    url: "https://api.sky.blackbaud.com/school/v1/lists/advanced/147973?page=1&page_size=1000",
    headers: {
        "Bb-Api-Subscription-Key": AUTH_SUBSCRIPTION_KEY,
        "Authorization": BB_OAuth,
    },
};

axios
    .request(options)
    .then(function (response) {
        console.log(response.data.results.rows[0])
    })
    .catch(function (error) {
        console.error(error);
    });

app.listen(PORT, () => {
    console.log(`Server listening on Port ${PORT}`);
});