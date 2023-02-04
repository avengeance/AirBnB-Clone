//  import the following packages:

const express = require('express');
require('express-async-errors');
const morgan = require('morgan');
const cors = require('cors');
const csurf = require('csurf');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');

// Create a variable called isProduction that will be true if the 
// environment is in production or not by checking the environment 
// key in the configuration file (backend/config/index.js):

const { environment } = require('./config');
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


   const routes = require('./routes')

   app.use(routes)








   module.exports = app
