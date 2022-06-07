const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const createError = require('http-errors');

const winston = require('./utils/winston-logger');
const errorMethods = require('./utils/error-methods.js');
const verifyCredentials = require('./utils/authentication.js');

const lawyerProfileRoute = require('./profile/lawyer-profile-api.js');
const scheduleRoute = require('./scheduler/schedule-api.js');

const app = express(); //getting express app

//urls can be configured using env variables
const lawyerProfileRouteUrl =
    process.env.lawyerProfileRouteUrl || '/v1/profile'; //http url
const scheduleRouteUrl = process.env.scheduleRouteUrl || '/v1/schedule/'; //http url

//generic middleware for redirection, parsing and request logging

app.use(cors()); // solving cors issue using cors middleware
app.use(express.json()); // parsing json request using middleware
app.use(morgan('dev', { stream: winston.stream })); // logging the request

//routes
app.get('/', (req, res) => {
    res.status(200).send('App is Running \n'); //testing the request at baseURL/
});

//health check
app.get('/health', (req, res) => {
    res.status(200).send('Health Check is Successful.\n'); //testing the request at baseURL/
});
app.use(verifyCredentials);
app.use(lawyerProfileRouteUrl, lawyerProfileRoute); //http route
app.use(scheduleRouteUrl, scheduleRoute); //http route

//invalid endpoint
app.use((req, res, next) => {
    next(createError(404, 'Invalid Endpoint. \n'));
});

//middleware for error methods
app.use(errorMethods.errorLogger); //error logger
app.use(errorMethods.errorHandler); //handle error

module.exports = app;
