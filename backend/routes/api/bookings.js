const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, Booking, ReviewImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { QueryInterface, Sequelize } = require('sequelize');

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


module.exports = router;
