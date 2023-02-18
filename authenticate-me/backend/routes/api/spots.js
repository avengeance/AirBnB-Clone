const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot } = require('../../db/models');
const { Review } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { QueryInterface } = require('sequelize');

const router = express.Router();

// Get all spots

router.get('/', async (req, res) => {
    const results = await Spot.findAll({
        attributes: [
            'id',
            'ownerId',
            'address',
            'city',
            'state',
            'country',
            'lat',
            'lng',
            'name',
            'description',
            'price',
            'createdAt',
            'updatedAt'
        ]
    })
    return res.json(results)
})

// Get all spots by the current user

router.get('/current', async (req, res) => {
    const user = await Spot.findAll()
    return res.json({ user })
})

module.exports = router;
