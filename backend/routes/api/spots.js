const express = require('express')

const { setTokenCookie, requireAuth, checkPermission, spotAuthorization } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, Booking, ReviewImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { QueryInterface, Sequelize, Op } = require('sequelize');

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

const reviewValidationError = [
    check('review')
        .exists({ checkFalsy: true })
        .notEmpty()
        .withMessage('Review text is required'),
    check('stars')
        .exists({ checkFalsy: true })
        .notEmpty()
        .isFloat({ min: 1, max: 5 })
        .withMessage('Stars must be an integer from 1 to 5'),
    handleValidationErrors
]


// Get all spots
// router.get('/', async (req, res) => {
//     const results = await Spot.findAll({
//         include: [
//             { model: Review, attributes: [] },
//             { model: SpotImage, as: 'previewImage', attributes: [] }
//         ],
//         attributes: [
//             'id',
//             'ownerId',
//             'address',
//             'city',
//             'state',
//             'country',
//             'lat',
//             'lng',
//             'name',
//             'description',
//             'price',
//             'createdAt',
//             'updatedAt',
//             [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
//             [Sequelize.col('SpotImages.url'), 'previewImage']

//         ],
//         group: 'Reviews.spotId',
//     })
//     return res.status(200).json({ "Spots": results })
// })


// Get all spots by the current user
router.get('/current', async (req, res) => {
    const allSpots = await Spot.scope({
        method: ['includePrevAvg', req.user.id],
    }).findAll({ group: ['Reviews.spotId', 'Spot.id', "SpotImages.url"] })
    return res.json({ "Spots": allSpots })
})


// Get details of a Spot from an Id
router.get('/:spotId', async (req, res) => {
    const spotId = req.params.spotId
    // const spot = await Spot.findByPk(spotId, {
    //     attributes: [
    //         'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description',
    //         'price', 'createdAt', 'updatedAt',
    //         [Sequelize.fn('COUNT', Sequelize.col('Reviews.id')), 'numReviews'],
    //         [Sequelize.fn('AVG', Sequelize.col('Reviews.stars')), 'avgRating'],
    //     ],
    //     include: [
    //         { model: Review, attributes: [] },
    //         { model: SpotImage, attributes: ['id', 'url', 'preview'] },
    //         { model: User, as: 'Owner', attributes: ['id', 'firstName', 'lastName'] }
    //     ],
    //     group: ['Reviews.spotId', 'Spot.id', 'SpotImages.url', 'SpotImages.id','Owner.id']
    // })

    const spot = await Spot.findByPk(spotId,
        {
            from: 'spots',
            include: [
                {
                    model: SpotImage,
                    attributes: ['id', 'url', 'preview']
                },
                {
                    model: User,
                    as: 'Owner', //aliasing
                    attributes: ['id', 'firstName', 'lastName'],

                },
                {
                    model: Review,
                    attributes: []
                }
            ],
            attributes: {
                include: [
                    // [Sequelize.fn("COUNT", Sequelize.col("Reviews.stars")), 'numReviews'],
                    // [Sequelize.fn("AVG", Sequelize.col("Reviews.stars")), 'avgStarRating']
                    [Sequelize.literal("COUNT(Reviews.stars)::numeric"), 'numReviews'],
                    [Sequelize.literal("AVG(Reviews.stars)::numeric"), 'avgStarRating']
                ]
            },
            group: ['Spot.id', 'SpotImages.id', "Reviews.spotId", "Owner.id"]
        },
    )
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

    if (spot.ownerId !== req.user.id) {
        return res.status(403).json({
            message: 'User not authorized'
        })
    } else {
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
    }

})

