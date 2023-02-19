const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { QueryInterface, Sequelize } = require('sequelize');

const router = express.Router();

const validateSpotError = [
    check('address')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Street address is required'),
    check('city')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('City is required'),
    check('state')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('State is required'),
    check('country')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Country is required'),
    check('lat')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isFloat({ min: -90, max: 90 })
        .withMessage("Latitude is not valid"),
    check('lng')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isFloat({ min: -180, max: 180 })
        .withMessage("Longitude is not valid"),
    check('name')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isLength({ max: 49 })
        .withMessage('Name must be less than 50 characters'),
    check('description')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Description is required'),
    check('price')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Price per day is required'),
    handleValidationErrors
]

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

    const allSpots = await Spot.scope({
        method: ['includePrevAvg', req.user.id],
    }).findAll()
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
router.post('/', requireAuth, validateSpotError, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const ownerId = req.user.id

    const newSpot = await Spot.create({
        ownerId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price
    })
    return res.status(201).json(newSpot)

})

// Add an image to a spot based on the Spot's Id
router.post('/:spotId/images', requireAuth, async (req, res) => {
    const userId = req.user.id
    const { url, preview } = req.body
    const spotId = req.params.spotId
    const spot = await Spot.findByPk(spotId)
    if (!spot) {
        res.status(404)
        return res.json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
    if (userId !== spot.ownerId) {
        return res.status(400).json({
            "message": "User is not authorized"
        })
    }
    const newImage = await SpotImage.create({
        spotId: spotId,
        url: url,
        preview: preview
    })
    return res.status(200).json({
        id: newImage.id,
        url: newImage.url,
        preview: newImage.preview
    })
})

// Edit a Spot
router.put('/:spotId', requireAuth, async (req, res) => {
    const { address, city, state, country, lat, lng, name, description, price } = req.body
    const spotId = req.params.id
    const spot = Spot.findByPk(spotId)

    const validationErrors = {
        "message": "Validation error",
        "statusCode": 400,
        "errors": {}
    }

    if (!req.body.address) {
        validationErrors.errors.address = "Street address is required"
    } else if (!req.body.city) {
        validationErrors.errors.city = "City is required"
    } else if (!req.body.state) {
        validationErrors.errors.state = "State is required"
    } else if (!req.body.country) {
        validationErrors.errors.country = "Country is required"
    } else if (!req.body.lat) {
        validationErrors.errors.lat = "Latitude is not valid"
    } else if (!req.body.lng) {
        validationErrors.errors.lng = "Longitude is not valid"
    } else if (!req.body.name || req.body.name.length >= 50) {
        validationErrors.errors.name = "Name must be less than 50 characters"
    } else if (!req.body.description) {
        validationErrors.errors.description = "Description is required"
    } else if (!req.body.price) {
        validationErrors.errors.price = "Price per day is required"
    }

    if (Object.values(validationErrors.errors).length) {
        return res.json({ validationErrors })
    }

    if (spot) {
        return res.status(200).json({
            address,
            city,
            state,
            country,
            lat,
            lng,
            name,
            description,
            price
        })
    }
})


module.exports = router;
