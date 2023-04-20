const express = require('express');
const path = require('path');
const axios = require('axios');
require('dotenv').config()

const app = express();
const PORT = process.env.PORT;
const BB_API_KEY = process.env.BB_API_KEY;
const BB_OAuth = process.env.BB_OAuth

// Course Selection Offerings = 147977
// Course Requests = 147973
const options = {
    method: "GET",
    url: "https://api.sky.blackbaud.com/school/v1/lists/advanced/147973?page=1&page_size=1000",
    headers: {
    "Bb-Api-Subscription-Key": BB_API_KEY,
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