// Edit a Spot
router.put('/:spotId', requireAuth, validateSpotError, async (req, res) => {
    const spotId = req.params.spotId
    const spot = await Spot.findByPk(spotId)
    const { address, city, state, country, lat, lng, name, description, price } = req.body;
    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    if (spot.ownerId !== req.user.id) {
        return res.status(403).json({
            message: 'User not authorized'
        })
    } else {
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

    }
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
    if (spot.ownerId !== req.user.id) {
        return res.status(403).json({
            message: 'User not authorized'
        })
    } else {
        await spot.destroy()
        return res.status(200).json({
            "message": "Successfully deleted",
            "statusCode": 200
        })
    }
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

// Create a review for a Spot based on the Spot's id
router.post('/:spotId/reviews', requireAuth, reviewValidationError, async (req, res) => {
    const userId = req.user.id
    const spotId = req.params.spotId
    const { review, stars } = req.body
    const spot = await Spot.findByPk(spotId)
    const existsReview = await Review.findOne({ where: { userId, spotId } })

    if (existsReview) {
        return res.status(403).json({
            "message": "User already has a review for this spot",
            "statusCode": 403
        })
    }

    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    } else {
        const newReview = await Review.create({
            userId,
            spotId: parseInt(spotId),
            review,
            stars
        })
        return res.status(201).json(newReview)
    }
})

// Create a Booking from a Spot based on the Spot's id
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
    const spotId = req.params.spotId
    const spot = await Spot.findByPk(spotId)
    const { startDate, endDate } = req.body
    const userId = req.user.id
    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }
    if (spot.ownerId !== req.user.id) {
        return res.status(403).json({
            message: 'User not authorized'
        })
    } else {
        if (endDate < startDate) {
            return res.status(400).json({
                "message": "Validation Error",
                "statusCode": 400,
                "errors": {
                    "endDate": "endDate cannot be on or before startDate"
                }
            })
        }
        const checkConflict = await Booking.findAll({
            where: {
                spotId,
                [Op.or]: [
                    {
                        startDate: { [Op.lte]: startDate },
                        endDate: { [Op.gte]: startDate }
                    },
                    {
                        startDate: { [Op.lte]: endDate },
                        endDate: { [Op.gte]: endDate }
                    },
                    {
                        startDate: { [Op.gte]: startDate },
                        endDate: { [Op.lte]: endDate }
                    }
                ]
            }
        })
        if (checkConflict.length) {
            return res.status(403).json({
                "message": "Sorry, this spot is already booked for the specified dates",
                "statusCode": 403,
                "errors": {
                    "startDate": "Start date conflicts with an existing booking",
                    "endDate": "End date conflicts with an existing booking"
                }
            })
        }
        const newBooking = await Booking.create({
            spotId: parseFloat(spotId),
            userId,
            startDate,
            endDate
        })
        return res.status(200).json(newBooking)
    }

})


// Get all Bookings for a Spot based on the Spot's id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
    const spotId = parseInt(req.params.spotId, 10)
    const spot = await Spot.findByPk(spotId)

    if (!spot) {
        return res.status(404).json({
            "message": "Spot couldn't be found",
            "statusCode": 404
        })
    }

    if (spot.ownerId === req.user.id) {
        const bookings = await Booking.findAll({
            where: { spotId: spotId },
            include: { model: User, attributes: ['id', 'firstName', 'lastName'] }
        })
        return res.status(200).json({ "Bookings": bookings })
    } else {
        const bookings = await Booking.findAll({
            where: { spotId: spotId },
            attributes: ['spotId', 'startDate', 'endDate'],
        })
        return res.status(200).json({ "Bookings": bookings })
    }
})

// Add query filters to Get all Spots
router.get('/', async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const size = parseInt(req.query.size) || 20
    const { minLat, maxLat, minLng, maxLng, minPrice = 0, maxPrice = 0 } = req.query
    const limit = Math.min(parseInt(size), 20)
    const offset = (parseInt(page) - 1) * limit
    const filters = {
        ...(minLat && { lat: { [Op.gte]: minLat } }),
        ...(maxLat && { lat: { [Op.lte]: maxLat } }),
        ...(minLng && { lng: { [Op.gte]: minLng } }),
        ...(maxLng && { lng: { [Op.lte]: maxLng } }),
        ...(minPrice && { price: { [Op.gte]: minPrice } }),
        ...(maxPrice && { price: { [Op.lte]: maxPrice } })
    };


    const results = await Spot.scope({ method: ['queryFilter'] }).findAll({
        where: filters,
        limit: limit,
        offset: offset

    })

    if (!results) {
        return res.status(404).json({
            "message": "Spot doesn't exist",
            "statusCode": 404
        })
    }

    if (page < 0) {
        return res.status(400).json({
            'message': "Page must be greater than or equal to 1",
            "statusCode": 400
        })
    } else if (size < 1) {
        return res.status(400).json({
            'message': "Size must be greater than or equal to 1",
            "statusCode": 400
        })
    } else if (minLat && minLat < -90) {
        return res.status(400).json({
            'message': "Minimum latitude is invalid",
            "statusCode": 400
        })
    } else if (maxLat && maxLat > 90) {
        return res.status(400).json({
            'message': "Minimum latitude is invalid",
            "statusCode": 400
        })
    } else if (minLng && minLng < -180) {
        return res.status(400).json({
            'message': "Minimum longitude is invalid",
            "statusCode": 400
        })
    } else if (maxLng && maxLng > 180) {
        return res.status(400).json({
            'message': "Maximum longitude is invalid",
            "statusCode": 400
        })
    } else if (minPrice && minPrice <= 1) {
        return res.status(400).json({
            'message': "Minimum price must be greater than or equal to 1",
            "statusCode": 400
        })
    } else if (maxPrice && maxPrice <= 1) {
        return res.status(400).json({
            'message': "Maximum price must be greater than or equal to 1",
            "statusCode": 400
        })
    } else {
        return res.status(200).json({ "Spots": results, page, size })
    }
})


module.exports = router;
