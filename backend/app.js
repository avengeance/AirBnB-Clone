//  import the following packages:

const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const { environment } = require('./config');
const routes = require('./routes')
const { ValidationError } = require('sequelize');

// Create a variable called isProduction that will be true if the 
// environment is in production or not by checking the environment 
// key in the configuration file (backend/config/index.js):

const isProduction = environment === 'production';

// Initialize the Express application:
const app = express();

// Connect the morgan middleware for logging information about requests and responses:
app.use(morgan('dev'));

// Add the cookie-parser middleware for parsing cookies and the express.json 
// middleware for parsing JSON bodies of requests with Content-Type of "application/json".

app.use(cookieParser());
app.use(express.json());

// Only allow CORS (Cross-Origin Resource Sharing) in development using the cors middleware 
// because the React frontend will be served from a different server than the Express server.

// Security Middleware
if (!isProduction) {
    // enable cors only in development
    app.use(cors());
}

//Enable better overall security with the helmet middleware

// helmet helps set a variety of headers to better secure your app
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin"
    })
);

// Set the _csrf token and create req.csrfToken method
app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true
        }
    })
);

/**
 The csurf middleware will add a _csrf cookie that is HTTP-only 
 (can't be read by JavaScript) to any server response. It also 
 adds a method on all requests (req.csrfToken) that will be set 
 to another cookie (XSRF-TOKEN) later on. These two cookies work 
 together to provide CSRF (Cross-Site Request Forgery) protection 
 for your application. The XSRF-TOKEN cookie value needs to be sent 
 in the header of any request with all HTTP verbs besides GET. 
 This header will be used to validate the _csrf cookie to confirm 
 that the request comes from your site and not an unauthorized site.
 */



app.use(routes);


/*
If this resource-not-found middleware is called, 
an error will be created with the message "The requested 
resource couldn't be found." and a status code of 404. 
Afterwards, next will be invoked with the error. Remember,
next invoked with nothing means that error handlers defined 
after this middleware will not be invoked. However, next 
invoked with an error means that error handlers defined 
after this middleware will be invoked.
*/

// Catch unhandled requests and forward to error handler.
app.use((_req, _res, next) => {
    //
    const err = new Error("The requested resource couldn't be found.");
    err.title = "Resource Not Found";
    err.errors = ["The requested resource couldn't be found."];
    err.status = 404;
    next(err);
});


// Process sequelize errors
app.use((err, _req, _res, next) => {
    // check if error is a Sequelize error:
    if (err instanceof ValidationError) {
        err.errors = err.errors.map((e) => e.message);
        err.title = 'Validation error';
    }
    next(err);
});

// Error formatter
app.use((err, _req, res, _next) => {
    res.status(err.status || 500);
    console.error(err);
    res.json({
        title: err.title || 'Server Error',
        message: err.message,
        errors: err.errors,
        stack: isProduction ? null : err.stack
    });
});



module.exports = app
