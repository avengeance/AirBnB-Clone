const express = require('express');

const { setTokenCookie, restoreUser, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');

const router = express.Router();

// a middleware called validateLogin that will check these keys and validate them:
const validateLogin = [
  check('credential')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Please provide a valid email or username.'),
  check('password')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a password.'),
  handleValidationErrors
];

// Log in
router.post(
  '/',
  validateLogin,
  async (req, res, next) => {
    const { credential, password } = req.body;

    const user = await User.login({ credential, password });

    let credentialErrors = {
      "message": "Validation error",
      "statusCode": 400,
      "errors": {}
    }


    if (!req.body.credential) {
      credentialErrors.errors.credential = "Email or username is required"
    } else if (!req.body.password) {
      credentialErrors.errors.password = "Password is required"
    }

    // if (!user) {
    //   const err = new Error('Login failed');
    //   err.status = 401;
    //   err.title = 'Login failed';
    //   err.errors = ['The provided credentials were invalid.'];
    //   return next(err);
    // }

    if (!user) {
      res.status(401)
      return res.json({
        "message": "Invalid credentials",
        "statusCode": 401
      }
      )
    }

    await setTokenCookie(res, user);

    return res.json({
      user
    });
  }
);

// Log out
router.delete(
  '/',
  (_req, res) => {
    res.clearCookie('token');
    return res.json({ message: 'success' });
  }
);


// Restore session user
router.get(
  '/',
  restoreUser,
  (req, res) => {
    const { user } = req;
    if (user) {
      return res.json({
        user: user.toSafeObject()
      });
    } else return res.json({});
  }
);

// Get the current User
router.get(
  '/',
  requireAuth,
  (req, res) => {
    const { user } = req
    if (user) {
      return res.json({
        user: user.toSafeObject()
      });
    } else return res.json({});
  }
)




module.exports = router;
