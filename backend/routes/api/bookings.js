const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, Booking, ReviewImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { QueryInterface, Sequelize, Op } = require('sequelize');

const router = express.Router();

// Get all of the current user's bookings
router.get('/current', requireAuth, async (req, res) => {
    const userId = req.user.id
    const bookings = await Booking.findAll({
        where: { userId: userId },
        include: [
            {
                model: Spot, attributes: ['id', 'ownerId', 'address', 'city',
                    'state', 'country', 'lat', 'lng', 'name', 'price'
                ],
                include: { model: SpotImage, attributes: ['url'] }
            },
        ]
    })

    return res.json({ "Bookings": bookings })
})

// Edit a booking
router.put('/:bookingId', requireAuth, async (req, res) => {
    const bookingId = req.params.bookingId
    const { startDate, endDate } = req.body
    const userId = req.user.id
    const spotId = req.params.spotId
    const booking = await Booking.findByPk(bookingId)
    if (!booking) {
        return res.status(404).json({
            "message": "Booking couldn't be found",
            "statusCode": 404
        })
    }
    if (new Date(endDate) < new Date(startDate)) {
        return res.status(400).json({
            "message": "Validation error",
            "statusCode": 400,
            "errors": {
                "endDate": "endDate cannot come before startDate"
            }
        })
    }
    if (new Date() > new Date(endDate)) {
        return res.status(403).json({
            "message": "Past bookings can't be modified",
            "statusCode": 403
        })
    }

    const checkConflict = await Booking.findAll({
        where: {
            spotId: bookingId,
            startDate: {
                [Op.lte]: new Date(endDate)
            },
            endDate: {
                [Op.gte]: new Date(startDate)
            },
            id: {
                [Op.ne]: bookingId
            }
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

    if (checkConflict.startDate === new Date(startDate) || checkConflict.endDate === new Date(endDate)) {
        return res.status(403).json({
            "message": "Sorry, this spot is already booked for the specified dates",
            "statusCode": 403,
            "errors": {
                "startDate": "Start date conflicts with an existing booking",
                "endDate": "End date conflicts with an existing booking"
            }
        })
    }




    const updateBooking = await booking.update({
        startDate: new Date(startDate),
        endDate: new Date(endDate)
    })

    return res.status(200).json(updateBooking)

})

module.exports = router;
