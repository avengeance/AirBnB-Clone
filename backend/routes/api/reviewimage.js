const express = require('express')

const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { Spot, Review, SpotImage, User, Booking, ReviewImage } = require('../../db/models');

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { QueryInterface, Sequelize, Op, Model } = require('sequelize');

const router = express.Router();

// Delete a Review Image
router.delete('/:imageId', requireAuth, async (req, res) => {
    const imageId = req.params.imageId
    const image = await ReviewImage.findByPk(imageId, {
        include: { model: Review }
    })
    if (!image) {
        return res.status(404).json({
            "message": "Review Image couldn't be found",
            "statusCode": 404
        })
    }
    if (image.Review.userId !== req.user.id) {
        return res.status(403).json({
            "message": "User not authorized",
            "statusCode": 403
        })
    } else {
        await image.destroy(imageId)
        return res.status(200).json({
            "message": "Successfully deleted",
            "statusCode": 200
        })
    }
})


module.exports = router;
