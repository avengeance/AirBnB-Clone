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
    .withMessage('Email or username is required'),
  check('password')
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage('Password is required'),
  handleValidationErrors
];

// Log in
router.post(
  '/',
  validateLogin,
  async (req, res, next) => {
    const { credential, password } = req.body;

    const user = await User.login({ credential, password });

    if (!user) {
      res.status(401)
      return res.json({
        "message": "Invalid credentials",
        "statusCode": 401
      }
      )
    }

    await setTokenCookie(res, user);
    const { id, username, email, firstName, lastName, createdAt, updatedAt } = user;

    return res.json({
      user: { id, firstName, lastName, email, username, createdAt, updatedAt }
    });
    next();
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
