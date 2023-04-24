require('dotenv').config();
const axios = require('axios');
const AUTH_SUBSCRIPTION_KEY = process.env.AUTH_SUBSCRIPTION_KEY;

const apiController = {};

// Course Selection Offerings = 147977
// Course Requests = 147973

const proxy = (req, method, endpoint, body, callback) => {
    const options = {
        json: true,
        method: method,
        body: body,
        url: 'https://api.sky.blackbaud.com/' + endpoint,
        headers: {
            'bb-api-subscription-key': AUTH_SUBSCRIPTION_KEY,
            'Authorization': 'Bearer ' + req.session.ticket.access_token
        }
    }

    axios
        .request(options)
        .then(callback)
        .catch((error) => {
            console.error(error);
        });
};

apiController.getConstituent = async (req, res, next) => {
    const callback = (results) => {
        console.log('getConstituent() response:\n' + JSON.stringify(results, null, '\t'));
        res.send(results);
    };
    proxy(req, 'GET', 'constituent/v1/constituents/' + req.params.constituentId, '', callback);
    return next();
};

apiController.getConstituentSearch = async (req, name, callback) => {
    proxy(req, 'GET', 'constituent/v1/constituents/search?search_text=' + name, '', callback);
};

apiController.getOfferings = async (req, res, next) => {
    proxy(req, 'GET', 'school/v1/lists/advanced/147977?page=1&page_size=1000', '', response => {
            res.locals.offerings = response.data.results.rows;
            console.log('res.locals.offerings -> ',res.locals.offerings);
            return next();
        }
    )
    // const options = {
    //     method: "GET",
    //     url: "https://api.sky.blackbaud.com/school/v1/lists/advanced/147977?page=1&page_size=1000",
    //     headers: {
    //         "Bb-Api-Subscription-Key": AUTH_SUBSCRIPTION_KEY,
    //         "Authorization": BB_OAuth,
    //     },
    // };
    
    // axios
    //     .request(options)
    //     .then(function (response) {
    //         console.log(response.data.results.rows[0])
    //     })
    //     .catch(function (error) {
    //         console.error(error);
    //     });
};

apiController.getRequests = async (req, res, next) => {
    proxy(req, 'GET', 'school/v1/lists/advanced/147973?page=1&page_size=1000', '', response => {
            res.locals.requests = response.data.results.rows;
            console.log('res.locals.requests -> ',res.locals.requests);
            return next();
        }
    )
};

module.exports = apiController;