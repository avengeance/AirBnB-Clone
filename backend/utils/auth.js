const jwt = require('jsonwebtoken');
const { jwtConfig } = require('../config');
const { User } = require('../db/models');

const { secret, expiresIn } = jwtConfig;
// This first function is setting the JWT cookie after a user 
// is logged in or signed up. It takes in the response and the
// session user and generates a JWT using the imported secret.

// sends a JWT cookie
const setTokenCookie = (res, user) => {
    // create the token
    const token = jwt.sign(
        { data: user.toSafeObject() },
        secret,
        // It is set to expire in however many seconds you set
        // on the JWT_EXPIRES_IN key in the .env file.
        { expiresIn: parseInt(expiresIn) }
    )

    const isProduction = process.env.NODE_ENV === "production";

    // set the token cookie
    res.cookie('token', token, {
        maxAge: expiresIn * 1000, // maxAge in milliseconds
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction && "Lax"
    });

    return token;
};

const restoreUser = (req, res, next) => {
    // token parsed from cookies
    const { token } = req.cookies;
    req.user = null;

    // verify and parse the JWT's payload and search the database
    // for a User with the id in the payload.
    return jwt.verify(token, secret, null, async (err, jwtPayload) => {
        if (err) {
            return next();
        }

        try {
            const { id } = jwtPayload.data;
            // If there is a User found, then save the user to a key of
            // user onto the Request, req.user.
            req.user = await User.scope('currentUser').findByPk(id);
        } catch (e) {
            // If there is an error verifying the JWT or a User cannot
            // be found with the id, then clear the token cookie from
            // the response and set req.user to null.
            res.clearCookie('token');
            return next();
        }

        if (!req.user) res.clearCookie('token');

        return next();
    });
}

// The last authentication middleware to add is for requiring a session
// user to be authenticated before accessing a route.

// If there is no current user, return an error
const requireAuth = function (req, _res, next) {
    // This will ensure that if a valid JWT cookie exists, the session
    // user will be loaded into the req.user attribute.
    if (req.user) return next();

    const err = new Error('Authentication required');
    err.title = 'Authentication required';
    err.errors = ['Authentication required'];
    err.status = 401;
    return next(err);
}


module.exports = { setTokenCookie, restoreUser, requireAuth };
