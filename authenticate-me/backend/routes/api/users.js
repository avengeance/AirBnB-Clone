const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { QueryInterface } = require('sequelize');

const router = express.Router();

const validateSignup = [
  check('email')
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage('Please provide a valid email.'),
  check('username')
    .exists({ checkFalsy: true })
    .isLength({ min: 4 })
    .withMessage('Please provide a username with at least 4 characters.'),
  check('username')
    .not()
    .isEmail()
    .withMessage('Username cannot be an email.'),
  check('password')
    .exists({ checkFalsy: true })
    .isLength({ min: 6 })
    .withMessage('Password must be 6 characters or more.'),
  handleValidationErrors
];

// Sign up
router.post(
  '/',
  validateSignup,
  async (req, res) => {
    const { email, username, password, firstName, lastName } = req.body;

    const checkEmail = await User.findOne({ where: { email } })
    const checkUsername = await User.findOne({ where: { username } })

    if (checkEmail === null && checkUsername === null) {
      const user = await User.signup({ email, username, password, firstName, lastName });
      await setTokenCookie(res, user);
      return res.json({
        user,
      });
    } else if (checkEmail) {
      return res.json({
        "message": "User already exists",
        "statusCode": 403,
        "errors": {
          "email": "User with that email already exists"
        }
      })
    } else if (checkUsername) {
      return res.json({
        "message": "User already exists",
        "statusCode": 403,
        "errors": {
          "username": "User with that username already exists"
        }
      })
    } else {
      return res.json({
        "message": "Validation error",
        "statusCode": 400,
        "errors": {
          "email": "Invalid email",
          "username": "Username is required",
          "firstName": "First Name is required",
          "lastName": "Last Name is required"
        }
      })
    }

  }
);

module.exports = router;
