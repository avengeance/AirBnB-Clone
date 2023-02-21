const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, Booking, ReviewImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { QueryInterface, Sequelize } = require('sequelize');

const router = express.Router();

router.get('/current', requireAuth, async (req, res) => {
    const allBookings = await Booking.scope({
        method: ['getBookings', req.params.spotId]
    }).findAll()
    return res.json({ "Bookings": allBookings })
})

module.exports = router;
