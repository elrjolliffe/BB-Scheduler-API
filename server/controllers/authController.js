require('dotenv').config();
const AUTH_REDIRECT_URI = process.env.AUTH_REDIRECT_URI;
const AUTH_CLIENT_ID = process.env.AUTH_CLIENT_ID;
const AUTH_CLIENT_SECRET = process.env.AUTH_CLIENT_SECRET;
const { AuthorizationCode } = require('simple-oauth2');
const crypto = require('crypto');

config = {
    client: {
        id: AUTH_CLIENT_ID,
        secret: AUTH_CLIENT_SECRET
    },
    auth: {
        tokenHost: 'https://oauth2.sky.blackbaud.com',
        authorizePath: '/authorization',
        tokenPath: '/token'
    }
};

authCodeClient = new AuthorizationCode(config);

const saveTicket = (req, ticket) => {
    req.session.ticket = ticket;
    req.session.expires = (new Date().getTime() + (1000 * ticket.expires_in));
};

const validate = async (req, callback) => {
    let dtCurrent;
    let dtExpires;
    let accessToken;

    if (req.session && req.session.ticket && req.session.expires) {

        dtCurrent = new Date();
        dtExpires = new Date(req.session.expires);

        if (dtCurrent >= dtExpires) {
            console.log('Token expired');

            // Check if the token is expired. If expired it is refreshed.
            accessToken = authCodeClient.createToken(req.session.ticket);

            try {
                accessToken = await accessToken.refresh();
            
                saveTicket(request, accessToken.token);
                callback(true);
            } catch (_) {
                callback(false);
            }
        } else {
            callback(true);
        }
    } else {
        callback(false);
    }
};

const authController = {};

// authorization instructions: https://developer.blackbaud.com/skyapi/docs/authorization/auth-code-flow/confidential-application/code-samples/nodejs

authController.checkSession = async (req, res, next) => {
    validate(req, (valid) => {
        if (valid) {
            console.log("Session validated.");
            return next();
        } else {
            console.log("Session not valid.");
            res.sendStatus(401);
        }
    });
}

authController.getLogin = async (req, res, next) => {
    const base64URLEncode = (str) => {
        return str.toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=/g, '');
    };

    req.session.redirect = request.query.redirect;
    req.session.state = crypto.randomBytes(48).toString('hex');

    const codeVerifier = base64URLEncode(crypto.randomBytes(32));
    const challengeDigest = crypto
        .createHash("sha256")
        .update(codeVerifier)
        .digest();

    const codeChallenge = base64URLEncode(challengeDigest);
    req.session.code_verifier = codeVerifier;

    res.redirect(authCodeClient.authorizeURL({
        redirect_uri: AUTH_REDIRECT_URI,
        state: req.session.state,
        code_challenge: codeChallenge,
        code_challenge_method: 'S256'
    }));
    return next();
};

authController.getAuthenticated = async (req, res, next) => {
    return next();
};

authController.getCallback = async (req, res, next) => {

    let error;
    if (req.query.error) {
        error = req.query.error;
    } else if (!req.query.code) {
        error = 'auth_missing_code';
    } else if (!req.query.state) {
        error = 'auth_missing_state';
    } else if (req.session.state !== req.query.state) {
        error = 'auth_invalid_state';
    } else if (!req.session.code_verifier) {
        error  = 'auth_missing_code_verifier';
    }

    if (!error) {
        const options = {
            code: req.query.code,
            redirect_uri: AUTH_REDIRECT_URI,
            code_verifier: req.session.code_verifier
        };
        try {
            const accessToken = await authCodeClient.getToken(options);

            const redirect = req.session.redirect || '/';

            req.session.redirect = '';
            req.session.state = '';
            req.session.code_verifier = undefined;

            saveTicket(request, accessToken.token);
            res.redirect(redirect);
        } catch (errorToken) {
            error = errorToken.message;
        };
    }

    if (error) {
        res.redirect('/#?error=' + error);
    }
    return next();
};

authController.getLogout = async (req, res, next) => {
    const redirect = req.session.redirect || '/';

    req.session.destroy();
    res.redirect(redirect);
    return next();
};

module.exports = authController;