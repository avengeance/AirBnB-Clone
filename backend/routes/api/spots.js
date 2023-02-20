const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, Booking, ReviewImage } = require('../../db/models');

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
// not displaying new spots that were created from "create a spot"
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
            'updatedAt',
            [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
            [Sequelize.col('SpotImages.url'), 'previewImage']

        ],
        include: [
            { model: Review, attributes: [] },
            { model: SpotImage, attributes: [] }
        ],
        group: 'Reviews.spotId',
    })
    return res.status(200).json({ "Spots": results })
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
router.put('/:spotId', requireAuth, validateSpotError, async (req, res) => {
    const spotId = req.params.spotId
    const spot = await Spot.findByPk(spotId)
    const userId = req.user.id
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
    if (spot.ownerId !== userId) {
        res.status(400).json({
            message: 'User not authorized'
        })
    }
    const update = await spot.update({
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price,
    });
    return res.status(200).json(update)
})

// Delete a spot
router.delete('/:spotId', async (req, res) => {
    const spotId = req.params.spotId
    const spot = await Spot.findByPk(spotId)

    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    if (spot.ownerId !== userId) {
        res.status(400).json({
            message: 'User not authorized'
        })
    }

    await spot.destroy(spotId)

    return res.status(200).json({
        "message": "Successfully deleted",
        "statusCode": 200
    })
})

//Get all reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res) => {
    const spotId = req.params.spotId
    const spot = await Spot.findByPk(spotId)
    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    } else {
        const spotId = req.params.spotId
        const spot = await Spot.findByPk(spotId)
        const allReviews = await Review.findAll({
            where: { spotId: spotId },
            include: [
                { model: User, attributes: ['id', 'firstName', 'lastName'] },
                { model: ReviewImage, attributes: ['id', 'url'] }
            ]
        })
        return res.status(200).json({ "Reviews": allReviews })
    }

})

module.exports = router;
