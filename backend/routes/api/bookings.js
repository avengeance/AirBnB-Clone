const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, Booking, ReviewImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { QueryInterface, Sequelize } = require('sequelize');

const router = express.Router();

router.get('/current', requireAuth, async (req, res) => {
    const { SpotImage } = require('./index.js')
    const allBookings = await Booking.findAll({
        // attributes: ['id', 'spotId'],
        attributes: ['id', 'spotId', {
            include: [
                {
                    model: Spot, attributes: [
                        'id', 'ownerId', 'address', 'city', 'state', 'country',
                        'lat', 'lng', 'name', 'description', 'price',
                        // include: { model: SpotImage, attributes: [] },
                        // include: [Sequelize.col('SpotImages.url'), 'previewImage',]
                        // }
                    ]
                }
            ]
        }, 'userId', 'startDate', 'endDate', 'createdAt', 'updatedAt'],
    },
)
return res.json({ "Bookings": allBookings })
})

module.exports = router;
