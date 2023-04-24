const express = require('express');
const path = require('path');
const session = require('express-session');
const bodyParser = require('body-parser');
require('dotenv').config()
const PORT = process.env.PORT;
const SESSION_SECRET = process.env.SESSION_SECRET;

const authRouter = require('./routes/authRoutes');
const apiRouter = require('./routes/apiRoutes');
const authController = require('./controllers/authController');

const sessionConfig = {
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET
};

const app = express();
app.use(bodyParser.json());
app.use(session(sessionConfig));

app.use("/auth", authRouter);
app.use("/api", apiRouter);

app.get('/', authController.checkSession, (req, res) => {
    // res.writeHead(200, { 'Content-Type': 'text/plain' }).json({ access_token: req.session.ticket });
    res.end('Hello World');
})

app.listen(PORT, () => {
    console.log(`Server listening on Port ${PORT}`);
});