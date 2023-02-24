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
    check('firstName')
    .exists({checkFalsy:true})
    .withMessage('First Name is required'),
    check('lastName')
    .exists({checkFalsy:true})
    .withMessage('Last Name is required'),
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

    let validationErrors = {
      "message": "Validation error",
      "statusCode": 400,
      "errors": {}
    }

    if (!req.body.email.length) {
      validationErrors.errors.email = "Invalid email"
    } else if (checkEmail) {
      validationErrors.errors.email = "User with that email already exists"
    } else if (!req.body.username) {
      validationErrors.errors.username = "Username is required"
    } else if (checkUsername) {
      validationErrors.errors.username = "User with that username already exists"
    } else if (!req.body.firstName) {
      validationErrors.errors.firstName = "First Name is required"
    } else if (!req.body.lastName) {
      validationErrors.errors.lastName = "Last Name is required"
    }

    if (Object.values(validationErrors.errors)) {
      return res.json(validationErrors)
    }


    const user = await User.signup({ email, username, password, firstName, lastName });

    const newToken = await setTokenCookie(res, user);
    user.token = newToken
    return res.json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
      token: newToken
    });

  }
);

module.exports = router;
