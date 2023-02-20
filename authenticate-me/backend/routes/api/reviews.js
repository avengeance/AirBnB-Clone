const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, Booking, ReviewImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { QueryInterface, Sequelize } = require('sequelize');
const spotimage = require('../../db/models/spotimage');

const router = express.Router();

router.get('/current', async (req, res) => {
    const userId = req.user.id
    const user = await Review.findByPk(userId)
    if (user) {
        allReviews = await Review.scope({
            method:['includeUserSpotReviewImages',req.user.id],
        }).findAll({})
    }
    return res.json({ "Reviews": allReviews })
})

module.exports = router;
