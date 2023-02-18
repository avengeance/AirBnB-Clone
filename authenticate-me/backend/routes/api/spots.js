const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot } = require('../../db/models');
const { Review } = require('../../db/models');
const { SpotImage } = require('../../db/models')
const { User } = require('../../db/models')

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { QueryInterface } = require('sequelize');
const spot = require('../../db/models/spot');

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

router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id
    const user = await Spot.findByPk(userId)
    if (user) {
        allSpots = await Spot.findAll({ where: { ownerId: userId } })
        res.status(200)
        return res.json({ "Spots": allSpots })
    } else {
        throw new Error('No user logged in')
    }

})

// Get details of a Spot from an Id
// server is hanging
router.get('/:spotid', async (req, res) => {
    const spotId = req.params.id
    const spot = await Spot.findByPk(spotId, {
        include: [
            { model: SpotImage, attributes: ['id', 'url', 'preview'] },
            { model: User, as: 'Owner', attributes: ['id', 'firstName', 'lastName'] }
        ]
    })

    if (spot) {
        res.status(200)
        return res.json(spot)
    }
})

module.exports = router;
