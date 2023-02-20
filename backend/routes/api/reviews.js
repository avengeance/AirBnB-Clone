const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, Booking, ReviewImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { QueryInterface, Sequelize } = require('sequelize');
const spotimage = require('../../db/models/spotimage');
const reviewimage = require('../../db/models/reviewimage');

const router = express.Router();


// Get all reviews of the current user
// find a way to remove 'SpotImages' and only display previewImage
router.get('/current', async (req, res) => {
    const userId = req.user.id
    const user = await Review.findByPk(userId)
    if (user) {
        allReviews = await Review.scope({
            method: ['includeUserSpotReviewImages', req.user.id],
        }).findAll({})
    }
    return res.json({ "Reviews": allReviews })
})


// Add an image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res) => {
    const reviewId = req.params.reviewId
    const { url } = req.body
    const review = await Review.findByPk(reviewId)
    const countReview = await Review.findByPk(reviewId, {
        attributes: [
            [Sequelize.fn('COUNT', Sequelize.col('ReviewImage.id')), 'numReviews']
        ],
        include: [
            { model: reviewimage, attributes: [] }
        ]
    })

    if (countReview >= 10) {
        return res.status(403).json({
            "message": "Maximum number of images for this resource was reached",
            "statusCode": 403
        })
    }
    if (!review) {
        return res.status(404).json({
            "message": "Review couldn't be found",
            "statusCode": 404
        })
    }
    const newImage = await ReviewImage.create({
        reviewId: reviewId,
        url: url
    })
    return res.status(200).json({
        id: newImage.id,
        url: newImage.url
    })
})

module.exports = router;
