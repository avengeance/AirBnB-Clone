const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { QueryInterface } = require('sequelize');

const router = express.Router();

// Get all spots

router.get('/', async (req, res) => {

})


module.exports = router;
