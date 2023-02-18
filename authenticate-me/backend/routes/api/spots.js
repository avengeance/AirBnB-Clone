const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { QueryInterface, Sequelize } = require('sequelize');

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
    return res.json({ "Spots": [results] })
})


// Get all spots by the current user
router.get('/current', async (req, res) => {
    const userId = req.user.id
    console.log('userId', userId)
    const allSpots = await Spot.scope({ method: ['includeRatingImage'] }).findAll({ where: { ownerId: userId } })
    return res.json({ "Spots": allSpots })
})



// Get details of a Spot from an Id
router.get('/:spotId', async (req, res) => {
    const spotId = req.params.spotId
    const spot = await Spot.findByPk(spotId, {
        attributes: [
            'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description',
            'price', 'createdAt', 'updatedAt',
            [Sequelize.fn('COUNT', Sequelize.col('Reviews.id')), 'numReviews'],
            [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
        ],
        include: [
            { model: Review, attributes: [] },
            { model: SpotImage, attributes: ['id', 'url', 'preview'] },
            { model: User, as: 'Owner', attributes: ['id', 'firstName', 'lastName'] }
        ]
    })
    if (spot.id) {
        return res.status(200).json(spot)
    } else {
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
})


// Create a spot
router.post('/', requireAuth, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const ownerId = req.user.id

    const validationErrors = {
        "message": "Validation error",
        "statusCode": 400,
        "errors": {}
    }

    if (!req.body.address) {
        validationErrors.errors.address = "Street address is required"
    } else if (!req.body.address) {
        validationErrors.errors.city = "City is required"
    } else if (!req.body.state) {
        validationErrors.errors.state = "State is required"
    } else if (!req.body.country) {
        validationErrors.errors.country = "Country is required"
    } else if (!req.body.description) {
        validationErrors.errors.city = "Description is required"
    } else if (!req.body.price) {
        validationErrors.errors.price = "Price per day is required"
    }

    const newSpot = await Spot.create({
        ownerId, address, city, state, country, lat, lng, name, description, price
    })
    return res.status(201).json(newSpot)

})

// Add an image to a spot based on the Spot's Id
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const spotId = req.params.id
    const spot = await Spot.findOne(spotId)
    const { url, preview } = req.body


    if (spot) {
        const newImage = await SpotImage.create({
            spotId: parseInt(spotId),
            url,
            preview
        })
        return res.status(200).json(newImage)
    } else {
        res.status(404)
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

})




module.exports = router;
